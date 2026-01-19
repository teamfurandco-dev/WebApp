import { prisma } from '../../shared/lib/prisma.js';
import { getPublicUrl } from '../../shared/lib/supabase.js';


export class BlogService {
  /**
   * Get blogs with filters and pagination
   */
  async getBlogs(filters: {
    publishStatus?: 'draft' | 'published';
    isFeatured?: boolean;
    homepageSection?: string;
    categoryId?: string;
    authorId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (filters.publishStatus) where.publishStatus = filters.publishStatus;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.homepageSection) where.homepageSection = filters.homepageSection;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.authorId) where.authorId = filters.authorId;
    
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    
    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: [
        { displayOrder: 'asc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });
    
    return blogs.map(blog => this.transformBlog(blog));
  }
  
  /**
   * Get single blog by ID or slug
   */
  async getBlog(idOrSlug: string) {
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    
    if (!blog) return null;
    return this.transformBlog(blog);
  }
  
  /**
   * Get homepage blogs by section
   */
  async getHomepageBlogs(section: string) {
    return this.getBlogs({
      homepageSection: section,
      publishStatus: 'published',
      limit: 10,
    });
  }
  
  /**
   * Create blog
   */
  async createBlog(data: any) {
    return prisma.blog.create({
      data,
      include: {
        author: true,
        category: true,
        images: true,
      },
    });
  }
  
  /**
   * Update blog
   */
  async updateBlog(id: string, data: any) {
    return prisma.blog.update({
      where: { id },
      data,
      include: {
        author: true,
        category: true,
        images: true,
      },
    });
  }
  
  /**
   * Delete blog
   */
  async deleteBlog(id: string) {
    return prisma.blog.delete({ where: { id } });
  }
  
  /**
   * Add blog image
   */
  async addBlogImage(data: any) {
    return prisma.blogImage.create({ data });
  }
  
  /**
   * Delete blog image
   */
  async deleteBlogImage(id: string) {
    return prisma.blogImage.delete({ where: { id } });
  }
  
  /**
   * Transform blog to include image URLs
   */
  private transformBlog(blog: any) {
    const transformed: any = {
      ...blog,
      images: blog.images.map((img: any) => ({
        ...img,
        url: getPublicUrl(img.bucketName, img.filePath),
      })),
    };
    
    // Add cover image URL if exists
    if (blog.coverBucketName && blog.coverFilePath) {
      transformed.coverImageUrl = getPublicUrl(blog.coverBucketName, blog.coverFilePath);
    }
    
    return transformed;
  }
}

export const blogService = new BlogService();
