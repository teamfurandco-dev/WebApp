import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';

export class ProductService {
  /**
   * Get all products for admin (includes inactive)
   */
  async getAllProductsAdmin() {
    const products = await prisma.product.findMany({
      include: {
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
   * Get products with filters and pagination
   */
  async getProducts(filters: any = {}) {
    const where: any = { isActive: true };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured === 'true';
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
      take: filters.limit ? parseInt(filters.limit) : 50,
      skip: filters.offset || 0,
    });

    return products.map(product => ({
      ...product,
      category: product.category?.name || 'Uncategorized',
      images: product.images.map(img => ({
        ...img,
        url: getPublicUrl('product-images', img.filePath),
      })),
    }));
  }

  /**
   * Get single product
   */
  async getProduct(idOrSlug: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
        isActive: true,
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

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      ...product,
      category: product.category?.name || 'Uncategorized',
      images: product.images.map(img => ({
        ...img,
        url: getPublicUrl('product-images', img.filePath),
      })),
    };
  }

  /**
   * Create new product
   */
  async createProduct(data: any) {
    const { variants, images, tags, ...productData } = data;

    console.log('Creating product with data:', { variants: variants?.length, images: images?.length, ...productData });

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
            name: variant.name,
            price: Math.round(parseFloat(variant.price) * 100), // Convert to cents
            stock: parseInt(variant.stock) || 0,
            displayOrder: index,
            sku: variant.sku || `${slug}-${index + 1}`,
            isActive: true,
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

    return product;
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
            name: variant.name,
            price: Math.round(parseFloat(variant.price) * 100), // Convert to cents
            stock: parseInt(variant.stock) || 0,
            displayOrder: index,
            sku: variant.sku || `${productData.slug || 'product'}-${index + 1}`,
            isActive: true,
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

    return product;
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
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
}

export const productService = new ProductService();
