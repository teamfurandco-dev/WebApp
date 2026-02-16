import { FastifyInstance } from 'fastify';
import { blogService } from './service.js';
import { success } from '../../shared/utils/response.js';
import { authenticateAdmin } from '../../shared/middleware/auth.js';
import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';
import {
  blogQuerySchema,
  createBlogSchema,
  updateBlogSchema,
  createBlogImageSchema,
} from './schema.js';

/**
 * Blog routes for public browsing and administration
 */
export async function blogRoutes(fastify: FastifyInstance) {
  // Get blogs with filters
  fastify.get('/blogs', async (request, reply) => {
    const filters = blogQuerySchema.parse(request.query);
    const blogs = await blogService.getBlogs(filters);
    return success(blogs);
  });

  // Consolidated blog page endpoint - blogs + categories + pagination in one call
  fastify.get('/blogs/page', {
    schema: {
      description: 'Get blog listing page with blogs, categories, and pagination',
      tags: ['Blogs'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1 },
          limit: { type: 'number', minimum: 1, maximum: 50 },
          categoryId: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request, reply) => {
    const { page = 1, limit = 10, categoryId } = request.query as any;
    const skip = (page - 1) * limit;

    const [blogs, categories, totalCount] = await Promise.all([
      prisma.blog.findMany({
        where: {
          publishStatus: 'published',
          ...(categoryId && { categoryId })
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverFilePath: true,
          publishedAt: true,
          author: { select: { name: true } },
          category: { select: { name: true, slug: true } }
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.blogCategory.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' }
      }),
      prisma.blog.count({
        where: {
          publishStatus: 'published',
          ...(categoryId && { categoryId })
        }
      })
    ]);

    return success({
      blogs: blogs.map(b => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        coverImage: b.coverFilePath ? getPublicUrl('blog-images', b.coverFilePath) : null,
        publishedAt: b.publishedAt,
        author: b.author?.name,
        category: b.category
      })),
      categories,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  });

  // Get single blog with related blogs
  fastify.get('/blogs/:slug/full', {
    schema: {
      description: 'Get complete blog post with related blogs',
      tags: ['Blogs'],
      params: {
        type: 'object',
        properties: {
          slug: { type: 'string' }
        },
        required: ['slug']
      }
    }
  }, async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const blog = await prisma.blog.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        publishStatus: 'published'
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        category: true,
        images: { orderBy: { displayOrder: 'asc' } }
      }
    });

    if (!blog) {
      return reply.code(404).send({ success: false, error: { message: 'Blog not found' } });
    }

    const relatedBlogs = await prisma.blog.findMany({
      where: {
        id: { not: blog.id },
        publishStatus: 'published',
        categoryId: blog.categoryId,
        OR: [
          { tags: { hasSome: blog.tags } },
          { categoryId: blog.categoryId }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverFilePath: true,
        publishedAt: true
      },
      take: 3
    });

    return success({
      blog: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        coverImage: blog.coverFilePath ? getPublicUrl('blog-images', blog.coverFilePath) : null,
        publishedAt: blog.publishedAt,
        author: {
          id: blog.author?.id,
          name: blog.author?.name,
          avatar: blog.author?.avatarUrl
        },
        category: blog.category,
        tags: blog.tags,
        metaTitle: blog.metaTitle,
        metaDescription: blog.metaDescription,
        images: blog.images.map(img => ({
          id: img.id,
          url: getPublicUrl('blog-images', img.filePath),
          altText: img.altText,
          caption: img.caption
        }))
      },
      relatedBlogs: relatedBlogs.map(b => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        coverImage: b.coverFilePath ? getPublicUrl('blog-images', b.coverFilePath) : null,
        publishedAt: b.publishedAt
      }))
    });
  });

  // Get homepage blogs by section
  fastify.get('/blogs/homepage/:section', async (request, reply) => {
    const { section } = request.params as { section: string };
    const blogs = await blogService.getHomepageBlogs(section);
    return success(blogs);
  });

  // Get single blog
  fastify.get('/blogs/:idOrSlug', async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };
    const blog = await blogService.getBlog(idOrSlug);
    return success(blog);
  });

  // Create blog (admin only)
  fastify.post('/blogs', { preHandler: authenticateAdmin }, async (request, reply) => {
    const data = createBlogSchema.parse(request.body);
    const blog = await blogService.createBlog(data);
    return reply.code(201).send(success(blog));
  });

  // Update blog (admin only)
  fastify.patch('/blogs/:id', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateBlogSchema.parse(request.body);
    const blog = await blogService.updateBlog(id, data);
    return success(blog);
  });

  // Delete blog (admin only)
  fastify.delete('/blogs/:id', { preHandler: authenticateAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await blogService.deleteBlog(id);
    return reply.code(204).send();
  });

  // Admin list all blogs (includes drafts)
  fastify.get('/admin/blogs', { preHandler: authenticateAdmin }, async (request, reply) => {
    const blogs = await blogService.getBlogs({});
    return success(blogs);
  });

  // Image routes
  fastify.post('/blogs/images', async (request, reply) => {
    const data = createBlogImageSchema.parse(request.body);
    const image = await blogService.addBlogImage(data);
    return reply.code(201).send(success(image));
  });

  fastify.delete('/blogs/images/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await blogService.deleteBlogImage(id);
    return reply.code(204).send();
  });

  // Blog Categories
  fastify.get('/blogs/categories', async (request, reply) => {
    const categories = await blogService.getBlogCategories();
    return success(categories);
  });
}
