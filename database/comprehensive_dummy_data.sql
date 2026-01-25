-- Comprehensive Dummy Data for Multi-Category Variant System
-- 2 products per category (Food, Toys, Accessories) with variants, reviews, and Q&A

-- Clear existing data
DELETE FROM product_answers;
DELETE FROM product_questions;
DELETE FROM reviews;
DELETE FROM product_variants;
DELETE FROM products;

-- Insert Food Products
INSERT INTO products (id, name, slug, description, images, brand, category_id, category_type, attributes, average_rating, reviews_count, is_featured, is_active) VALUES
(gen_random_uuid(), 'Premium Chicken & Rice Dog Food', 'premium-chicken-rice-dog-food', 'Complete nutrition for adult dogs with real chicken as the first ingredient. Fortified with vitamins and minerals for optimal health.',
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
'PetNutrition Pro', (SELECT id FROM categories WHERE name ILIKE '%food%' LIMIT 1), 'Food',
jsonb_build_object(
 'ingredients', ARRAY['Chicken', 'Brown Rice', 'Sweet Potatoes', 'Peas', 'Chicken Fat', 'Natural Flavors'],
 'nutritional_info', jsonb_build_array(
   jsonb_build_object('nutrient', 'Crude Protein', 'amount', '26% min'),
   jsonb_build_object('nutrient', 'Crude Fat', 'amount', '16% min'),
   jsonb_build_object('nutrient', 'Crude Fiber', 'amount', '4% max'),
   jsonb_build_object('nutrient', 'Moisture', 'amount', '10% max')
 ),
 'usage_instructions', 'Feed 1-3 cups daily based on dog weight. Divide into 2 meals. Always provide fresh water.',
 'safety_notes', ARRAY['Store in cool, dry place', 'Keep sealed after opening', 'Use within 6 weeks of opening'],
 'suitable_for', ARRAY['Adult dogs', 'All breed sizes', 'Active lifestyle', 'Sensitive stomachs']
), 4.7, 89, true, true),

(gen_random_uuid(), 'Grain-Free Salmon Cat Food', 'grain-free-salmon-cat-food', 'Premium grain-free formula with real salmon for cats of all life stages. Rich in omega fatty acids for healthy skin and coat.',
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
'FelineChoice', (SELECT id FROM categories WHERE name ILIKE '%food%' LIMIT 1), 'Food',
jsonb_build_object(
 'ingredients', ARRAY['Salmon', 'Sweet Potatoes', 'Peas', 'Salmon Meal', 'Canola Oil', 'Natural Flavors'],
 'nutritional_info', jsonb_build_array(
   jsonb_build_object('nutrient', 'Crude Protein', 'amount', '32% min'),
   jsonb_build_object('nutrient', 'Crude Fat', 'amount', '14% min'),
   jsonb_build_object('nutrient', 'Crude Fiber', 'amount', '3% max'),
   jsonb_build_object('nutrient', 'Moisture', 'amount', '10% max')
 ),
 'usage_instructions', 'Feed 1/4 to 1 cup daily based on cat weight and activity level. Transition gradually over 7 days.',
 'safety_notes', ARRAY['Store in cool, dry place', 'Refrigerate after opening', 'Use within 3 days of opening'],
 'suitable_for', ARRAY['All life stages', 'Indoor cats', 'Grain-sensitive cats', 'Healthy skin & coat']
), 4.5, 67, true, true);

-- Insert Toy Products
INSERT INTO products (id, name, slug, description, images, brand, category_id, category_type, attributes, average_rating, reviews_count, is_featured, is_active) VALUES
(gen_random_uuid(), 'Interactive Puzzle Ball', 'interactive-puzzle-ball', 'Challenging puzzle toy that dispenses treats as your dog plays. Perfect for mental stimulation and reducing boredom.',
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
'PlaySmart', (SELECT id FROM categories WHERE name ILIKE '%toy%' LIMIT 1), 'Toys',
jsonb_build_object(
 'material', 'BPA-free plastic and natural rubber',
 'durability_level', 'Heavy duty',
 'age_range', '6 months and up',
 'safety_notes', ARRAY['Supervise during play', 'Inspect regularly for damage', 'Remove if pieces break off'],
 'care_instructions', 'Hand wash with warm soapy water. Air dry completely before use.'
), 4.8, 124, true, true),

