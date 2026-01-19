import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables
const supabaseUrl = 'https://isaphgvbdyqrblwnsrmn.supabase.co';
const supabaseAnonKey = 'your_anon_key_here'; // Replace with actual anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loadDummyData() {
  try {
    console.log('Loading dummy data...');
    
    // Get category IDs first
    const { data: categories } = await supabase.from('categories').select('id, name');
    const dogFoodCat = categories.find(c => c.name === 'Dog Food');
    const accessoriesCat = categories.find(c => c.name === 'Accessories');
    const toysCat = categories.find(c => c.name === 'Toys');
    
    // Insert new products
    const productsToInsert = [
      {
        name: 'Wholesome Kibble Premium Adult',
        slug: 'wholesome-kibble-premium',
        description: 'Premium dry dog food made with real chicken and wholesome grains. Specially formulated for adult dogs with high-quality proteins and essential nutrients that support muscle maintenance, shiny coats, and boundless energy.',
        base_price_cents: 299900,
        compare_at_price_cents: 349900,
        images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
        category_id: dogFoodCat?.id,
        attributes: {
          variants: [{ type: 'size', options: ['1.5kg', '3kg', '7kg', '12kg'] }],
          nutritional_info: [
            { nutrient: 'Crude Protein', amount: '26.0% min' },
            { nutrient: 'Crude Fat', amount: '15.0% min' },
            { nutrient: 'Crude Fiber', amount: '4.0% max' },
            { nutrient: 'Moisture', amount: '10.0% max' },
            { nutrient: 'Omega-6 Fatty Acids', amount: '2.5% min' }
          ],
          ingredients: ['Chicken', 'Brown Rice', 'Sweet Potato', 'Peas', 'Carrots', 'Blueberries'],
          usage_instructions: 'Feed according to your dog weight and activity level. Transition gradually over 7-10 days by mixing with current food. Always provide fresh water.',
          safety_notes: ['Store in cool, dry place', 'Keep away from direct sunlight', 'Use within 6 weeks of opening', 'Not suitable for puppies under 12 months'],
          suitable_for: ['Adult dogs (1-7 years)', 'Medium to large breeds', 'Active and working dogs', 'Dogs with normal activity levels']
        },
        is_active: true,
        is_featured: true,
        average_rating: 4.5,
        reviews_count: 127
      },
      {
        name: 'Comfort Paw Orthopedic Bed',
        slug: 'comfort-paw-bed',
        description: 'Ultra-soft orthopedic bed designed for maximum comfort and joint support. Perfect for senior dogs and those with joint issues. Features memory foam construction and removable, machine-washable cover.',
        base_price_cents: 149900,
        compare_at_price_cents: 199900,
        images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
        category_id: accessoriesCat?.id,
        attributes: {
          variants: [{ type: 'size', options: ['Small (60x45cm)', 'Medium (75x60cm)', 'Large (90x75cm)', 'XL (105x90cm)'] }],
          usage_instructions: 'Place in a quiet area away from high traffic. Machine washable cover can be removed for easy cleaning.',
          safety_notes: ['Spot clean regularly', 'Machine wash cover weekly', 'Allow to air dry completely', 'Inspect regularly for wear'],
          suitable_for: ['All dog sizes', 'Senior dogs', 'Dogs with joint issues', 'Recovery from surgery']
        },
        is_active: true,
        is_featured: true,
        average_rating: 4.8,
        reviews_count: 89
      },
      {
        name: 'Interactive Puzzle Feeder',
        slug: 'puzzle-feeder',
        description: 'Slow feeding puzzle bowl that challenges your dog mentally while preventing fast eating and bloating. Made from food-safe, non-toxic materials with anti-slip base.',
        base_price_cents: 79900,
        compare_at_price_cents: 99900,
        images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'],
        category_id: toysCat?.id,
        attributes: {
          variants: [{ type: 'color', options: ['Ocean Blue', 'Forest Green', 'Sunset Pink', 'Charcoal Gray'] }],
          usage_instructions: 'Fill with dry food or treats. Supervise during first few uses until your dog gets familiar. Clean after each use.',
          safety_notes: ['Dishwasher safe (top rack only)', 'Inspect regularly for damage', 'Replace if cracks appear', 'Not suitable for aggressive chewers'],
          suitable_for: ['Fast eaters', 'Dogs needing mental stimulation', 'All dog sizes', 'Indoor feeding']
        },
        is_active: true,
        is_featured: false,
        average_rating: 4.2,
        reviews_count: 56
      }
    ];
    
    const { data: newProducts, error: productsError } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();
    
    if (productsError) {
      console.error('Error inserting products:', productsError);
      return;
    }
    
    console.log(`✓ Inserted ${newProducts.length} products`);
    
    // Add some sample questions for the first product
    const kibbleProduct = newProducts.find(p => p.slug === 'wholesome-kibble-premium');
    if (kibbleProduct) {
      const questions = [
        'Is this suitable for dogs with sensitive stomachs?',
        'What is the protein source in this food?',
        'How long does the 12kg bag typically last for a 30kg dog?'
      ];
      
      for (const question of questions) {
        const { error: questionError } = await supabase
          .from('product_questions')
          .insert({
            product_id: kibbleProduct.id,
            question: question,
            is_approved: true
          });
        
        if (questionError) {
          console.error('Error inserting question:', questionError);
        }
      }
      
      console.log(`✓ Added ${questions.length} questions for ${kibbleProduct.name}`);
    }
    
    console.log('Dummy data loaded successfully!');
    
  } catch (error) {
    console.error('Failed to load dummy data:', error);
  }
}

// Run the function
loadDummyData();
