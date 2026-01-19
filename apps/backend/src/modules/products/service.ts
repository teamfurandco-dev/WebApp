import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';


export class ProductService {
  /**
   * Get products with filters and pagination
   */
  async getProducts(filters: {
    categoryId?: string;
    homepageSection?: string;
    isFeatured?: boolean;
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.homepageSection) where.homepageSection = filters.homepageSection;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });
    
    // Transform images to include public URLs
    return products.map(product => this.transformProduct(product));
  }
  
  /**
   * Get single product by ID or slug
   */
  async getProduct(idOrSlug: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    
    if (!product) return null;
    return this.transformProduct(product);
  }
  
  /**
   * Get homepage products by section
   */
  async getHomepageProducts(section: string) {
    return this.getProducts({
      homepageSection: section,
      isActive: true,
      limit: 20,
    });
  }
  
  /**
   * Create product
   */
  async createProduct(data: any) {
    return prisma.product.create({
      data,
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });
  }
  
  /**
   * Update product
   */
  async updateProduct(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });
  }
  
  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    return prisma.product.delete({ where: { id } });
  }
  
  /**
   * Create variant
   */
  async createVariant(data: any) {
    return prisma.productVariant.create({ data });
  }
  
  /**
   * Update variant
   */
  async updateVariant(id: string, data: any) {
    return prisma.productVariant.update({
      where: { id },
      data,
    });
  }
  
  /**
   * Delete variant
   */
  async deleteVariant(id: string) {
    return prisma.productVariant.delete({ where: { id } });
  }
  
  /**
   * Add product image
   */
  async addProductImage(data: any) {
    // If this is set as primary, unset other primary images
    if (data.isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId: data.productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }
    
    return prisma.productImage.create({ data });
  }
  
  /**
   * Delete product image
   */
  async deleteProductImage(id: string) {
    return prisma.productImage.delete({ where: { id } });
  }
  
  /**
   * Transform product to include image URLs
   */
  private transformProduct(product: any) {
    return {
      ...product,
      images: product.images.map((img: any) => ({
        ...img,
        url: getPublicUrl(img.bucketName, img.filePath),
      })),
    };
  }
}

export const productService = new ProductService();