(gen_random_uuid(), 'Rope Tug Toy', 'rope-tug-toy', 'Durable cotton rope toy perfect for tug-of-war and solo play. Helps clean teeth and massage gums naturally.',
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
'TugMaster', (SELECT id FROM categories WHERE name ILIKE '%toy%' LIMIT 1), 'Toys',
jsonb_build_object(
 'material', '100% natural cotton rope',
 'durability_level', 'Moderate',
 'age_range', '3 months and up',
 'safety_notes', ARRAY['Supervise during play', 'Replace when frayed', 'Not suitable for aggressive chewers'],
 'care_instructions', 'Machine washable cold. Air dry. Do not bleach.'
), 4.3, 78, false, true);

-- Insert Accessory Products
INSERT INTO products (id, name, slug, description, images, brand, category_id, category_type, attributes, average_rating, reviews_count, is_featured, is_active) VALUES
(gen_random_uuid(), 'Adjustable Leather Collar', 'adjustable-leather-collar', 'Premium genuine leather collar with brass hardware. Adjustable sizing for the perfect fit and maximum comfort.',
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
'LeatherCraft Pro', (SELECT id FROM categories WHERE name ILIKE '%accessor%' OR name ILIKE '%grooming%' LIMIT 1), 'Accessories',
jsonb_build_object(
 'material', 'Genuine leather with brass hardware',
 'color_variants', ARRAY['Black', 'Brown', 'Tan', 'Red'],
 'size_guide', 'Measure neck circumference and add 2 inches. Small: 12-16", Medium: 16-20", Large: 20-24"',
 'care_instructions', 'Wipe clean with damp cloth. Condition leather monthly with leather conditioner.',
 'warranty', '1 year manufacturer warranty against defects'
), 4.6, 156, true, true),

(gen_random_uuid(), 'Retractable Dog Leash', 'retractable-dog-leash', 'Heavy-duty retractable leash with 16ft extension. Features comfortable grip handle and reliable brake system.',
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
'WalkEasy', (SELECT id FROM categories WHERE name ILIKE '%accessor%' OR name ILIKE '%grooming%' LIMIT 1), 'Accessories',
jsonb_build_object(
 'material', 'Nylon cord with ABS plastic housing',
 'color_variants', ARRAY['Blue', 'Red', 'Green', 'Black'],
 'size_guide', 'Small: up to 26lbs, Medium: up to 44lbs, Large: up to 88lbs',
 'care_instructions', 'Wipe housing with damp cloth. Do not submerge in water.',
 'warranty', '2 year manufacturer warranty'
), 4.2, 203, false, true);

-- Insert Product Variants
INSERT INTO product_variants (product_id, variant_name, price_cents, compare_at_price_cents, sku, stock_quantity, attributes) VALUES
-- Premium Chicken & Rice variants
((SELECT id FROM products WHERE slug = 'premium-chicken-rice-dog-food'), '5lb Bag', 2999, 3499, 'PCR-5LB-001', 45, '{"size": "5lb"}'),
((SELECT id FROM products WHERE slug = 'premium-chicken-rice-dog-food'), '15lb Bag', 6999, 7999, 'PCR-15LB-001', 32, '{"size": "15lb"}'),
((SELECT id FROM products WHERE slug = 'premium-chicken-rice-dog-food'), '30lb Bag', 11999, 13999, 'PCR-30LB-001', 18, '{"size": "30lb"}'),

-- Grain-Free Salmon variants
((SELECT id FROM products WHERE slug = 'grain-free-salmon-cat-food'), '3lb Bag', 1899, 2199, 'GFS-3LB-001', 67, '{"size": "3lb"}'),
((SELECT id FROM products WHERE slug = 'grain-free-salmon-cat-food'), '7lb Bag', 3999, 4599, 'GFS-7LB-001', 43, '{"size": "7lb"}'),

-- Interactive Puzzle Ball variants
((SELECT id FROM products WHERE slug = 'interactive-puzzle-ball'), 'Small', 1599, 1899, 'IPB-SM-001', 89, '{"size": "Small", "diameter": "3 inches"}'),
((SELECT id FROM products WHERE slug = 'interactive-puzzle-ball'), 'Large', 2299, 2699, 'IPB-LG-001', 56, '{"size": "Large", "diameter": "4.5 inches"}'),

