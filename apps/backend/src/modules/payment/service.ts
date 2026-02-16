import { razorpay, verifyPaymentSignature, verifyWebhookSignature, isRazorpayConfigured, RAZORPAY_KEY_ID } from '../../config/razorpay.js';
import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';

export interface CreatePaymentOrderInput {
  userId: string;
  amount: number;
  currency?: string;
  idempotencyKey?: string;
}

export interface VerifyPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface CreateOrderAfterPaymentInput {
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  shippingAddressId: string;
  billingAddressId?: string;
  customerNotes?: string;
}

class PaymentService {
  async createOrder(input: CreatePaymentOrderInput) {
    console.log('[PaymentService] Creating order, isRazorpayConfigured:', isRazorpayConfigured());
    console.log('[PaymentService] razorpay instance:', razorpay);
    
    if (!isRazorpayConfigured() || !razorpay) {
      throw new Error('Razorpay is not configured');
    }

    const { userId, amount, currency = 'INR', idempotencyKey } = input;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: { product: true }
        }
      }
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.variant.price * item.quantity);
    }, 0);

    const totalAmount = amount || subtotal;

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount,
      currency,
      receipt: `fur_${Date.now()}`,
      notes: {
        userId,
        idempotencyKey: idempotencyKey || `idem_${Date.now()}`
      }
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: RAZORPAY_KEY_ID
    };
  }

  async verifyPaymentAndCreateOrder(input: CreateOrderAfterPaymentInput) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, shippingAddressId, billingAddressId, customerNotes } = input;

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    const existingOrder = await prisma.order.findFirst({
      where: { razorpayPaymentId }
    });
    if (existingOrder) {
      return { order: existingOrder, alreadyProcessed: true };
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: { product: true }
        }
      }
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
    const shippingCost = subtotal >= 50000 ? 0 : 4999;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shippingCost + tax;

    const shippingAddress = await prisma.address.findUnique({
      where: { id: shippingAddressId }
    });

    if (!shippingAddress || shippingAddress.userId !== userId) {
      throw new Error('Invalid shipping address');
    }

    const orderNumber = `FUR${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const result = await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId }
        });
        
        if (!variant || variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.variant.product.name}`);
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: variant.stock - item.quantity
          }
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: 'confirmed',
          subtotal,
          shippingCost,
          tax,
          discount: 0,
          total,
          paymentMethod: 'online',
          paymentStatus: 'paid',
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          paidAt: new Date(),
          shippingAddress: {
            label: shippingAddress.label,
            fullName: shippingAddress.fullName,
            phone: shippingAddress.phone,
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country
          },
          customerNotes,
          items: {
            create: cartItems.map(item => ({
              productId: item.variant.productId,
              variantId: item.variantId,
              productName: item.variant.product.name,
              variantName: item.variant.name,
              sku: item.variant.sku,
              quantity: item.quantity,
              price: item.variant.price,
              total: item.variant.price * item.quantity
            }))
          }
        },
        include: {
          items: true
        }
      });

      await tx.cartItem.deleteMany({
        where: { userId }
      });

      return order;
    });

    return { order: result, alreadyProcessed: false };
  }

  async handleWebhook(payload: string, signature: string) {
    const isValid = verifyWebhookSignature(payload, signature);
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    const event = JSON.parse(payload);
    const { event: eventType, payload: eventPayload } = event;

    switch (eventType) {
      case 'payment.captured': {
        const payment = eventPayload.payment;
        const orderId = payment.order_id;

        const order = await prisma.order.findFirst({
          where: { razorpayOrderId: orderId }
        });

        if (order && order.paymentStatus !== 'paid') {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'paid',
              paidAt: new Date(),
              razorpayPaymentId: payment.id
            }
          });
        }
        break;
      }

      case 'payment.failed': {
        const payment = eventPayload.payment;
        const orderId = payment.order_id;

        const order = await prisma.order.findFirst({
          where: { razorpayOrderId: orderId }
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'failed',
              status: 'cancelled'
            }
          });
        }
        break;
      }

      case 'order.paid': {
        console.log('Order paid event received:', eventPayload.order?.id);
        break;
      }

      default:
        console.log('Unhandled webhook event:', eventType);
    }

    return { received: true };
  }

  async getPaymentOrderDetails(razorpayOrderId: string) {
    if (!isRazorpayConfigured() || !razorpay) {
      throw new Error('Razorpay is not configured');
    }

    const order = await razorpay.orders.fetch(razorpayOrderId);
    return order;
  }
}

export const paymentService = new PaymentService();
