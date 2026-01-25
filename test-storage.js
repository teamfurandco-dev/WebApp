// Test Supabase Storage - Run this in browser console on admin page
async function testStorage() {
  const { supabase } = window;
  
  // Create a test file
  const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  
  try {
    // Try to upload
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`test/${Date.now()}.txt`, testFile);
    
    if (error) {
      console.error('Upload failed:', error);
    } else {
      console.log('Upload success:', data);
      
      // Try to get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);
      
      console.log('Public URL:', publicUrl);
    }
  } catch (err) {
    console.error('Storage test failed:', err);
  }
}

// Run the test
testStorage();
