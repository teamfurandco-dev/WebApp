#!/usr/bin/env node

/**
 * Add variants to existing products to fix "Product not found" error
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addVariantsToExistingProducts() {
  console.log('🚀 Adding variants to existing products...');

  try {
    // Get all products without variants
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug, base_price_cents, compare_at_price_cents');

    if (!products || products.length === 0) {
      console.log('❌ No products found');
      return;
    }

    console.log(`📦 Found ${products.length} products`);

    // Check which products already have variants
    const { data: existingVariants } = await supabase
      .from('product_variants')
      .select('product_id');

    const productsWithVariants = new Set(existingVariants?.map(v => v.product_id) || []);

    // Add variants for products that don't have them
    const variantsToAdd = [];

    for (const product of products) {
      if (!productsWithVariants.has(product.id)) {
        // Create a default variant for each product
        variantsToAdd.push({
          product_id: product.id,
          sku: `${product.slug.substring(0, 10).toUpperCase().replace(/-/g, '')}-DEF-001`,
          price_cents: product.base_price_cents || 1999,
          stock_quantity: 50,
          attributes: { variant_name: 'Default', size: 'Standard' }
        });

        // Add size variants for variety
        if (product.name.toLowerCase().includes('food')) {
          variantsToAdd.push({
            product_id: product.id,
            sku: `${product.slug.substring(0, 10).toUpperCase().replace(/-/g, '')}-SM-001`,
            price_cents: Math.floor((product.base_price_cents || 1999) * 0.7),
            stock_quantity: 75,
            attributes: { variant_name: 'Small (5lb)', size: 'Small', weight: '5lb' }
          });
          
          variantsToAdd.push({
            product_id: product.id,
            sku: `${product.slug.substring(0, 10).toUpperCase().replace(/-/g, '')}-LG-001`,
            price_cents: Math.floor((product.base_price_cents || 1999) * 1.5),
            stock_quantity: 30,
            attributes: { variant_name: 'Large (15lb)', size: 'Large', weight: '15lb' }
          });
        } else if (product.name.toLowerCase().includes('toy')) {
          variantsToAdd.push({
            product_id: product.id,
            sku: `${product.slug.substring(0, 10).toUpperCase().replace(/-/g, '')}-SM-001`,
            price_cents: Math.floor((product.base_price_cents || 1999) * 0.8),
            stock_quantity: 100,
            attributes: { variant_name: 'Small', size: 'Small' }
          });
          
          variantsToAdd.push({
            product_id: product.id,
            sku: `${product.slug.substring(0, 10).toUpperCase().replace(/-/g, '')}-LG-001`,
            price_cents: Math.floor((product.base_price_cents || 1999) * 1.3),
            stock_quantity: 60,
            attributes: { variant_name: 'Large', size: 'Large' }
          });
        }
      }
    }

    if (variantsToAdd.length === 0) {
      console.log('✅ All products already have variants');
      return;
    }

    console.log(`🔧 Adding ${variantsToAdd.length} variants...`);

    // Insert variants in batches to avoid conflicts
    const batchSize = 10;
    for (let i = 0; i < variantsToAdd.length; i += batchSize) {
      const batch = variantsToAdd.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('product_variants')
        .insert(batch);

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
        // Continue with next batch
      } else {
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(variantsToAdd.length/batchSize)}`);
      }
    }

    // Verify the results
    const { data: finalVariants } = await supabase
      .from('product_variants')
      .select('id, sku, product_id, attributes');

    console.log(`✅ Total variants in database: ${finalVariants?.length || 0}`);

    console.log('\n🎉 Variants added successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • ${products.length} products checked`);
    console.log(`   • ${variantsToAdd.length} new variants added`);
    console.log(`   • ${finalVariants?.length || 0} total variants in database`);
    console.log('\n🚀 Product pages should now work without "Product not found" errors!');

  } catch (error) {
    console.error('❌ Error adding variants:', error);
  }
}

addVariantsToExistingProducts();
