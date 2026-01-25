import { FastifyInstance } from 'fastify';
import { uploadFile, deleteFile } from '../../shared/lib/supabase.js';
import { randomUUID } from 'crypto';

export async function uploadRoutes(fastify: FastifyInstance) {
  // Upload product image
  fastify.post('/uploads/products/:productId', async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const data = await request.file();
    
    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }
    
    const buffer = await data.toBuffer();
    const ext = data.filename.split('.').pop();
    const filename = `${randomUUID()}.${ext}`;
    const filePath = `products/${productId}/${filename}`;
    
    try {
      await uploadFile('product-images', filePath, buffer, {
        contentType: data.mimetype,
      });
      
      return {
        data: {
          bucketName: 'product-images',
          filePath,
          filename: data.filename,
        },
      };
    } catch (error) {
      return reply.code(500).send({ error: 'Upload failed' });
    }
  });
  
  // Upload blog image
  fastify.post('/uploads/blogs/:blogId', async (request, reply) => {
    const { blogId } = request.params as { blogId: string };
    const data = await request.file();
    
    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }
    
    const buffer = await data.toBuffer();
    const ext = data.filename.split('.').pop();
    const filename = `${randomUUID()}.${ext}`;
    const filePath = `blogs/${blogId}/${filename}`;
    
    try {
      await uploadFile('blog-images', filePath, buffer, {
        contentType: data.mimetype,
      });
      
      return {
        data: {
          bucketName: 'blog-images',
          filePath,
          filename: data.filename,
        },
      };
    } catch (error) {
      return reply.code(500).send({ error: 'Upload failed' });
    }
  });
  
  // Delete file
  fastify.delete('/uploads/:bucket/:path', async (request, reply) => {
    const { bucket, path } = request.params as { bucket: string; path: string };
    
    try {
      await deleteFile(bucket, path);
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({ error: 'Delete failed' });
    }
  });
}
