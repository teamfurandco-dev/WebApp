import type { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/lib/prisma.js';
import { success } from '../../shared/utils/response.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';

export async function profileRoutes(fastify: FastifyInstance) {
  // GET /profile/dashboard - Consolidated profile data
  fastify.get('/profile/dashboard', {
    onRequest: [authenticate],
    schema: {
      description: 'Get all profile dashboard data in one call - Profile, orders, addresses, stats',
      tags: ['Profile', 'Currently in Use - Optimized'],
    }
  }, async (request) => {
    const userId = request.user.id;

    const [profileData, ordersData, addressesData, statsData] = await Promise.all([
      // Profile data
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatarUrl: true,
          role: true,
          petTypes: true,
          createdAt: true,
        }
      }),

      // Recent orders
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true, // Prisma field name
          createdAt: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              variant: {
                select: {
                  name: true,
                  product: {
                    select: {
                      name: true,
                      images: {
                        where: { isPrimary: true },
                        take: 1,
                        select: { filePath: true, bucketName: true }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }),

      // Addresses
      prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: 'desc' },
        select: {
          id: true,
          fullName: true,
          phone: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
          isDefault: true,
        }
      }),

      // User stats
      prisma.$transaction([
        prisma.order.count({ where: { userId } }),
        prisma.order.aggregate({
          where: { userId, status: 'delivered' },
          _sum: { total: true }
        }),
        prisma.review.count({ where: { userId } }),
        prisma.wishlistItem.count({ where: { userId } })
      ])
    ]);

    const [orderCount, totalSpent, reviewCount, wishlistCount] = statsData;

    // Transform Profile to match frontend expectations
    const profile = profileData ? {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.name, // Frontend expects full_name
      phone: profileData.phone,
      avatar_url: profileData.avatar_url || profileData.avatarUrl,
      role: profileData.role,
      pet_types: profileData.petTypes || [],
      created_at: profileData.createdAt,
    } : null;

    // Transform Orders
    const orders = ordersData.map(order => ({
      id: order.id,
      order_number: order.orderNumber,
      status: order.status,
      total_amount: order.total,
      created_at: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
        name: item.variant?.product?.name || 'Product',
        variant_name: item.variant?.name || 'Default',
        image: item.variant?.product?.images?.[0]
          ? getPublicUrl(item.variant.product.images[0].bucketName, item.variant.product.images[0].filePath)
          : null
      }))
    }));

    // Transform Addresses
    const addresses = addressesData.map(addr => ({
      id: addr.id,
      full_name: addr.fullName,
      phone: addr.phone,
      line1: addr.addressLine1,
      line2: addr.addressLine2,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postalCode,
      country: addr.country,
      is_default: addr.isDefault,
    }));

    return success({
      profile,
      orders,
      addresses,
      stats: {
        totalOrders: orderCount,
        totalSpent: totalSpent._sum.total || 0,
        reviewsWritten: reviewCount,
        wishlistItems: wishlistCount
      }
    });
  });
}
