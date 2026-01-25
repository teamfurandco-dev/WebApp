import { FastifyInstance } from 'fastify';
import { blogService } from './service.js';
import {
  blogQuerySchema,
  createBlogSchema,
  updateBlogSchema,
  createBlogImageSchema,
} from './schema.js';

export async function blogRoutes(fastify: FastifyInstance) {
  // Get blogs with filters
  fastify.get('/blogs', async (request, reply) => {
    const filters = blogQuerySchema.parse(request.query);
    const blogs = await blogService.getBlogs(filters);
    return { data: blogs };
  });
  
  // Get homepage blogs by section
  fastify.get('/blogs/homepage/:section', async (request, reply) => {
    const { section } = request.params as { section: string };
    const blogs = await blogService.getHomepageBlogs(section);
    return { data: blogs };
  });
  
  // Get single blog
  fastify.get('/blogs/:idOrSlug', async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };
    const blog = await blogService.getBlog(idOrSlug);
    
    if (!blog) {
      return reply.code(404).send({ error: 'Blog not found' });
    }
    
    return { data: blog };
  });
  
  // Create blog (admin only)
  fastify.post('/blogs', async (request, reply) => {
    const data = createBlogSchema.parse(request.body);
    const blog = await blogService.createBlog(data);
    return reply.code(201).send({ data: blog });
  });
  
  // Update blog (admin only)
  fastify.patch('/blogs/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateBlogSchema.parse(request.body);
    const blog = await blogService.updateBlog(id, data);
    return { data: blog };
  });
  
  // Delete blog (admin only)
  fastify.delete('/blogs/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await blogService.deleteBlog(id);
    return reply.code(204).send();
  });
  
  // Image routes
  fastify.post('/blogs/images', async (request, reply) => {
    const data = createBlogImageSchema.parse(request.body);
    const image = await blogService.addBlogImage(data);
    return reply.code(201).send({ data: image });
  });
  
  fastify.delete('/blogs/images/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await blogService.deleteBlogImage(id);
    return reply.code(204).send();
  });
}