-- Rope Tug Toy variants
((SELECT id FROM products WHERE slug = 'rope-tug-toy'), 'Small', 899, 1199, 'RTT-SM-001', 124, '{"size": "Small", "length": "8 inches"}'),
((SELECT id FROM products WHERE slug = 'rope-tug-toy'), 'Medium', 1299, 1599, 'RTT-MD-001', 98, '{"size": "Medium", "length": "12 inches"}'),
((SELECT id FROM products WHERE slug = 'rope-tug-toy'), 'Large', 1699, 1999, 'RTT-LG-001', 67, '{"size": "Large", "length": "16 inches"}'),

-- Leather Collar variants
((SELECT id FROM products WHERE slug = 'adjustable-leather-collar'), 'Small Black', 2499, 2999, 'ALC-SM-BLK', 34, '{"size": "Small", "color": "Black"}'),
((SELECT id FROM products WHERE slug = 'adjustable-leather-collar'), 'Medium Brown', 2799, 3299, 'ALC-MD-BRN', 28, '{"size": "Medium", "color": "Brown"}'),
((SELECT id FROM products WHERE slug = 'adjustable-leather-collar'), 'Large Tan', 3099, 3599, 'ALC-LG-TAN', 19, '{"size": "Large", "color": "Tan"}'),

-- Retractable Leash variants
((SELECT id FROM products WHERE slug = 'retractable-dog-leash'), 'Small Blue', 1999, 2399, 'RDL-SM-BLU', 78, '{"size": "Small", "color": "Blue"}'),
((SELECT id FROM products WHERE slug = 'retractable-dog-leash'), 'Medium Red', 2299, 2699, 'RDL-MD-RED', 65, '{"size": "Medium", "color": "Red"}'),
((SELECT id FROM products WHERE slug = 'retractable-dog-leash'), 'Large Black', 2599, 2999, 'RDL-LG-BLK', 43, '{"size": "Large", "color": "Black"}');

-- Insert Reviews
INSERT INTO reviews (product_id, user_id, rating, title, content, is_approved, created_at) VALUES
-- Premium Chicken & Rice reviews
((SELECT id FROM products WHERE slug = 'premium-chicken-rice-dog-food'), (SELECT id FROM auth.users LIMIT 1), 5, 'My dog loves it!', 'Switched to this food 3 months ago and my golden retriever absolutely loves it. His coat is shinier and he has more energy.', true, now() - interval '2 weeks'),
((SELECT id FROM products WHERE slug = 'premium-chicken-rice-dog-food'), (SELECT id FROM auth.users LIMIT 1), 4, 'Good quality food', 'High quality ingredients and my dog digests it well. Only complaint is the price, but you get what you pay for.', true, now() - interval '1 month'),

-- Grain-Free Salmon reviews
((SELECT id FROM products WHERE slug = 'grain-free-salmon-cat-food'), (SELECT id FROM auth.users LIMIT 1), 5, 'Perfect for my sensitive cat', 'My cat has food allergies and this is the only food that doesn\'t upset her stomach. She actually finishes her bowl now!', true, now() - interval '3 weeks'),
((SELECT id FROM products WHERE slug = 'grain-free-salmon-cat-food'), (SELECT id FROM auth.users LIMIT 1), 4, 'Great ingredients', 'Love that it\'s grain-free with real salmon. My cats are picky but they eat this without any issues.', true, now() - interval '5 days'),

-- Interactive Puzzle Ball reviews
((SELECT id FROM products WHERE slug = 'interactive-puzzle-ball'), (SELECT id FROM auth.users LIMIT 1), 5, 'Keeps my dog busy for hours', 'This puzzle ball is amazing! My border collie is super smart and gets bored easily, but this keeps him entertained for hours.', true, now() - interval '1 week'),
((SELECT id FROM products WHERE slug = 'interactive-puzzle-ball'), (SELECT id FROM auth.users LIMIT 1), 4, 'Durable and fun', 'Well-made toy that has survived my German Shepherd\'s aggressive play style. The treat dispensing feature is genius.', true, now() - interval '10 days'),

