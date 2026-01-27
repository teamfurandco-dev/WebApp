import { FastifyInstance } from 'fastify';
import { uploadFile, deleteFile } from '../../shared/lib/supabase.js';
import { success } from '../../shared/utils/response.js';
import { BadRequestError } from '../../shared/errors/index.js';
import { randomUUID } from 'crypto';

/**
 * Upload routes for handling file storage via Supabase
 */
export async function uploadRoutes(fastify: FastifyInstance) {
  // Upload product image
  fastify.post('/uploads/products/:productId', async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const data = await request.file();

    if (!data) {
      throw new BadRequestError('No file uploaded');
    }

    const buffer = await data.toBuffer();
    const ext = data.filename.split('.').pop();
    const filename = `${randomUUID()}.${ext}`;
    const filePath = `products/${productId}/${filename}`;

    await uploadFile('product-images', filePath, buffer, {
      contentType: data.mimetype,
    });

    return success({
      bucketName: 'product-images',
      filePath,
      filename: data.filename,
    });
  });

  // Upload blog image
  fastify.post('/uploads/blogs/:blogId', async (request, reply) => {
    const { blogId } = request.params as { blogId: string };
    const data = await request.file();

    if (!data) {
      throw new BadRequestError('No file uploaded');
    }

    const buffer = await data.toBuffer();
    const ext = data.filename.split('.').pop();
    const filename = `${randomUUID()}.${ext}`;
    const filePath = `blogs/${blogId}/${filename}`;

    await uploadFile('blog-images', filePath, buffer, {
      contentType: data.mimetype,
    });

    return success({
      bucketName: 'blog-images',
      filePath,
      filename: data.filename,
    });
  });

  // Delete file from storage
  fastify.delete('/uploads/:bucket/:path', async (request, reply) => {
    const { bucket, path } = request.params as { bucket: string; path: string };
    await deleteFile(bucket, path);
    return reply.code(204).send();
  });
}
