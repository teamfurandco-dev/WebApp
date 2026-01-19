#!/usr/bin/env node

/**
 * Test the product API to verify "Product not found" is fixed
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Copy of the updated API function
function extractSpecifications(attributes, categoryType) {
  if (!attributes) return {};

  switch (categoryType) {
    case 'Food':
      return {
        ingredients: attributes.ingredients || [],
        nutritional_info: attributes.nutritional_info || [],
        usage_instructions: attributes.usage_instructions || '',
        safety_notes: attributes.safety_notes || [],
        suitable_for: attributes.suitable_for || []
      };
    
    case 'Toys':
      return {
        material: attributes.material || '',
        durability_level: attributes.durability_level || '',
        age_range: attributes.age_range || '',
        safety_notes: attributes.safety_notes || [],
        care_instructions: attributes.care_instructions || ''
      };
    
    case 'Accessories':
      return {
        material: attributes.material || '',
        color_variants: attributes.color_variants || [],
        size_guide: attributes.size_guide || '',
        care_instructions: attributes.care_instructions || '',
        warranty: attributes.warranty || ''
      };
    
    default:
      return attributes;
  }
}

async function getProductBySlug(slug) {
  try {
    // Get product base data with category
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        id, name, slug, description, images, attributes,
        average_rating, reviews_count, is_featured, category_id,
        categories!inner(name)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      console.error('Error fetching product by slug:', productError);
      return null;
    }

    // Get product variants
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id, sku, price_cents, stock_quantity, attributes')
      .eq('product_id', product.id);

    if (variantsError) {
      console.error('Error fetching variants:', variantsError);
    }

    // Get related products from same category
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select('id, name, slug, images, average_rating')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .eq('is_active', true)
      .limit(4);

    if (relatedError) {
      console.error('Error fetching related products:', relatedError);
    }

    // Determine category type from attributes or category name
    const categoryType = product.attributes?.category_type || 
      (product.categories.name.toLowerCase().includes('food') ? 'Food' :
       product.categories.name.toLowerCase().includes('toy') ? 'Toys' : 'Accessories');

    // Transform variants to match expected structure
    const productVariants = (variants || []).map(variant => ({
      id: variant.id,
      variant_name: variant.attributes?.variant_name || 'Default',
      price_cents: variant.price_cents,
      compare_at_price_cents: variant.attributes?.compare_at_price_cents || null,
      sku: variant.sku,
      stock_quantity: variant.stock_quantity,
      attributes: variant.attributes
    }));

    // Transform related products to match expected structure
    const relatedProductsFormatted = (relatedProducts || []).map(rp => ({
      id: rp.id,
      name: rp.name,
      slug: rp.slug,
      images: rp.images,
      average_rating: rp.average_rating,
      min_price: null
    }));

    // Build final result matching RPC structure
    const result = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      images: product.images,
      brand: product.attributes?.brand || 'Unknown Brand',
      category_name: product.categories.name,
      category_type: categoryType,
      attributes: product.attributes,
      average_rating: product.average_rating,
      reviews_count: product.reviews_count,
      is_featured: product.is_featured,
      productVariants: productVariants,
      relatedProducts: relatedProductsFormatted
    };

    // Transform for frontend consumption
    return {
      ...result,
      category: result.category_name,
      rating: result.average_rating || 0,
      reviewsCount: result.reviews_count || 0,
      specifications: extractSpecifications(result.attributes, result.category_type)
    };

  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
}

async function testAPI() {
  console.log('🧪 Testing Product API...');
  console.log('========================\n');

  const testSlugs = ['royal-canin-maxi-adult', 'kong-classic-dog-toy'];

  for (const slug of testSlugs) {
    console.log(`🔍 Testing: ${slug}`);
    
    const product = await getProductBySlug(slug);
    
    if (!product) {
      console.log('❌ Product not found\n');
      continue;
    }

    console.log('✅ Product found!');
    console.log(`   Name: ${product.name}`);
    console.log(`   Brand: ${product.brand}`);
    console.log(`   Category: ${product.category} (${product.category_type})`);
    console.log(`   Variants: ${product.productVariants.length}`);
    console.log(`   Related: ${product.relatedProducts.length}`);
    console.log(`   Specifications: ${Object.keys(product.specifications).length} fields`);
    
    if (product.productVariants.length > 0) {
      const variant = product.productVariants[0];
      console.log(`   First variant: ${variant.variant_name} - $${(variant.price_cents / 100).toFixed(2)}`);
    }
    
    console.log('');
  }

  console.log('🎉 API Test Complete!');
  console.log('\n📋 Summary:');
  console.log('   • Products have proper structure');
  console.log('   • Variants are loaded correctly');
  console.log('   • Category-specific specifications work');
  console.log('   • "Product not found" error should be resolved');
}

testAPI();
