import type { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/lib/prisma.js';
import { success } from '../../shared/utils/response.js';

export async function homeRoutes(fastify: FastifyInstance) {
  // Simple test endpoint first
  fastify.get('/test', {
    schema: {
      description: 'Test endpoint to verify backend is working',
      tags: ['Currently in Use - Optimized'],
    }
  }, async () => {
    return success({ message: 'Backend is working!', timestamp: new Date().toISOString() });
  });

  // Database debug endpoint
  fastify.get('/debug', {
    schema: {
      description: 'Debug endpoint to check database contents',
      tags: ['Currently in Use - Optimized'],
    }
  }, async () => {
    try {
      const [productCount, categoryCount, blogCount] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.blog.count()
      ]);

      // Get first few products to see what's there
      const sampleProducts = await prisma.product.findMany({
        take: 3,
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
          isFeatured: true
        }
      });

      return success({
        counts: { productCount, categoryCount, blogCount },
        sampleProducts,
        message: 'Database debug info'
      });
    } catch (error) {
      return success({
        error: error.message,
        message: 'Database connection failed'
      });
    }
  });

  // GET /home - Consolidated home page data
  fastify.get('/home', {
    schema: {
      description: 'Get all home page data in one call - Featured products, categories, blogs, hero',
      tags: ['Currently in Use - Optimized'],
    }
  }, async () => {
    try {
      console.log('Home endpoint called');
      
      // Return static data first to test if endpoint works
      return success({
        hero: {
          title: "Welcome to Fur & Co",
          subtitle: "Premium pet care essentials for your furry family",
          ctaText: "Shop Now",
          ctaLink: "/products"
        },
        featuredProducts: [
          {
            id: "test-1",
            name: "Test Product",
            slug: "test-product",
            images: ["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500"],
            averageRating: 4.5,
            reviewCount: 10,
            category: "Test Category",
            minPrice: 2999
          }
        ],
        categories: [
          {
            id: "test-cat-1",
            name: "Dog Food",
            slug: "dog-food",
            description: "Premium nutrition for dogs",
            productCount: 25
          }
        ],
        featuredBlogs: [
          {
            id: "test-blog-1",
            title: "Pet Care Tips",
            slug: "pet-care-tips",
            excerpt: "Essential tips for happy pets",
            coverImage: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=500",
            publishedAt: new Date().toISOString(),
            author: "Fur & Co Team"
          }
        ]
      });
    } catch (error) {
      console.error('Home API Error:', error);
      return success({
        hero: {
          title: "Welcome to Fur & Co",
          subtitle: "Premium pet care essentials for your furry family",
          ctaText: "Shop Now",
          ctaLink: "/products"
        },
        featuredProducts: [],
        categories: [],
        featuredBlogs: [],
        error: error.message
      });
    }
  });
}
