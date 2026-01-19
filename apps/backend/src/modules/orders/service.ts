import { prisma } from '../../shared/lib/prisma.js';


export class OrderService {
  /**
   * Get user's orders
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
   * Get single order
   */
  async getOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: true,
      },
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  }
  
  /**
   * Get order by order number
   */
  async getOrderByNumber(userId: string, orderNumber: string) {
    const order = await prisma.order.findFirst({
      where: { orderNumber, userId },
      include: {
        items: true,
      },
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  }
  
  /**
   * Create order from cart or items
   */
  async createOrder(userId: string, data: {
    items: Array<{ variantId: string; quantity: number }>;
    shippingAddressId: string;
    billingAddressId?: string;
    paymentMethod: string;
    customerNotes?: string;
  }) {
    // Get shipping address
    const shippingAddress = await prisma.address.findFirst({
      where: { id: data.shippingAddressId, userId },
    });
    
    if (!shippingAddress) {
      throw new Error('Shipping address not found');
    }
    
    // Get billing address (use shipping if not provided)
    let billingAddress = shippingAddress;
    if (data.billingAddressId) {
      const addr = await prisma.address.findFirst({
        where: { id: data.billingAddressId, userId },
      });
      if (addr) billingAddress = addr;
    }
    
    // Fetch variants with product details
    const variantIds = data.items.map(item => item.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });
    
    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];
    
    for (const item of data.items) {
      const variant = variants.find(v => v.id === item.variantId);
      
      if (!variant) {
        throw new Error(`Variant ${item.variantId} not found`);
      }
      
      if (!variant.isActive || !variant.product.isActive) {
        throw new Error(`Product ${variant.product.name} is not available`);
      }
      
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${variant.product.name} - ${variant.name}`);
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
    
    // Calculate shipping and tax (simplified)
    const shippingCost = subtotal > 50000 ? 0 : 5000; // Free shipping over ₹500
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shippingCost + tax;
    
    // Generate order number
    const orderNumber = await this.generateOrderNumber();
    
    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        subtotal,
        shippingCost,
        tax,
        total,
        paymentMethod: data.paymentMethod,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        customerNotes: data.customerNotes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });
    
    // Reduce stock
    for (const item of data.items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
    
    // Clear cart if items were from cart
    await prisma.cartItem.deleteMany({
      where: {
        userId,
        variantId: { in: variantIds },
      },
    });
    
    return order;
  }
  
  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(orderId: string, data: {
    status: string;
    trackingNumber?: string;
    adminNotes?: string;
  }) {
    return prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        items: true,
      },
    });
  }
  
  /**
   * Cancel order
   */
  async cancelOrder(userId: string, orderId: string) {
    const order = await this.getOrder(userId, orderId);
    
    if (order.status === 'delivered' || order.status === 'cancelled') {
      throw new Error('Cannot cancel this order');
    }
    
    // Restore stock
    for (const item of order.items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }
    
    return prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
      include: {
        items: true,
      },
    });
  }
  
  /**
   * Generate unique order number
   */
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
        },
      },
    });
    
    const sequence = (count + 1).toString().padStart(4, '0');
    return `ORD${year}${month}${day}${sequence}`;
  }
}

export const orderService = new OrderService();