-- Rope Tug Toy reviews
((SELECT id FROM products WHERE slug = 'rope-tug-toy'), (SELECT id FROM auth.users LIMIT 1), 4, 'Classic tug toy', 'Simple but effective. My dog loves playing tug with this and it\'s holding up well after 2 months of daily use.', true, now() - interval '6 days'),

-- Leather Collar reviews
((SELECT id FROM products WHERE slug = 'adjustable-leather-collar'), (SELECT id FROM auth.users LIMIT 1), 5, 'Beautiful craftsmanship', 'This collar is gorgeous and well-made. The leather is soft but durable, and the brass hardware looks premium.', true, now() - interval '2 weeks'),
((SELECT id FROM products WHERE slug = 'adjustable-leather-collar'), (SELECT id FROM auth.users LIMIT 1), 4, 'Great fit and comfort', 'My dog seems comfortable wearing this collar. The adjustability is perfect and it looks great on him.', true, now() - interval '4 days'),

-- Retractable Leash reviews
((SELECT id FROM products WHERE slug = 'retractable-dog-leash'), (SELECT id FROM auth.users LIMIT 1), 3, 'Works but could be better', 'The leash works fine but the brake button is a bit stiff. Otherwise it gives my dog good freedom to explore.', true, now() - interval '1 week');

-- Insert Product Questions & Answers
INSERT INTO product_questions (product_id, user_id, question, is_approved, created_at) VALUES
-- Food questions
((SELECT id FROM products WHERE slug = 'premium-chicken-rice-dog-food'), (SELECT id FROM auth.users LIMIT 1), 'Is this suitable for puppies or just adult dogs?', true, now() - interval '5 days'),
((SELECT id FROM products WHERE slug = 'grain-free-salmon-cat-food'), (SELECT id FROM auth.users LIMIT 1), 'Does this food contain any artificial preservatives?', true, now() - interval '1 week'),

-- Toy questions
((SELECT id FROM products WHERE slug = 'interactive-puzzle-ball'), (SELECT id FROM auth.users LIMIT 1), 'What size treats fit in this puzzle ball?', true, now() - interval '3 days'),
((SELECT id FROM products WHERE slug = 'rope-tug-toy'), (SELECT id FROM auth.users LIMIT 1), 'Is this safe for teething puppies?', true, now() - interval '6 days'),

-- Accessory questions
((SELECT id FROM products WHERE slug = 'adjustable-leather-collar'), (SELECT id FROM auth.users LIMIT 1), 'How do I measure my dog for the right size?', true, now() - interval '2 days'),
((SELECT id FROM products WHERE slug = 'retractable-dog-leash'), (SELECT id FROM auth.users LIMIT 1), 'What is the maximum weight this leash can handle?', true, now() - interval '4 days');

-- Insert Answers
INSERT INTO product_answers (question_id, user_id, answer, is_staff_reply, created_at) VALUES
((SELECT id FROM product_questions WHERE question LIKE '%puppies%' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'This formula is specifically designed for adult dogs. For puppies, we recommend our Puppy Growth Formula which has the right nutrient balance for growing dogs.', true, now() - interval '4 days'),
((SELECT id FROM product_questions WHERE question LIKE '%preservatives%' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'No, this food is free from artificial preservatives. We use natural preservatives like mixed tocopherols (vitamin E) to maintain freshness.', true, now() - interval '6 days'),
((SELECT id FROM product_questions WHERE question LIKE '%treats fit%' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'The puzzle ball works with most standard training treats up to 1/2 inch in size. Small kibble pieces also work great!', true, now() - interval '2 days'),
((SELECT id FROM product_questions WHERE question LIKE '%teething%' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'Yes, the natural cotton rope is safe for teething puppies and actually helps massage their gums. Just supervise play and replace if it becomes too frayed.', true, now() - interval '5 days'),
((SELECT id FROM product_questions WHERE question LIKE '%measure%' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'Measure around your dog\'s neck where the collar will sit, then add 2 inches for comfort. You should be able to fit 2 fingers under the collar when properly fitted.', true, now() - interval '1 day'),
((SELECT id FROM product_questions WHERE question LIKE '%maximum weight%' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'The weight limits are: Small (up to 26lbs), Medium (up to 44lbs), Large (up to 88lbs). Choose based on your dog\'s weight for safety.', true, now() - interval '3 days');
