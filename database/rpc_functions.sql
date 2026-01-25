-- RPC Function for Optimized Product Fetching
-- CRITICAL: Returns exact structure expected by frontend

CREATE OR REPLACE FUNCTION get_product_details_by_slug(product_slug text)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    product_record record;
    variants_json jsonb;
    recommendations_json jsonb;
BEGIN
    -- Get product base data
    SELECT 
        p.id, p.name, p.slug, p.description, p.images, p.brand,
        c.name as category_name, p.category_type, p.attributes,
        p.average_rating, p.reviews_count, p.is_featured,
        p.category_id
    INTO product_record
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = product_slug AND p.is_active = true;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Get variants (CRITICAL: Frontend expects this exact structure)
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', pv.id,
            'variant_name', pv.variant_name,
            'price_cents', pv.price_cents,
            'compare_at_price_cents', pv.compare_at_price_cents,
            'sku', pv.sku,
            'stock_quantity', pv.stock_quantity,
            'attributes', pv.attributes
        ) ORDER BY pv.price_cents
    ) INTO variants_json
    FROM product_variants pv 
    WHERE pv.product_id = product_record.id;
    
    -- Get recommendations
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', rp.id,
            'name', rp.name,
            'slug', rp.slug,
            'images', rp.images,
            'average_rating', rp.average_rating,
            'min_price', COALESCE(min_var.min_price, rp.base_price_cents)
        ) ORDER BY rp.average_rating DESC
    ) INTO recommendations_json
    FROM (
        SELECT rp.*, min_var.min_price
        FROM products rp
        LEFT JOIN (
            SELECT product_id, MIN(price_cents) as min_price
            FROM product_variants 
            GROUP BY product_id
        ) min_var ON rp.id = min_var.product_id
        WHERE rp.category_id = product_record.category_id 
            AND rp.id != product_record.id 
            AND rp.is_active = true
        ORDER BY rp.average_rating DESC
        LIMIT 4
    ) rp;
    
    -- Build final result (CRITICAL: Frontend expects these exact field names)
    result := jsonb_build_object(
        'id', product_record.id,
        'name', product_record.name,
        'slug', product_record.slug,
        'description', product_record.description,
        'images', product_record.images,
        'brand', product_record.brand,
        'category_name', product_record.category_name,
        'category_type', product_record.category_type,
        'attributes', product_record.attributes,
        'average_rating', product_record.average_rating,
        'reviews_count', product_record.reviews_count,
        'is_featured', product_record.is_featured,
        'productVariants', COALESCE(variants_json, '[]'::jsonb),
        'relatedProducts', COALESCE(recommendations_json, '[]'::jsonb)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
