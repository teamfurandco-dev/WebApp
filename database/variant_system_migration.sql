-- Multi-Category E-commerce Variant System Migration
-- CRITICAL: Frontend expects exact data structure

-- 1. Update product_variants table structure
ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS variant_name text DEFAULT 'Default',
ADD COLUMN IF NOT EXISTS compare_at_price_cents bigint;

-- 2. Update products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS brand text,
ADD COLUMN IF NOT EXISTS category_type text DEFAULT 'Food';

CREATE INDEX IF NOT EXISTS idx_products_attributes_gin ON products USING gin(attributes);

-- 3. Migrate existing products to variant system
INSERT INTO product_variants (product_id, variant_name, price_cents, compare_at_price_cents, sku, stock_quantity)
SELECT 
    p.id,
    'Default',
    p.base_price_cents,
    p.compare_at_price_cents,
    CONCAT(LEFT(UPPER(REPLACE(p.name, ' ', '')), 8), '-DEF-', SUBSTRING(p.id::text, 1, 8)),
    50
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id
)
ON CONFLICT (sku) DO NOTHING;

-- 4. Update category types
UPDATE products SET category_type = 'Food' 
WHERE category_id IN (SELECT id FROM categories WHERE name ILIKE '%food%' OR name ILIKE '%treat%');

UPDATE products SET category_type = 'Toys' 
WHERE category_id IN (SELECT id FROM categories WHERE name ILIKE '%toy%');

UPDATE products SET category_type = 'Accessories' 
WHERE category_id IN (SELECT id FROM categories WHERE name ILIKE '%accessor%' OR name ILIKE '%grooming%' OR name ILIKE '%health%');

-- 5. Add rich attributes for Food products
UPDATE products SET attributes = jsonb_build_object(
    'ingredients', ARRAY['Chicken', 'Rice', 'Vegetables', 'Vitamins'],
    'nutritional_info', jsonb_build_array(
        jsonb_build_object('nutrient', 'Protein', 'amount', '25% min'),
        jsonb_build_object('nutrient', 'Fat', 'amount', '15% min'),
        jsonb_build_object('nutrient', 'Fiber', 'amount', '4% max')
    ),
    'usage_instructions', 'Feed 2-3 times daily based on pet weight. Always provide fresh water.',
    'safety_notes', ARRAY['Store in cool, dry place', 'Keep sealed after opening'],
    'suitable_for', ARRAY['Adult dogs', 'All breeds', 'Active lifestyle']
), brand = 'Premium Pet Food'
WHERE category_type = 'Food' AND attributes IS NULL;

-- 6. Add rich attributes for Toys products
UPDATE products SET attributes = jsonb_build_object(
    'material', 'Natural rubber and cotton',
    'durability_level', 'Heavy duty',
    'age_range', '6 months and up',
    'safety_notes', ARRAY['Supervise during play', 'Inspect regularly for damage'],
    'care_instructions', 'Hand wash with mild soap, air dry'
), brand = 'PlayTime'
WHERE category_type = 'Toys' AND attributes IS NULL;

-- 7. Add rich attributes for Accessories products
UPDATE products SET attributes = jsonb_build_object(
    'material', 'Premium nylon and metal hardware',
    'color_variants', ARRAY['Black', 'Brown', 'Red', 'Blue'],
    'size_guide', 'Measure neck circumference. Add 2 inches for comfort.',
    'care_instructions', 'Machine washable cold, air dry',
    'warranty', '1 year manufacturer warranty'
), brand = 'PetGear'
WHERE category_type = 'Accessories' AND attributes IS NULL;
