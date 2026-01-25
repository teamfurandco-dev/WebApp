# Supabase Setup Guide

## 1. Create Storage Buckets

### Product Images Bucket

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Set up RLS policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);
```

### Blog Images Bucket

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Set up RLS policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images'
  AND auth.role() = 'authenticated'
);
```

## 2. Configure CORS (if needed)

In Supabase Dashboard → Storage → Configuration:

```json
{
  "allowedOrigins": ["http://localhost:5173", "http://localhost:3001", "https://your-domain.com"],
  "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
  "allowedHeaders": ["*"],
  "maxAgeSeconds": 3600
}
```

## 3. Get Your Credentials

From Supabase Dashboard → Settings → API:

- **Project URL**: `https://your-project.supabase.co`
- **anon/public key**: For client-side (webapp/admin)
- **service_role key**: For backend (has full access)

## 4. Update Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Webapp (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000
```

### Admin (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000
```

## 5. Test Storage

### Using Supabase Client (Frontend)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Upload file
const { data, error } = await supabase.storage
  .from('product-images')
  .upload('test/image.jpg', file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl('test/image.jpg');
```

### Using Backend API

```bash
# Upload product image
curl -X POST http://localhost:3000/api/uploads/products/{productId} \
  -F "file=@/path/to/image.jpg" \
  -H "Authorization: Bearer {token}"
```

## 6. Verify Setup

1. **Check buckets exist**:
   - Go to Supabase Dashboard → Storage
   - Verify `product-images` and `blog-images` buckets are created
   - Verify they are set to "Public"

2. **Test upload**:
   - Try uploading a test image through the dashboard
   - Verify you can access it via the public URL

3. **Test API**:
   - Start backend: `pnpm --filter backend dev`
   - Test upload endpoint with Postman/curl
   - Verify file appears in Supabase Storage

## 7. Production Considerations

### Security

- Use signed URLs for sensitive content
- Implement proper authentication checks
- Set up file size limits (already configured: 10MB)
- Validate file types before upload

### Performance

- Enable CDN for storage buckets
- Use image transformations for thumbnails
- Implement lazy loading on frontend
- Cache public URLs appropriately

### Backup

- Enable Point-in-Time Recovery (PITR) in Supabase
- Regular database backups
- Consider separate backup of storage buckets

## Troubleshooting

### Upload fails with 403

- Check RLS policies are correctly set
- Verify user is authenticated
- Check bucket permissions

### Images not loading

- Verify bucket is set to "Public"
- Check CORS configuration
- Verify file path is correct
- Check browser console for errors

### Slow uploads

- Check file size (max 10MB configured)
- Consider implementing client-side compression
- Use progress indicators for better UX
- Consider chunked uploads for large files
