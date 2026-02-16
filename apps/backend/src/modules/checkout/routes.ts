import { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/lib/prisma.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { success } from '../../shared/utils/response.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';

export async function checkoutRoutes(fastify: FastifyInstance) {
  fastify.get('/checkout/summary', {
    preHandler: authenticate
  }, async (request: any, reply: any) => {
    try {
      const userId = request.user.id;
      console.log('[Checkout] Fetching cart for user:', userId);

      const [cartItems, addresses] = await Promise.all([
        prisma.cartItem.findMany({
          where: { userId },
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: true,
                    averageRating: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.address.findMany({
          where: { userId },
          orderBy: { isDefault: 'desc' }
        })
      ]);

      console.log('[Checkout] Found cart items:', cartItems.length);
      console.log('[Checkout] Found addresses:', addresses.length);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
    const shippingCost = subtotal >= 50000 ? 0 : 4999;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shippingCost + tax;

    const stockCheck = {
      available: [] as string[],
      unavailable: [] as string[]
    };

    for (const item of cartItems) {
      if (item.variant.stock >= item.quantity) {
        stockCheck.available.push(item.variantId);
      } else {
        stockCheck.unavailable.push(item.variantId);
      }
    }

    const shippingAddresses = addresses.filter(a => a.type === 'shipping' || a.type === 'both');
    const billingAddresses = addresses.filter(a => a.type === 'billing' || a.type === 'both');

    return success({
      cart: {
        items: cartItems.map(item => {
          const primaryImage = item.variant.product.images[0];
          const imageUrl = primaryImage ? getPublicUrl(primaryImage.bucketName, primaryImage.filePath) : null;
          return {
            id: item.id,
            quantity: item.quantity,
            name: item.variant.product.name,
            base_price_cents: item.variant.price,
            price_cents: item.variant.price,
            image: imageUrl,
            product: {
              id: item.variant.product.id,
              name: item.variant.product.name,
              slug: item.variant.product.slug,
              images: item.variant.product.images,
              image: imageUrl,
              rating: item.variant.product.averageRating,
              category: null
            },
            variant: {
              id: item.variant.id,
              name: item.variant.name,
              price: item.variant.price,
              price_cents: item.variant.price,
              stock: item.variant.stock,
              stock_quantity: item.variant.stock,
              sku: item.variant.sku,
              image: imageUrl
            }
          };
        }),
        totals: {
          subtotal,
          shipping: shippingCost,
          tax,
          total,
          itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        },
        recommendedProducts: []
      },
      addresses: {
        shipping: shippingAddresses,
        billing: billingAddresses
      },
      stockCheck
    });
    } catch (error) {
      console.error('[Checkout] Error:', error);
      return reply.code(500).send({
        success: false,
        error: { message: 'Failed to fetch checkout summary', code: 'CHECKOUT_ERROR' }
      } as any);
    }
  });
}
