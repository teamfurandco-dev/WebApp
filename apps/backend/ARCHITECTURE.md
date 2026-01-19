# Production-Ready Backend Architecture

## Overview

This document outlines the production-ready data architecture for Fur & Co, focusing on proper media storage, flexible homepage sections, and scalable product/blog management.

## Key Design Principles

1. **No Direct URLs in Database** - Store only Supabase Storage references (bucket + path)
2. **Runtime URL Generation** - Generate public/signed URLs at API response time
3. **Flexible Flagging System** - Support multiple homepage sections and features
4. **Scalable Variant Management** - Separate product and variant data
5. **Admin-Friendly** - Easy to manage from admin panel

## Database Schema

### Products & Variants

**Product Table**
- Core product information (name, description, category)
- Flags: `isActive`, `isFeatured`, `homepageSection`, `displayOrder`
- SEO: `metaTitle`, `metaDescription`, `tags[]`
- Relations: variants, images, category

**ProductVariant Table**
- Variant-specific data (SKU, size, color, weight)
- Pricing: `price`, `compareAtPrice` (for discounts)
- Stock management per variant
- Display ordering

**ProductImage Table**
- Supabase Storage reference: `bucketName`, `filePath`
- Metadata: `altText`, `displayOrder`, `isPrimary`
- No direct URLs stored

### Blogs

**Blog Table**
- Content: `title`, `slug`, `excerpt`, `content`
- Cover image: `coverBucketName`, `coverFilePath`, `coverAltText`
- Publishing: `publishStatus` (draft/published), `publishedAt`
- Flags: `isFeatured`, `homepageSection`, `displayOrder`
- SEO: `metaTitle`, `metaDescription`, `tags[]`

**BlogImage Table**
- Inline images for blog content
- Supabase Storage reference: `bucketName`, `filePath`
- Metadata: `altText`, `caption`, `displayOrder`

## API Endpoints

### Products

```
GET    /api/products                    # List products with filters
GET    /api/products/homepage/:section  # Get homepage section products
GET    /api/products/:idOrSlug          # Get single product
POST   /api/products                    # Create product (admin)
PATCH  /api/products/:id                # Update product (admin)
DELETE /api/products/:id                # Delete product (admin)

POST   /api/products/variants           # Create variant (admin)
PATCH  /api/products/variants/:id       # Update variant (admin)
DELETE /api/products/variants/:id       # Delete variant (admin)

POST   /api/products/images             # Add product image (admin)
DELETE /api/products/images/:id         # Delete product image (admin)
```

### Blogs

```
GET    /api/blogs                       # List blogs with filters
GET    /api/blogs/homepage/:section     # Get homepage section blogs
GET    /api/blogs/:idOrSlug             # Get single blog
POST   /api/blogs                       # Create blog (admin)
PATCH  /api/blogs/:id                   # Update blog (admin)
DELETE /api/blogs/:id                   # Delete blog (admin)

POST   /api/blogs/images                # Add blog image (admin)
DELETE /api/blogs/images/:id            # Delete blog image (admin)
```

### Uploads

```
POST   /api/uploads/products/:productId # Upload product image
POST   /api/uploads/blogs/:blogId       # Upload blog image
DELETE /api/uploads/:bucket/:path       # Delete file
```

## Query Parameters

### Products Endpoint

```
GET /api/products?categoryId=uuid&homepageSection=everyday-essentials&isFeatured=true&isActive=true&limit=20&offset=0&search=dog
```

- `categoryId` - Filter by category UUID
- `homepageSection` - Filter by homepage section name
- `isFeatured` - Filter featured products
- `isActive` - Filter active products
- `limit` - Pagination limit (default: 50)
- `offset` - Pagination offset (default: 0)
- `search` - Search in name/description

### Blogs Endpoint

```
GET /api/blogs?publishStatus=published&isFeatured=true&homepageSection=featured-posts&categoryId=uuid&limit=10
```

