import { prisma } from '../../shared/lib/prisma.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';

export class OrderService {
  /**
   * Get all orders (admin only)
   */
  async getAllOrders() {
    return prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get user's orders with filtering and pagination
   */
  async getOrders(userId: string, filters: { status?: string; limit?: number; offset?: number }) {
    const where: any = { userId };
    if (filters.status) where.status = filters.status;

    return prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });
  }

  /**
   * Get single order by ID
   */
  async getOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    return order;
  }

  /**
   * Get single order by order number
   */
  async getOrderByNumber(userId: string, orderNumber: string) {
    const order = await prisma.order.findFirst({
      where: { orderNumber, userId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    return order;
  }

  /**
   * Create an order (Transactional)
   */
  async createOrder(userId: string, data: {
    items: Array<{ variantId: string; quantity: number }>;
    shippingAddressId: string;
    billingAddressId?: string;
    paymentMethod: string;
    customerNotes?: string;
  }) {
    // 1. Fetch dependencies (Address and Variants)
    const [shippingAddress, billingAddress] = await this.getAddresses(userId, data.shippingAddressId, data.billingAddressId);

    const variantIds = data.items.map(item => item.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    // 2. Validate availability and calculate totals
    const { subtotal, orderItems } = this.validateAndPrepareItems(data.items, variants);

    const shippingCost = subtotal > 50000 ? 0 : 5000; // Free shipping over ₹500
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shippingCost + tax;
    const orderNumber = await this.generateOrderNumber();

    // 3. Execute Transaction
    return await prisma.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          subtotal,
          shippingCost,
          tax,
          total,
          paymentMethod: data.paymentMethod,
          shippingAddress: shippingAddress as any,
          billingAddress: billingAddress as any,
          customerNotes: data.customerNotes,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      // Reduce Stock
      for (const item of data.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear specific items from cart
      await tx.cartItem.deleteMany({
        where: {
          userId,
          variantId: { in: variantIds },
        },
      });

      return order;
    });
  }

  /**
   * Update order status (Admin)
   */
  async updateOrderStatus(orderId: string, data: {
    status: string;
    trackingNumber?: string;
    adminNotes?: string;
  }) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Order');

    return prisma.order.update({
      where: { id: orderId },
      data,
      include: { items: true },
    });
  }

  /**
   * Cancel an order (Restores Stock)
   */
  async cancelOrder(userId: string, orderId: string) {
    const order = await this.getOrder(userId, orderId);

    if (['delivered', 'cancelled', 'shipped'].includes(order.status)) {
      throw new BadRequestError(`Cannot cancel order in ${order.status} state`);
    }

    return await prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
        include: { items: true },
      });
    });
  }

  // --- Helper Methods ---

  private async getAddresses(userId: string, shippingId: string, billingId?: string) {
    const shipping = await prisma.address.findFirst({ where: { id: shippingId, userId } });
    if (!shipping) throw new NotFoundError('Shipping address');

    let billing = shipping;
    if (billingId && billingId !== shippingId) {
      const addr = await prisma.address.findFirst({ where: { id: billingId, userId } });
      if (addr) billing = addr;
    }

    return [shipping, billing];
  }

  private validateAndPrepareItems(items: any[], variants: any[]) {
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const variant = variants.find(v => v.id === item.variantId);

      if (!variant) throw new NotFoundError(`Product variant ${item.variantId}`);
      if (!variant.isActive || !variant.product.isActive) {
        throw new BadRequestError(`Product ${variant.product.name} is no longer available`);
      }
      if (variant.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for ${variant.product.name} (${variant.stock} available)`);
      }

      const itemTotal = variant.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: variant.productId,
        variantId: variant.id,
        productName: variant.product.name,
        variantName: variant.name,
        sku: variant.sku,
        quantity: item.quantity,
        price: variant.price,
        total: itemTotal,
      });
    }

    return { subtotal, orderItems };
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `ORD${year}${month}${day}${sequence}`;
  }
}

export const orderService = new OrderService();
