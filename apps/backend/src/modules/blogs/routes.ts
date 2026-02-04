import { FastifyInstance } from 'fastify';
import { blogService } from './service.js';
import { success } from '../../shared/utils/response.js';
import { authenticateAdmin } from '../../shared/middleware/auth.js';
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
