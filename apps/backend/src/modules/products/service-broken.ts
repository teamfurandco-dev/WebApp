import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';


export class ProductService {
  /**
   * Get all products for admin (includes inactive)
   */
  async getAllProductsAdmin() {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        variants: {
          orderBy: { displayOrder: 'asc' },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    return products.map(product => ({
      ...product,
      images: product.images.map(img => ({
        ...img,
        url: getPublicUrl('product-images', img.filePath),
      })),
    }));
  }

  /**
   * Create new product
   */
  async createProduct(data: any) {
    const { variants, images, tags, ...productData } = data;
    
    // Generate slug from name
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        ...productData,
        slug,
        tags: tags || [],
        variants: variants?.length ? {
          create: variants.map((variant: any, index: number) => ({
            ...variant,
            price: Math.round(parseFloat(variant.price) * 100), // Convert to cents
            stock: parseInt(variant.stock) || 0,
            displayOrder: index,
            sku: variant.sku || `${slug}-${index + 1}`,
          })),
        } : undefined,
        images: images?.length ? {
          create: images.map((image: any, index: number) => ({
            bucketName: 'product-images',
            filePath: image.filePath,
            altText: image.altText || productData.name,
            displayOrder: index,
            isPrimary: index === 0,
          })),
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    return {
      ...product,
      images: product.images.map(img => ({
        ...img,
        url: getPublicUrl('product-images', img.filePath),
      })),
    };
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: any) {
    const { variants, images, tags, ...productData } = data;

    // Update slug if name changed
    if (productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Delete existing variants and images, then recreate
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.productImage.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        tags: tags || [],
        variants: variants?.length ? {
          create: variants.map((variant: any, index: number) => ({
            ...variant,
            price: Math.round(parseFloat(variant.price) * 100), // Convert to cents
            stock: parseInt(variant.stock) || 0,
            displayOrder: index,
            sku: variant.sku || `${productData.slug || 'product'}-${index + 1}`,
          })),
        } : undefined,
        images: images?.length ? {
          create: images.map((image: any, index: number) => ({
            bucketName: 'product-images',
            filePath: image.filePath,
            altText: image.altText || productData.name,
            displayOrder: index,
            isPrimary: index === 0,
          })),
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    return {
      ...product,
      images: product.images.map(img => ({
        ...img,
        url: getPublicUrl('product-images', img.filePath),
      })),
    };
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    // Delete associated images from storage
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (product?.images?.length) {
      // Note: In a real app, you'd delete from Supabase storage here
      // For now, just delete from database
    }

    await prisma.product.delete({ where: { id } });
  }

  /**
   * Update product status
   */
  async updateProductStatus(id: string, isActive: boolean) {
    return prisma.product.update({
      where: { id },
      data: { isActive },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });
  }

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
