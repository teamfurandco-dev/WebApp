import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Need service key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function loadDummyData() {
  try {
    console.log('Loading dummy data into Supabase...');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(path.join(process.cwd(), 'database', 'dummy_data.sql'), 'utf8');
    
    // Split SQL into individual statements (basic splitting)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`Error in statement ${i + 1}:`, error);
          console.error('Statement:', statement.substring(0, 200) + '...');
        } else {
          console.log(`✓ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`Exception in statement ${i + 1}:`, err.message);
        console.error('Statement:', statement.substring(0, 200) + '...');
      }
    }
    
    console.log('Dummy data loading completed!');
    
    // Verify the data was loaded
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('name, slug, average_rating, reviews_count')
      .order('created_at', { ascending: false });
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
    } else {
      console.log('\nLoaded products:');
      products.forEach(product => {
        console.log(`- ${product.name} (${product.slug}) - Rating: ${product.average_rating}, Reviews: ${product.reviews_count}`);
      });
    }
    
  } catch (error) {
    console.error('Failed to load dummy data:', error);
  }
}

loadDummyData();
