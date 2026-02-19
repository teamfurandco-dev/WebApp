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
    const { tags, images, ...blogData } = data;

    // Generate slug if not provided
    if (!blogData.slug && blogData.title) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Use default author (Fur&Co) if no authorId provided
    if (!blogData.authorId) {
      const defaultAuthor = await prisma.user.findFirst({
        where: { role: 'admin' },
        orderBy: { createdAt: 'asc' }
      });
      if (defaultAuthor) {
        blogData.authorId = defaultAuthor.id;
      }
    }

    return prisma.blog.create({
      data: {
        ...blogData,
        tags: tags || [],
        images: images?.length ? {
          create: images.map((image: any, index: number) => ({
            bucketName: image.bucketName || 'blogs-images',
            filePath: image.filePath,
            altText: image.altText || blogData.title,
            displayOrder: index,
          })),
        } : undefined,
      },
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
    const { tags, images, ...blogData } = data;

    // Update slug if title changed and slug not provided
    if (blogData.title && !blogData.slug) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // If images are provided, replace them
    if (images) {
      await prisma.blogImage.deleteMany({ where: { blogId: id } });
    }

    return prisma.blog.update({
      where: { id },
      data: {
        ...blogData,
        tags: tags || [],
        images: images?.length ? {
          create: images.map((image: any, index: number) => ({
            bucketName: image.bucketName || 'blogs-images',
            filePath: image.filePath,
            altText: image.altText || blogData.title,
            displayOrder: index,
          })),
        } : undefined,
      },
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
   * Get all blog categories
   */
  async getBlogCategories() {
    return prisma.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
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

    // Brand authorship: Force admin authors to appear as "Fur&Co"
    if (blog.author?.role?.toLowerCase() === 'admin') {
      transformed.author = {
        ...transformed.author,
        name: 'Fur&Co'
      };
    }

    // Add cover image URL if exists (use coverImage for frontend compatibility)
    if (blog.coverFilePath) {
      transformed.coverImage = getPublicUrl(blog.coverBucketName || 'blog-images', blog.coverFilePath);
    }

    return transformed;
  }
}

export const blogService = new BlogService();
