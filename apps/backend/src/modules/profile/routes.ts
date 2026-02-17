import type { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/lib/prisma.js';
import { success } from '../../shared/utils/response.js';
import { authenticate } from '../../shared/middleware/auth.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';

export async function profileRoutes(fastify: FastifyInstance) {
  // GET /profile/dashboard - Consolidated profile data
  fastify.get('/profile/dashboard', {
    onRequest: [authenticate],
  }, async (request: any) => {
    const userId = request.user!.id;
    const email = request.user!.email;

    // Fetch profile data first
    const profileData = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, phone: true, avatarUrl: true, role: true }
    });

    const profile = profileData ? {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.name,
      phone: profileData.phone,
      avatar_url: profileData.avatarUrl,
      pet_types: [], // Temporarily empty to resolve sync issues
    } : null;

    // Fetch other data pieces with individual safety
    let orders: any[] = [];
    let addresses: any[] = [];
    let stats = { totalOrders: 0, totalSpent: 0, reviewsWritten: 0, wishlistItems: 0 };

    try {
      const ordersData = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, orderNumber: true, status: true, total: true, createdAt: true }
      });
      orders = ordersData.map(o => ({
        id: o.id,
        order_number: o.orderNumber,
        status: o.status,
        total_amount: o.total,
        created_at: o.createdAt,
        items: []
      }));
    } catch (e) {
      console.error('Dashboard orders fetch failed:', e);
    }

    try {
      const addrData = await prisma.address.findMany({
        where: { OR: [{ userId }, { user: { email } }] },
        orderBy: { isDefault: 'desc' },
      });
      addresses = addrData.map(a => ({
        id: a.id,
        fullName: a.fullName,
        phone: a.phone,
        addressLine1: a.addressLine1,
        addressLine2: a.addressLine2,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        isDefault: a.isDefault,
        label: a.label
      }));
    } catch (e) {
      console.error('Dashboard addresses fetch failed:', e);
    }

    try {
      const [orderCount, reviewCount, wishlistCount] = await Promise.all([
        prisma.order.count({ where: { userId } }),
        prisma.review.count({ where: { userId } }),
        prisma.wishlistItem.count({ where: { userId } })
      ]);
      stats = { ...stats, totalOrders: orderCount, reviewsWritten: reviewCount, wishlistItems: wishlistCount };
    } catch (e) {
      console.error('Dashboard stats fetch failed:', e);
    }

    return success({ profile, orders, addresses, stats });
  });
}
