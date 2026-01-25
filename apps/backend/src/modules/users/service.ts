import { prisma } from '../../shared/lib/prisma.js';


export class UserService {
  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
  
  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: {
    name?: string;
    phone?: string;
    avatarUrl?: string;
    preferences?: any;
  }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  
  /**
   * Get or create user from Supabase auth
   */
  async getOrCreateUser(supabaseId: string, email: string, name?: string) {
    let user = await prisma.user.findUnique({
      where: { supabaseId },
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          supabaseId,
          email,
          name: name || email.split('@')[0],
        },
      });
    }
    
    return user;
  }
  
  /**
   * Get user stats (orders, cart, wishlist counts)
   */
  async getUserStats(userId: string) {
    const [ordersCount, cartCount, wishlistCount] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.cartItem.count({ where: { userId } }),
      prisma.wishlistItem.count({ where: { userId } }),
    ]);
    
    return {
      ordersCount,
      cartCount,
      wishlistCount,
    };
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, role: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const userService = new UserService();
