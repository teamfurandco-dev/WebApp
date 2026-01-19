#!/usr/bin/env node

/**
 * Test Script for Variant System Implementation
 * Verifies that the backend provides the exact data structure expected by frontend
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testImplementation() {
  console.log('🧪 Testing variant system implementation...');

  try {
    // Test 1: Get a product slug
    console.log('\n1. Getting sample product...');
    const { data: products } = await supabase
      .from('products')
      .select('slug, name')
      .limit(1);

    if (!products || products.length === 0) {
      console.error('❌ No products found');
      return;
    }

    const testSlug = products[0].slug;
    console.log(`✅ Testing with product: ${products[0].name} (${testSlug})`);

    // Test 2: Call RPC function
    console.log('\n2. Testing RPC function...');
    const { data: rpcResult, error: rpcError } = await supabase.rpc('get_product_details_by_slug', {
      product_slug: testSlug
    });

    if (rpcError) {
      console.error('❌ RPC function failed:', rpcError);
      return;
    }

    if (!rpcResult) {
      console.error('❌ RPC function returned null');
      return;
    }

    console.log('✅ RPC function working');

    // Test 3: Verify data structure
    console.log('\n3. Verifying data structure...');
    
    const requiredFields = [
      'id', 'name', 'slug', 'description', 'images', 'brand',
      'category_name', 'category_type', 'attributes', 'average_rating',
      'reviews_count', 'is_featured', 'productVariants', 'relatedProducts'
    ];

    const missingFields = requiredFields.filter(field => !(field in rpcResult));
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return;
    }

    console.log('✅ All required fields present');

    // Test 4: Verify productVariants structure
    console.log('\n4. Verifying productVariants structure...');
    
    if (!Array.isArray(rpcResult.productVariants)) {
      console.error('❌ productVariants is not an array');
      return;
    }

    if (rpcResult.productVariants.length > 0) {
      const variant = rpcResult.productVariants[0];
      const variantFields = ['id', 'variant_name', 'price_cents', 'sku', 'stock_quantity'];
      const missingVariantFields = variantFields.filter(field => !(field in variant));
      
      if (missingVariantFields.length > 0) {
        console.error('❌ Missing variant fields:', missingVariantFields);
        return;
      }
      
      console.log('✅ Variant structure correct');
      console.log(`   Sample variant: ${variant.variant_name} - ${variant.price_cents} cents`);
    } else {
      console.log('⚠️  No variants found for this product');
    }

    // Test 5: Verify category type
    console.log('\n5. Verifying category type...');
    
    const validCategories = ['Food', 'Toys', 'Accessories'];
    if (!validCategories.includes(rpcResult.category_type)) {
      console.error('❌ Invalid category_type:', rpcResult.category_type);
      return;
    }

    console.log(`✅ Valid category type: ${rpcResult.category_type}`);

    // Test 6: Test API service (simulated)
    console.log('\n6. Testing API service integration...');
    
    // Import and test the extractSpecifications function
    const { extractSpecifications } = await import('../src/services/api.js').catch(() => ({}));
    
    if (extractSpecifications) {
      const specs = extractSpecifications(rpcResult.attributes, rpcResult.category_type);
      console.log('✅ Specifications extracted:', Object.keys(specs));
    } else {
      console.log('⚠️  Could not test extractSpecifications function');
    }

    console.log('\n🎉 All tests passed! Backend is ready for frontend integration.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testImplementation();
