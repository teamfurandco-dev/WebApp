# Quick Start Checklist

## ✅ Backend Setup (5 minutes)

### 1. Install Dependencies
```bash
cd apps/backend
pnpm install
```

### 2. Configure Environment
Create `apps/backend/.env`:
```env
DATABASE_URL=your_postgresql_url
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_random_secret
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3001
```

### 3. Set Up Database
```bash
pnpm prisma:push
pnpm prisma:generate
```

### 4. Create Supabase Storage Buckets
In Supabase Dashboard → Storage:
- Create `product-images` bucket (Public)
- Create `blog-images` bucket (Public)

Or run SQL from `SUPABASE_SETUP.md`

### 5. Start Backend
```bash
pnpm dev
```

### 6. Test
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/products
```

## 📝 What You Get

### API Endpoints Ready

**Products:**
- `GET /api/products` - List products
- `GET /api/products/homepage/:section` - Homepage products
- `GET /api/products/:id` - Single product
- `POST /api/products` - Create product
- `POST /api/products/variants` - Create variant
- `POST /api/products/images` - Add image

**Blogs:**
- `GET /api/blogs` - List blogs
- `GET /api/blogs/homepage/:section` - Homepage blogs
- `GET /api/blogs/:id` - Single blog
- `POST /api/blogs` - Create blog
- `POST /api/blogs/images` - Add image

**Uploads:**
- `POST /api/uploads/products/:id` - Upload product image
- `POST /api/uploads/blogs/:id` - Upload blog image

### Database Schema

- ✅ Products with variants
- ✅ Product images (Supabase storage refs)
- ✅ Blogs with categories
- ✅ Blog images (Supabase storage refs)
- ✅ Users & Orders
- ✅ Flexible flagging system
- ✅ Homepage section support

### Features

- ✅ No direct URLs in database
- ✅ Runtime URL generation
- ✅ File upload handling
- ✅ Search & filtering
- ✅ Pagination
- ✅ Validation with Zod
- ✅ Error handling
- ✅ Rate limiting

## 🎯 Next: Frontend Integration

### Update Webapp API Service

```javascript
// apps/webapp/src/services/api.js

// Get homepage products
export async function getHomepageProducts(section) {
  const response = await fetch(
    `${API_URL}/api/products/homepage/${section}`
  );
  return response.json();
}

// Get single product
export async function getProduct(slug) {
  const response = await fetch(`${API_URL}/api/products/${slug}`);
  return response.json();
}

// Images already have URLs in response!
// product.images[0].url is ready to use
```

### Update Admin Panel

Create upload component:
```javascript
async function uploadProductImage(productId, file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(
    `${API_URL}/api/uploads/products/${productId}`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const { data } = await response.json();
  
  // Now create image record
  await fetch(`${API_URL}/api/products/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      productId,
      bucketName: data.bucketName,
      filePath: data.filePath,
      isPrimary: true
    })
  });
}
```

## 📚 Documentation

- **ARCHITECTURE.md** - Full architecture details
- **SUPABASE_SETUP.md** - Supabase configuration
- **IMPLEMENTATION_SUMMARY.md** - What was built

## 🆘 Troubleshooting

**Database connection fails:**
- Check DATABASE_URL format
- Verify Supabase project is active
- Check network connectivity

**Upload fails:**
- Verify storage buckets exist
- Check bucket is set to Public
- Verify SUPABASE_SERVICE_ROLE_KEY is correct

**CORS errors:**
- Update CORS_ORIGIN in .env
- Restart backend after env changes

**Images not loading:**
- Check bucket permissions
- Verify file was uploaded successfully
- Check browser console for errors

## ✨ You're Ready!

Your production-ready backend is set up with:
- ✅ Proper media storage architecture
- ✅ Flexible homepage sections
- ✅ Scalable product/variant system
- ✅ Admin-friendly workflows
- ✅ Type-safe APIs
- ✅ Comprehensive documentation

Start building your frontend! 🚀
