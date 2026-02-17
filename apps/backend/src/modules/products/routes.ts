import { FastifyInstance } from 'fastify';
import { productService } from './service.js';
import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';
import { authenticateAdmin } from '../../shared/middleware/auth.js';
import { success } from '../../shared/utils/response.js';
import { createProductSchema, updateProductSchema } from './schema.js';

/**
 * Product routes for browsing and administration
 */
export async function productRoutes(fastify: FastifyInstance) {
  // Public routes
  // Get products with filters
  fastify.get('/products', {
    schema: {
      description: 'Get products with optional filters - Used by Home, ProductList, Cart, Wishlist pages',
      tags: ['Currently in Use', 'Products'],
      querystring: {
        type: 'object',
        properties: {
          categoryId: { type: 'string', format: 'uuid', description: 'Filter by category ID' },
          isFeatured: { type: 'boolean', description: 'Filter featured products' },
          search: { type: 'string', description: 'Search in name and description' },
          page: { type: 'number', minimum: 1, description: 'Page number' },
          limit: { type: 'number', minimum: 1, maximum: 100, description: 'Items per page' }
        }
      },
      response: {
        200: {
          description: 'List of products',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  description: { type: 'string' },
                  averageRating: { type: 'number' },
                  reviewCount: { type: 'number' },
                  category: { type: 'string' },
                  variants: { type: 'array' },
                  images: { type: 'array' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const products = await productService.getProducts(request.query as any);
    return success(products);
  });

  // Get single product
  fastify.get('/products/:idOrSlug', {
    schema: {
      description: 'Get a single product by ID or slug - Used by ProductDetail pages',
      tags: ['Currently in Use', 'Products'],
      params: {
        type: 'object',
        properties: {
          idOrSlug: { type: 'string', description: 'Product ID (UUID) or slug' }
        },
        required: ['idOrSlug']
      },
      response: {
        200: {
          description: 'Product details',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                slug: { type: 'string' },
                description: { type: 'string' },
                averageRating: { type: 'number' },
                reviewCount: { type: 'number' },
                variants: { type: 'array' },
                images: { type: 'array' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };
    const product = await productService.getProduct(idOrSlug);
    return success(product);
  });

  // Consolidated product exploration endpoint
  fastify.get('/products/explore', {
    schema: {
      description: 'Get products with filters, categories, and pagination in one call - Used by ProductList page',
      tags: ['Currently in Use - Optimized'],
      querystring: {
        type: 'object',
        properties: {
          categoryId: { type: 'string', format: 'uuid', description: 'Filter by category ID' },
          search: { type: 'string', description: 'Search in name and description' },
          sort: { type: 'string', enum: ['price-low', 'price-high', 'rating', 'featured'], description: 'Sort order' },
          page: { type: 'number', minimum: 1, description: 'Page number' },
          limit: { type: 'number', minimum: 1, maximum: 100, description: 'Items per page' }
        }
      },
      response: {
        200: {
          description: 'Products with filters and pagination',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                products: { type: 'array' },
                categories: { type: 'array' },
                pagination: { type: 'object' },
                appliedFilters: { type: 'object' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const query = request.query as any;
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    // Resolve category ID if name/slug provided
    let categoryId = query.categoryId;
    if (query.category && query.category !== 'All' && !categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          OR: [
            { name: { equals: query.category, mode: 'insensitive' } },
            { slug: { equals: query.category, mode: 'insensitive' } }
          ],
          isActive: true
        }
      });
      if (category) {
        categoryId = category.id;
      }
    }

    // Parallel queries for products and categories
    const [products, categories, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          ...(categoryId && { categoryId }),
          ...(query.search && {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } }
            ]
          })
        },
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          averageRating: true,
          reviewCount: true,
          isFeatured: true,
          category: { select: { name: true } },
          variants: {
            select: { price: true, compareAtPrice: true },
            orderBy: { displayOrder: 'asc' },
            take: 1
          }
        },
        orderBy: query.sort === 'rating' ? { averageRating: 'desc' } :
          query.sort === 'featured' ? { isFeatured: 'desc' } :
            { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' }
      }),
      prisma.product.count({
        where: {
          isActive: true,
          ...(categoryId && { categoryId }),
          ...(query.search && {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } }
            ]
          })
        }
      })
    ]);

    return success({
      products: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        images: p.images.map((img: any) => getPublicUrl('product-images', img.filePath)),
        rating: p.averageRating,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured,
        category: p.category?.name || 'Uncategorized',
        base_price_cents: p.variants[0]?.price || 0,
        compare_at_price_cents: p.variants[0]?.compareAtPrice || 0
      })),
      categories,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      appliedFilters: {
        categoryId,
        category: query.category,
        search: query.search,
        sort: query.sort
      }
    });
  });

  // Consolidated product detail endpoint
  fastify.get('/products/:idOrSlug/full', {
    schema: {
      description: 'Get complete product details with variants, reviews, Q&A, and related products in one call',
      tags: ['Currently in Use - Optimized'],
      params: {
        type: 'object',
        properties: {
          idOrSlug: { type: 'string', description: 'Product ID or slug' }
        },
        required: ['idOrSlug']
      },
      response: {
        200: {
          description: 'Complete product details',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              additionalProperties: true,
              properties: {
                product: {
                  type: 'object',
                  additionalProperties: true,
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    usage_instructions: { type: 'string' },
                    ingredients: { type: 'string' },
                    suitable_for: { type: 'string' },
                    safety_notes: { type: 'string' },
                    specifications: { type: 'string' }
                  }
                },
                variants: { type: 'array' },
                reviewSummary: { type: 'object', additionalProperties: true },
                topReviews: { type: 'array' },
                questionsWithAnswers: { type: 'array' },
                relatedProducts: { type: 'array' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };

    // Get product first - handle ID or slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ],
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        images: true,
        averageRating: true,
        reviewCount: true,
        categoryId: true,
        category: { select: { name: true } },
        usageInstructions: true,
        ingredients: true,
        suitableFor: true,
        safetyNotes: true,
        specifications: true
      }
    });

    if (!product) {
      return reply.code(404 as any).send({ success: false, error: { message: 'Product not found' } });
    }

    // Parallel queries for all product detail data
    const [variants, reviewSummary, topReviews, questionsWithAnswers, relatedProducts] = await Promise.all([
      // Product variants
      prisma.productVariant.findMany({
        where: { productId: product.id },
        select: {
          id: true,
          sku: true,
          name: true,
          price: true,
          compareAtPrice: true,
          stock: true,
          isActive: true
        }
      }),

      // Review summary
      prisma.review.groupBy({
        by: ['rating'],
        where: { productId: product.id, status: 'APPROVED' },
        _count: { rating: true }
      }),

      // Top reviews
      prisma.review.findMany({
        where: { productId: product.id, status: 'APPROVED' },
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
          createdAt: true,
          helpfulCount: true,
          user: { select: { name: true } }
        },
        orderBy: [
          { helpfulCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 5
      }),

      // Questions with answers
      prisma.productQuestion.findMany({
        where: { productId: product.id, isApproved: true },
        select: {
          id: true,
          question: true,
          createdAt: true,
          user: { select: { name: true } },
          answers: {
            select: {
              id: true,
              answer: true,
              isStaffReply: true,
              createdAt: true,
              user: { select: { name: true } }
            },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Related products
      prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          isActive: true,
          id: { not: product.id }
        },
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          averageRating: true,
          reviewCount: true,
          variants: {
            select: { price: true },
            orderBy: { price: 'asc' },
            take: 1
          }
        },
        take: 4
      })
    ]);

    // Process review summary
    const ratingBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalReviews = 0;
    reviewSummary.forEach(r => {
      const rating = r.rating as keyof typeof ratingBreakdown;
      ratingBreakdown[rating] = r._count.rating;
      totalReviews += r._count.rating;
    });

    return success({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        images: product.images.map(img => getPublicUrl('product-images', img.filePath)),
        rating: product.averageRating,
        reviewsCount: product.reviewCount,
        category: product.category?.name || 'Uncategorized',
        base_price_cents: variants[0]?.price || 0,
        compare_at_price_cents: variants[0]?.compareAtPrice || 0,
        stock_quantity: variants[0]?.stock || 0,
        sku: variants[0]?.sku || '',
        usage_instructions: product.usageInstructions || '',
        ingredients: product.ingredients || '',
        suitable_for: product.suitableFor || '',
        safety_notes: product.safetyNotes || '',
        specifications: product.specifications || ''
      },
      variants: variants.map(v => ({
        id: v.id,
        sku: v.sku,
        name: v.name,
        price_cents: v.price,
        compare_at_price_cents: v.compareAtPrice,
        stock_quantity: v.stock,
        isActive: v.isActive
      })),
      reviewSummary: {
        averageRating: product.averageRating,
        totalCount: totalReviews,
        ratingBreakdown
      },
      topReviews: topReviews.map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        created_at: r.createdAt,
        helpful_votes: r.helpfulCount,
        user_name: r.user?.name || 'Anonymous'
      })),
      questionsWithAnswers: questionsWithAnswers.map(q => ({
        id: q.id,
        question: q.question,
        created_at: q.createdAt,
        user_name: q.user?.name || 'Anonymous',
        answers: q.answers.map(a => ({
          id: a.id,
          answer: a.answer,
          is_staff_reply: a.isStaffReply,
          created_at: a.createdAt,
          user_name: a.user?.name || 'Fur & Co Support'
        }))
      })),
      relatedProducts: relatedProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        images: p.images.map((img: any) => getPublicUrl('product-images', img.filePath)),
        rating: p.averageRating,
        reviewCount: p.reviewCount,
        category: product.category?.name,
        base_price_cents: p.variants[0]?.price || 0
      }))
    });
  });

  // Get product variants
  fastify.get('/products/:productId/variants', {
    schema: {
      description: 'Get all variants for a specific product - Used by ProductDetailOptimized, Wishlist pages',
      tags: ['Currently in Use', 'Products'],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string', format: 'uuid', description: 'Product ID' }
        },
        required: ['productId']
      },
      response: {
        200: {
          description: 'Product variants',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  sku: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  stock: { type: 'number' },
                  stockStatus: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const variants = await productService.getProductVariants(productId);
    return success(variants);
  });

  // Admin routes
  // Get all products for admin
  fastify.get('/admin/products', {
    schema: {
      description: 'Get all products for admin management',
      tags: ['Admin - Products'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: authenticateAdmin
  }, async (request, reply) => {
    const products = await productService.getAllProductsAdmin();
    return success(products);
  });

  // Create product
  fastify.post('/admin/products', {
    schema: {
      description: 'Create a new product',
      tags: ['Admin - Products'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: authenticateAdmin
  }, async (request, reply) => {
    const data = createProductSchema.parse(request.body);
    const product = await productService.createProduct(data);
    return reply.code(201).send(success(product));
  });

  // Update product
  fastify.put('/admin/products/:id', {
    schema: {
      description: 'Update an existing product',
      tags: ['Admin - Products'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: authenticateAdmin
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateProductSchema.parse(request.body);
    const product = await productService.updateProduct(id, data);
    return success(product);
  });

  // Delete product
  fastify.delete('/admin/products/:id', {
    schema: {
      description: 'Delete a product',
      tags: ['Admin - Products'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: authenticateAdmin
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await productService.deleteProduct(id);
    return success({ deleted: true });
  });

  // Update product status
  fastify.patch('/admin/products/:id/status', {
    schema: {
      description: 'Update product active status',
      tags: ['Admin - Products'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: authenticateAdmin
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isActive } = request.body as { isActive: boolean };
    const product = await productService.updateProductStatus(id, isActive);
    return success(product);
  });
}
