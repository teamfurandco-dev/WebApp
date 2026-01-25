#!/usr/bin/env node

/**
 * Load comprehensive dummy data using direct Supabase operations
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function loadData() {
  console.log('🚀 Loading comprehensive dummy data...');

  try {
    // First, apply the migration manually
    console.log('📊 Applying schema updates...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await supabase.from('product_answers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('product_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Get categories
    const { data: categories } = await supabase.from('categories').select('id, name');
    const foodCat = categories?.find(c => c.name.toLowerCase().includes('food'));
    const toyCat = categories?.find(c => c.name.toLowerCase().includes('toy'));
    const accessoryCat = categories?.find(c => c.name.toLowerCase().includes('accessor') || c.name.toLowerCase().includes('grooming'));

    if (!foodCat || !toyCat || !accessoryCat) {
      console.log('📝 Creating missing categories...');
      
      if (!foodCat) {
        await supabase.from('categories').insert({
          name: 'Pet Food',
          slug: 'pet-food',
          description: 'Nutritious food for dogs and cats'
        });
      }
      
      if (!toyCat) {
        await supabase.from('categories').insert({
          name: 'Pet Toys',
          slug: 'pet-toys', 
          description: 'Fun and engaging toys for pets'
        });
      }
      
      if (!accessoryCat) {
        await supabase.from('categories').insert({
          name: 'Pet Accessories',
          slug: 'pet-accessories',
          description: 'Collars, leashes, and other accessories'
        });
      }

      // Refresh categories
      const { data: newCategories } = await supabase.from('categories').select('id, name');
      const newFoodCat = newCategories?.find(c => c.name.toLowerCase().includes('food'));
      const newToyCat = newCategories?.find(c => c.name.toLowerCase().includes('toy'));
      const newAccessoryCat = newCategories?.find(c => c.name.toLowerCase().includes('accessor'));
      
      console.log('✅ Categories created');
    }

    // Refresh categories after potential creation
    const { data: finalCategories } = await supabase.from('categories').select('id, name');
    const finalFoodCat = finalCategories?.find(c => c.name.toLowerCase().includes('food'));
    const finalToyCat = finalCategories?.find(c => c.name.toLowerCase().includes('toy'));
    const finalAccessoryCat = finalCategories?.find(c => c.name.toLowerCase().includes('accessor') || c.name.toLowerCase().includes('grooming'));

    // Insert products
    console.log('📦 Inserting products...');
    
    const products = [
      {
        name: 'Premium Chicken & Rice Dog Food',
        slug: 'premium-chicken-rice-dog-food',
        description: 'Complete nutrition for adult dogs with real chicken as the first ingredient. Fortified with vitamins and minerals for optimal health.',
        base_price_cents: 2999,
        compare_at_price_cents: 3499,
        images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
        category_id: finalFoodCat?.id,
        attributes: {
          brand: 'PetNutrition Pro',
          category_type: 'Food',
          ingredients: ['Chicken', 'Brown Rice', 'Sweet Potatoes', 'Peas', 'Chicken Fat', 'Natural Flavors'],
          nutritional_info: [
            { nutrient: 'Crude Protein', amount: '26% min' },
            { nutrient: 'Crude Fat', amount: '16% min' },
            { nutrient: 'Crude Fiber', amount: '4% max' },
            { nutrient: 'Moisture', amount: '10% max' }
          ],
          usage_instructions: 'Feed 1-3 cups daily based on dog weight. Divide into 2 meals. Always provide fresh water.',
          safety_notes: ['Store in cool, dry place', 'Keep sealed after opening', 'Use within 6 weeks of opening'],
          suitable_for: ['Adult dogs', 'All breed sizes', 'Active lifestyle', 'Sensitive stomachs']
        },
        average_rating: 4.7,
        reviews_count: 89,
        is_featured: true,
        is_active: true
      },
      {
        name: 'Interactive Puzzle Ball',
        slug: 'interactive-puzzle-ball',
        description: 'Challenging puzzle toy that dispenses treats as your dog plays. Perfect for mental stimulation and reducing boredom.',
        base_price_cents: 1599,
        compare_at_price_cents: 1899,
        images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
        category_id: finalToyCat?.id,
        attributes: {
          brand: 'PlaySmart',
          category_type: 'Toys',
          material: 'BPA-free plastic and natural rubber',
          durability_level: 'Heavy duty',
          age_range: '6 months and up',
          safety_notes: ['Supervise during play', 'Inspect regularly for damage', 'Remove if pieces break off'],
          care_instructions: 'Hand wash with warm soapy water. Air dry completely before use.'
        },
        average_rating: 4.8,
        reviews_count: 124,
        is_featured: true,
        is_active: true
      },
      {
        name: 'Adjustable Leather Collar',
        slug: 'adjustable-leather-collar',
        description: 'Premium genuine leather collar with brass hardware. Adjustable sizing for the perfect fit and maximum comfort.',
        base_price_cents: 2499,
        compare_at_price_cents: 2999,
        images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
        category_id: finalAccessoryCat?.id,
        attributes: {
          brand: 'LeatherCraft Pro',
          category_type: 'Accessories',
          material: 'Genuine leather with brass hardware',
          color_variants: ['Black', 'Brown', 'Tan', 'Red'],
          size_guide: 'Measure neck circumference and add 2 inches. Small: 12-16", Medium: 16-20", Large: 20-24"',
          care_instructions: 'Wipe clean with damp cloth. Condition leather monthly with leather conditioner.',
          warranty: '1 year manufacturer warranty against defects'
        },
        average_rating: 4.6,
        reviews_count: 156,
        is_featured: true,
        is_active: true
      }
    ];

    const { data: insertedProducts, error: productError } = await supabase
      .from('products')
      .insert(products)
      .select('id, slug');

    if (productError) {
      console.error('❌ Error inserting products:', productError);
      return;
    }

    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Insert variants
    console.log('🔧 Inserting product variants...');
    
    const dogFoodId = insertedProducts.find(p => p.slug === 'premium-chicken-rice-dog-food')?.id;
    const puzzleBallId = insertedProducts.find(p => p.slug === 'interactive-puzzle-ball')?.id;
    const collarId = insertedProducts.find(p => p.slug === 'adjustable-leather-collar')?.id;

    const variants = [
      // Dog Food variants
      { product_id: dogFoodId, variant_name: '5lb Bag', price_cents: 2999, compare_at_price_cents: 3499, sku: 'PCR-5LB-001', stock_quantity: 45, attributes: { size: '5lb' } },
      { product_id: dogFoodId, variant_name: '15lb Bag', price_cents: 6999, compare_at_price_cents: 7999, sku: 'PCR-15LB-001', stock_quantity: 32, attributes: { size: '15lb' } },
      { product_id: dogFoodId, variant_name: '30lb Bag', price_cents: 11999, compare_at_price_cents: 13999, sku: 'PCR-30LB-001', stock_quantity: 18, attributes: { size: '30lb' } },
      
      // Puzzle Ball variants
      { product_id: puzzleBallId, variant_name: 'Small', price_cents: 1599, compare_at_price_cents: 1899, sku: 'IPB-SM-001', stock_quantity: 89, attributes: { size: 'Small', diameter: '3 inches' } },
      { product_id: puzzleBallId, variant_name: 'Large', price_cents: 2299, compare_at_price_cents: 2699, sku: 'IPB-LG-001', stock_quantity: 56, attributes: { size: 'Large', diameter: '4.5 inches' } },
      
      // Collar variants
      { product_id: collarId, variant_name: 'Small Black', price_cents: 2499, compare_at_price_cents: 2999, sku: 'ALC-SM-BLK', stock_quantity: 34, attributes: { size: 'Small', color: 'Black' } },
      { product_id: collarId, variant_name: 'Medium Brown', price_cents: 2799, compare_at_price_cents: 3299, sku: 'ALC-MD-BRN', stock_quantity: 28, attributes: { size: 'Medium', color: 'Brown' } },
      { product_id: collarId, variant_name: 'Large Tan', price_cents: 3099, compare_at_price_cents: 3599, sku: 'ALC-LG-TAN', stock_quantity: 19, attributes: { size: 'Large', color: 'Tan' } }
    ];

    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variants);

    if (variantError) {
      console.error('❌ Error inserting variants:', variantError);
      return;
    }

    console.log(`✅ Inserted ${variants.length} product variants`);

    console.log('🎉 Comprehensive dummy data loaded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • ${insertedProducts.length} products with detailed descriptions`);
    console.log(`   • ${variants.length} product variants with proper pricing`);
    console.log('   • Category-specific attributes and specifications');
    console.log('\n🚀 Your application should now work without "Product not found" errors!');

  } catch (error) {
    console.error('❌ Error loading data:', error);
  }
}

loadData();
