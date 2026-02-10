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

  async getOrCreateUser(supabaseId: string, email: string, name?: string) {
    console.log(`[UserService] syncUser: ${email} (sid: ${supabaseId})`);

    // 1. Try finding by supabaseId first
    let user = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (!user) {
      console.log(`[UserService] No user found with supabaseId ${supabaseId}, checking email ${email}`);

      // 2. Try finding by email to link accounts
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        console.log(`[UserService] Found existing user by email, linking supabaseId`);
        user = await prisma.user.update({
          where: { id: user.id },
          data: { supabaseId }
        });
      } else {
        console.log(`[UserService] Creating new user record`);
        user = await prisma.user.create({
          data: {
            supabaseId,
            email,
            name: name || email.split('@')[0],
          },
        });
      }
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

  /**
   * Request phone verification (Mock implementation)
   */
  async requestPhoneVerification(userId: string, phone: string) {
    // 1. Update phone number first
    await prisma.user.update({
      where: { id: userId },
      data: { phone }
    });

    // 2. Simulate sending OTP logic (e.g. Twilio/Supabase)
    console.log(`[UserService] Sending OTP to ${phone} for user ${userId}`);

    // In a real app, we would:
    // - Generate a random 6-digit code
    // - Store it in Redis/DB with expiration
    // - Send via SMS provider

    return { success: true, message: 'OTP sent successfully' };
  }

  /**
   * Verify phone with OTP
   */
  async verifyPhone(userId: string, phone: string, otp: string) {
    // Mock validation
    // In production: Check against stored OTP in Redis/DB
    if (otp !== '123456') {
      throw new Error('Invalid OTP');
    }

    // Update user preferences to mark as verified
    // We need to fetch existing preferences first to merge
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true }
    });

    const currentPrefs = (user?.preferences as any) || {};

    return prisma.user.update({
      where: { id: userId },
      data: {
        phone,
        preferences: {
          ...currentPrefs,
          phoneVerified: true,
          phoneVerifiedAt: new Date().toISOString()
        }
      },
      select: {
        id: true,
        phone: true,
        preferences: true
      }
    });
  }
}

export const userService = new UserService();
