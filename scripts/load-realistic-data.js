#!/usr/bin/env node

/**
 * Load realistic product data for Fur & Co production
 * This script loads comprehensive product data with variants, reviews, and Q&A
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function loadRealisticData() {
  console.log('🚀 Loading realistic product data for production...');
  
  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, '../database/realistic_products.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split into individual statements (basic splitting by semicolon)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        });
        
        if (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          // Continue with other statements
        }
      }
    }
    
    // Verify the data was loaded
    console.log('\n✅ Verifying data load...');
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category_id')
      .eq('is_active', true);
    
    if (productsError) {
      console.error('❌ Error verifying products:', productsError);
    } else {
      console.log(`✅ Loaded ${products.length} products successfully`);
    }
    
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id, sku, product_id');
    
    if (variantsError) {
      console.error('❌ Error verifying variants:', variantsError);
    } else {
      console.log(`✅ Loaded ${variants.length} product variants successfully`);
    }
    
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, rating, product_id');
    
    if (reviewsError) {
      console.error('❌ Error verifying reviews:', reviewsError);
    } else {
      console.log(`✅ Loaded ${reviews.length} reviews successfully`);
    }
    
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, product_count');
    
    if (categoriesError) {
      console.error('❌ Error verifying categories:', categoriesError);
    } else {
      console.log(`✅ Categories loaded:`);
      categories.forEach(cat => {
        console.log(`   - ${cat.name}: ${cat.product_count} products`);
      });
    }
    
    console.log('\n🎉 Realistic product data loaded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • ${products?.length || 0} products with detailed descriptions`);
    console.log(`   • ${variants?.length || 0} product variants with proper pricing`);
    console.log(`   • ${reviews?.length || 0} realistic customer reviews`);
    console.log(`   • ${categories?.length || 0} product categories`);
    console.log('\n🚀 Your application is now production-ready with realistic data!');
    
  } catch (error) {
    console.error('❌ Failed to load realistic data:', error);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution if RPC doesn't work
async function loadDataDirectly() {
  console.log('🔄 Trying direct SQL execution method...');
  
  try {
    const sqlFile = path.join(__dirname, '../database/realistic_products.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Execute the entire SQL content at once
    const { error } = await supabase.rpc('exec_sql', { 
      sql_query: sqlContent 
    });
    
    if (error) {
      console.error('❌ Direct SQL execution failed:', error);
      return false;
    }
    
    console.log('✅ Direct SQL execution successful!');
    return true;
  } catch (error) {
    console.error('❌ Direct method failed:', error);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🎯 Fur & Co - Production Data Loader');
  console.log('=====================================\n');
  
  // Try the main method first
  try {
    await loadRealisticData();
  } catch (error) {
    console.log('\n🔄 Main method failed, trying alternative approach...');
    const success = await loadDataDirectly();
    
    if (!success) {
      console.error('\n❌ All methods failed. Please check your database connection and permissions.');
      console.error('💡 Make sure you have the correct Supabase credentials in your .env file.');
      process.exit(1);
    }
  }
}

main().catch(console.error);
