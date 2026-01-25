# Backend Implementation Tasks

## 1. Database Setup

Apply the optimized schema:
```bash
psql -d your_database -f /home/shaik/work/Fur&Co/database/schema_optimization.sql
```

## 2. Sample Data Seeding

```sql
-- Insert Categories
INSERT INTO categories (name, product_count) VALUES
('Walk', 15),
('Dine', 12),
('Rest', 8),
('Play', 20),
('Health', 10),
('Care', 14),
('Gear', 6),
('Treats', 18);

-- Insert Sample Products
INSERT INTO products (
  name, description, base_price_cents, compare_at_price_cents, 
  images, category, average_rating, reviews_count, is_featured,
  variants, nutritional_info, ingredients, usage_instructions, safety_notes, suitable_for
) VALUES
(
  'Wholesome Kibble Premium',
  'Premium dry dog food made with real chicken and wholesome grains for adult dogs.',
  299900, 349900,
  '["https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500", "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500"]',
  'Dine', 4.5, 127, true,
  '[{"type": "size", "options": ["1.5kg", "3kg", "7kg", "12kg"]}]',
  '[{"nutrient": "Crude Protein", "amount": "26.0% min"}, {"nutrient": "Crude Fat", "amount": "15.0% min"}]',
  '["Chicken", "Brown Rice", "Sweet Potato", "Peas"]',
  'Feed according to your dog''s weight and activity level. Transition gradually over 7-10 days.',
  '["Store in cool, dry place", "Keep away from direct sunlight", "Use within 6 weeks of opening"]',
  '["Adult dogs (1-7 years)", "Medium to large breeds", "Active dogs"]'
),
(
  'Comfort Paw Bed',
  'Ultra-soft orthopedic bed designed for maximum comfort and joint support.',
  149900, 199900,
  '["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500", "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500"]',
  'Rest', 4.8, 89, true,
  '[{"type": "size", "options": ["Small", "Medium", "Large", "XL"]}]',
  null, null,
  'Place in a quiet area. Machine washable cover.',
  '["Spot clean regularly", "Machine wash cover weekly"]',
  '["All dog sizes", "Senior dogs", "Dogs with joint issues"]'
);

-- Add more sample products as needed
```

## 3. API Endpoints Implementation

Create Express.js server with these endpoints:

### GET /api/products
```javascript
app.get('/api/products', async (req, res) => {
  try {
    const { category, sort, search, limit = 20, offset = 0 } = req.query;
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .range(offset, offset + limit - 1);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.textSearch('search_vector', search);
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price-low':
          query = query.order('base_price_cents', { ascending: true });
          break;
        case 'price-high':
          query = query.order('base_price_cents', { ascending: false });
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        case 'featured':
          query = query.order('is_featured', { ascending: false });
          break;
      }
    }

    const { data, error, count } = await query;
    
    if (error) throw error;

    res.json({
      products: data || [],
      total_count: count || 0,
      has_more: (parseInt(offset) + parseInt(limit)) < (count || 0)
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'FETCH_ERROR', message: error.message } });
  }
});
```

### GET /api/products/:id
```javascript
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: { code: 'FETCH_ERROR', message: error.message } });
  }
});
```

### GET /api/categories
```javascript
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json({ categories: data || [] });
  } catch (error) {
    res.status(500).json({ error: { code: 'FETCH_ERROR', message: error.message } });
  }
});
```

## 4. CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

## 5. Environment Setup
```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/furco
PORT=3001
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```
