import { prisma } from '../../shared/lib/prisma.js';


export class AddressService {
  /**
   * Get all addresses for user
   */
  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }
  
  /**
   * Get single address
   */
  async getAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    
    if (!address) {
      throw new Error('Address not found');
    }
    
    return address;
  }
  
  /**
   * Get default address
   */
  async getDefaultAddress(userId: string, type?: 'shipping' | 'billing') {
    const where: any = { userId, isDefault: true };
    
    if (type) {
      where.OR = [
        { type },
        { type: 'both' },
      ];
    }
    
    return prisma.address.findFirst({ where });
  }
  
  /**
   * Create address
   */
  async createAddress(userId: string, data: any) {
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }
    
    return prisma.address.create({
      data: { ...data, userId },
    });
  }
  
  /**
   * Update address
   */
  async updateAddress(userId: string, addressId: string, data: any) {
    const address = await this.getAddress(userId, addressId);
    
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false },
      });
    }
    
    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }
  
  /**
   * Delete address
   */
  async deleteAddress(userId: string, addressId: string) {
    const address = await this.getAddress(userId, addressId);
    
    return prisma.address.delete({
      where: { id: addressId },
    });
  }
  
  /**
   * Set default address
   */
  async setDefaultAddress(userId: string, addressId: string) {
    await this.getAddress(userId, addressId);
    
    // Unset other defaults
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
    
    // Set new default
    return prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}

export const addressService = new AddressService();
