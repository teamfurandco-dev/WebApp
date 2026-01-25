-- Fur & Co Database Schema Optimization
-- Optimized for Shop, Product, and User Profile modules

-- 1. PRODUCTS TABLE OPTIMIZATION
ALTER TABLE products 
ADD COLUMN variants jsonb DEFAULT '[]'::jsonb,
ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', name || ' ' || description)) STORED,
ADD COLUMN is_featured boolean DEFAULT false,
ADD COLUMN reviews_count integer DEFAULT 0;

-- Product indexes for shop filtering
CREATE INDEX idx_products_shop_filter ON products (category, is_active, base_price_cents);
CREATE INDEX idx_products_search ON products USING gin(search_vector);
CREATE INDEX idx_products_featured ON products (is_featured, average_rating DESC) WHERE is_active = true;

-- 2. ORDERS TABLE OPTIMIZATION  
ALTER TABLE orders
ADD COLUMN items_data jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN shipping_status text DEFAULT 'pending',
ADD COLUMN tracking_number text,
DROP COLUMN IF EXISTS order_items_id;

-- Remove order_items table (data moved to orders.items_data)
DROP TABLE IF EXISTS order_items CASCADE;

-- Order indexes
CREATE INDEX idx_orders_user_timeline ON orders (user_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders (status, updated_at);

-- 3. PROFILES TABLE OPTIMIZATION
ALTER TABLE profiles
ADD COLUMN default_address_id uuid REFERENCES addresses(id),
ADD COLUMN order_stats jsonb DEFAULT '{"total_orders": 0, "total_spent_cents": 0, "last_order_date": null}'::jsonb,
ADD COLUMN preferences jsonb DEFAULT '{}'::jsonb;

-- Profile indexes
CREATE INDEX idx_profiles_referral ON profiles (referral_code) WHERE referral_code IS NOT NULL;

-- 4. ADDRESSES TABLE OPTIMIZATION
CREATE INDEX idx_addresses_user_default ON addresses (user_id, is_default);

-- 5. CATEGORIES TABLE OPTIMIZATION
ALTER TABLE categories ADD COLUMN product_count integer DEFAULT 0;

-- 6. USER ACTIVITY SUMMARY (replacing detailed logs)
CREATE TABLE user_activity_summary (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    last_login_at timestamptz,
    page_views_count integer DEFAULT 0,
    products_viewed_count integer DEFAULT 0,
    searches_count integer DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

-- Drop detailed activity logs table
DROP TABLE IF EXISTS user_activity_logs CASCADE;

-- 7. PERFORMANCE FUNCTIONS
CREATE OR REPLACE FUNCTION update_profile_order_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles SET 
        order_stats = jsonb_build_object(
            'total_orders', (SELECT COUNT(*) FROM orders WHERE user_id = NEW.user_id),
            'total_spent_cents', (SELECT COALESCE(SUM(total_cents), 0) FROM orders WHERE user_id = NEW.user_id AND status = 'delivered'),
            'last_order_date', (SELECT MAX(created_at) FROM orders WHERE user_id = NEW.user_id)
        )
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_stats
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_order_stats();

-- 8. SEARCH FUNCTION
CREATE OR REPLACE FUNCTION search_products(search_term text, category_filter text DEFAULT NULL)
RETURNS TABLE (
    id uuid,
    name text,
    description text,
    base_price_cents bigint,
    images jsonb,
    category text,
    average_rating numeric,
    rank real
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.base_price_cents,
        p.images,
        p.category,
        p.average_rating,
        ts_rank(p.search_vector, plainto_tsquery('english', search_term)) as rank
    FROM products p
    WHERE 
        p.is_active = true
        AND (category_filter IS NULL OR p.category = category_filter)
        AND (search_term IS NULL OR p.search_vector @@ plainto_tsquery('english', search_term))
    ORDER BY 
        CASE WHEN search_term IS NOT NULL THEN ts_rank(p.search_vector, plainto_tsquery('english', search_term)) END DESC,
        p.average_rating DESC;
END;
$$ LANGUAGE plpgsql;