- `publishStatus` - Filter by draft/published
- `isFeatured` - Filter featured blogs
- `homepageSection` - Filter by homepage section
- `categoryId` - Filter by blog category
- `authorId` - Filter by author
- `limit` - Pagination limit
- `offset` - Pagination offset
- `search` - Search in title/excerpt/content

## Homepage Sections

### Predefined Sections

**Products:**
- `everyday-essentials` - Daily use products
- `trending` - Trending products
- `new-arrivals` - Recently added products
- `featured` - Featured products
- `best-sellers` - Top selling products

**Blogs:**
- `featured-posts` - Featured blog posts
- `latest` - Latest blog posts
- `popular` - Popular blog posts

### Custom Sections

You can create any custom section name. The system is flexible and doesn't enforce specific section names.

## Media Storage Strategy

### Supabase Storage Buckets

1. **product-images** - All product images
2. **blog-images** - All blog images

### File Path Structure

```
product-images/
  └── products/
      └── {productId}/
          ├── {uuid}.jpg
          ├── {uuid}.png
          └── ...

blog-images/
  └── blogs/
      └── {blogId}/
          ├── {uuid}.jpg
          ├── {uuid}.png
          └── ...
```

### URL Generation

**At API Response Time:**
```typescript
// Product images
product.images.map(img => ({
  ...img,
  url: getPublicUrl(img.bucketName, img.filePath)
}))

// Blog cover image
blog.coverImageUrl = getPublicUrl(blog.coverBucketName, blog.coverFilePath)
```

**Benefits:**
- No broken URLs if storage changes
- Easy image replacement
- Better security with signed URLs option
- Centralized URL generation logic

## Admin Panel Workflow

### Adding a Product

1. Create product with basic info
2. Upload images → Get `bucketName` and `filePath`
3. Create `ProductImage` records with storage references
4. Create variants with pricing and stock
5. Set flags: `isActive`, `isFeatured`, `homepageSection`

### Managing Homepage

1. Query products by section: `GET /api/products/homepage/everyday-essentials`
2. Update product flags to add/remove from sections
3. Use `displayOrder` to control ordering within sections
4. Multiple products can have same `homepageSection`

### Uploading Images

```bash
# Upload product image
POST /api/uploads/products/{productId}
Content-Type: multipart/form-data
file: [binary]

Response:
{
  "data": {
    "bucketName": "product-images",
    "filePath": "products/abc-123/uuid.jpg",
    "filename": "original-name.jpg"
  }
}

# Then create ProductImage record
POST /api/products/images
{
  "productId": "abc-123",
  "bucketName": "product-images",
  "filePath": "products/abc-123/uuid.jpg",
  "altText": "Product image",
  "isPrimary": true
}
```

## Data Validation

All endpoints use Zod schemas for validation:

- Required fields enforced
- Type checking (UUID, numbers, booleans)
- Enum validation (publishStatus, etc.)
- Array validation (tags)
- Optional fields handled properly

## Indexing Strategy

Database indexes on:
- `slug` fields for fast lookups
- `isActive`, `isFeatured` for filtering
- `homepageSection` for homepage queries
- `categoryId`, `authorId` for relations
- `publishStatus` for blog filtering

## Next Steps

1. **Run Prisma Migration**
   ```bash
   cd apps/backend
   pnpm prisma:push
   pnpm prisma:generate
   ```

2. **Create Supabase Storage Buckets**
   - Create `product-images` bucket (public)
   - Create `blog-images` bucket (public)

3. **Install Dependencies**
   ```bash
   cd apps/backend
   pnpm install
   ```

4. **Start Backend**
   ```bash
   pnpm dev
   ```

5. **Test Endpoints**
   - Health check: `GET http://localhost:3000/health`
   - Products: `GET http://localhost:3000/api/products`
   - Blogs: `GET http://localhost:3000/api/blogs`

## Environment Variables

```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
PORT=3000
NODE_ENV=development
```
