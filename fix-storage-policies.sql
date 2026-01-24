-- Allow anyone to upload to product-images bucket
CREATE POLICY "Allow uploads" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to view images from product-images bucket  
CREATE POLICY "Allow public access" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');

-- Allow deletes (for admin)
CREATE POLICY "Allow deletes" ON storage.objects 
FOR DELETE USING (bucket_id = 'product-images');
