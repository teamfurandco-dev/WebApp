-- Realistic Product Data for Fur & Co Production
-- Based on Supertails-style product catalog with proper variants and categories

-- First, ensure we have proper categories
INSERT INTO categories (name, description) VALUES
('Dog Food', 'Premium nutrition for dogs of all ages and sizes'),
('Cat Food', 'Complete nutrition for cats and kittens'),
('Dog Treats', 'Healthy and delicious treats for training and rewards'),
('Cat Treats', 'Irresistible treats for feline friends'),
('Dog Toys', 'Interactive and engaging toys for dogs'),
('Cat Toys', 'Fun and stimulating toys for cats'),
('Dog Accessories', 'Essential accessories for dog care and comfort'),
('Cat Accessories', 'Must-have accessories for cat owners'),
('Health & Wellness', 'Healthcare products and supplements'),
('Grooming', 'Professional grooming supplies and tools')
ON CONFLICT (name) DO NOTHING;

-- Clear existing products to start fresh
DELETE FROM product_variants;
DELETE FROM reviews;
DELETE FROM product_questions;
DELETE FROM product_answers;
DELETE FROM products;

-- Insert realistic products with proper variants and detailed information
INSERT INTO products (name, slug, description, base_price_cents, compare_at_price_cents, images, category_id, attributes, is_active, is_featured, average_rating, reviews_count) VALUES

-- DOG FOOD PRODUCTS
('Royal Canin Maxi Adult Dry Dog Food', 'royal-canin-maxi-adult', 'Complete and balanced nutrition for large breed adult dogs (26-44kg) aged 15 months to 5 years. Enriched with EPA, DHA and borage oil to support healthy skin and coat. Contains glucosamine and chondroitin to support healthy bones and joints.', 
189900, 219900, 
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500'], 
(SELECT id FROM categories WHERE name = 'Dog Food'), 
'{"variants": [{"type": "size", "options": ["4kg", "10kg", "15kg"]}], "nutritional_info": [{"nutrient": "Crude Protein", "amount": "26.0% min"}, {"nutrient": "Crude Fat", "amount": "17.0% min"}, {"nutrient": "Crude Fiber", "amount": "2.2% max"}, {"nutrient": "Moisture", "amount": "9.5% max"}], "ingredients": ["Chicken by-product meal", "Brown rice", "Oat groats", "Chicken fat", "Natural flavors", "Dried plain beet pulp"], "usage_instructions": "Feed 2-3 times daily. Transition gradually over 7 days. Always provide fresh water.", "safety_notes": ["Store in cool, dry place", "Keep sealed after opening", "Use within 6 weeks of opening"], "suitable_for": ["Large breed adult dogs", "Dogs 15 months to 5 years", "Active dogs", "Dogs needing joint support"]}', 
true, true, 4.6, 234),

('Pedigree Adult Complete Nutrition', 'pedigree-adult-complete', 'Complete nutrition for adult dogs with real chicken, vegetables and wholesome grains. Fortified with vitamins and minerals. No artificial colors or preservatives. Supports healthy digestion with natural fiber.', 
79900, 99900, 
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'], 
(SELECT id FROM categories WHERE name = 'Dog Food'), 
'{"variants": [{"type": "size", "options": ["1.2kg", "3kg", "10kg", "20kg"]}], "nutritional_info": [{"nutrient": "Crude Protein", "amount": "18.0% min"}, {"nutrient": "Crude Fat", "amount": "8.0% min"}, {"nutrient": "Crude Fiber", "amount": "4.0% max"}, {"nutrient": "Moisture", "amount": "12.0% max"}], "ingredients": ["Chicken", "Rice", "Wheat", "Corn", "Chicken by-product meal", "Soybean meal"], "usage_instructions": "Feed according to feeding guide based on dog weight and activity level.", "safety_notes": ["Store in original packaging", "Keep in cool, dry place", "Reseal after use"], "suitable_for": ["Adult dogs 1+ years", "All breed sizes", "Everyday nutrition"]}', 
true, false, 4.2, 156),

('Farmina N&D Grain Free Chicken & Pomegranate', 'farmina-nd-grain-free-chicken', 'Premium grain-free recipe with 70% animal ingredients. Made with fresh boneless chicken, dehydrated chicken, sweet potatoes and pomegranate. Rich in vitamins and antioxidants for optimal health.', 
349900, 399900, 
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'], 
(SELECT id FROM categories WHERE name = 'Dog Food'), 
'{"variants": [{"type": "size", "options": ["800g", "2.5kg", "7kg", "12kg"]}, {"type": "life_stage", "options": ["Puppy", "Adult", "Senior"]}], "nutritional_info": [{"nutrient": "Crude Protein", "amount": "33.0% min"}, {"nutrient": "Crude Fat", "amount": "18.0% min"}, {"nutrient": "Crude Fiber", "amount": "2.9% max"}, {"nutrient": "Moisture", "amount": "9.0% max"}], "ingredients": ["Fresh boneless chicken", "Dehydrated chicken", "Sweet potatoes", "Chicken fat", "Pomegranate", "Spinach"], "usage_instructions": "Transition gradually over 7-10 days. Feed 2-3 times daily based on weight chart.", "safety_notes": ["GMO-free ingredients", "No artificial preservatives", "Store below 25°C"], "suitable_for": ["All life stages", "Grain-sensitive dogs", "Active dogs", "Premium nutrition seekers"]}', 
true, true, 4.8, 89),

-- CAT FOOD PRODUCTS
('Whiskas Adult Dry Cat Food Ocean Fish', 'whiskas-adult-ocean-fish', 'Complete and balanced nutrition for adult cats with real ocean fish. Enriched with vitamin A for healthy vision and taurine for healthy heart. Crunchy kibble helps reduce tartar buildup.', 
149900, 179900, 
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'], 
(SELECT id FROM categories WHERE name = 'Cat Food'), 
'{"variants": [{"type": "size", "options": ["480g", "1.2kg", "3kg", "7kg"]}, {"type": "flavor", "options": ["Ocean Fish", "Chicken", "Tuna"]}], "nutritional_info": [{"nutrient": "Crude Protein", "amount": "30.0% min"}, {"nutrient": "Crude Fat", "amount": "9.0% min"}, {"nutrient": "Crude Fiber", "amount": "4.5% max"}, {"nutrient": "Moisture", "amount": "12.0% max"}], "ingredients": ["Ocean fish", "Rice", "Wheat", "Corn", "Chicken by-product meal", "Fish oil"], "usage_instructions": "Feed 2-3 times daily. Adjust portions based on cat age, weight and activity.", "safety_notes": ["Keep in sealed container", "Store in cool, dry place", "Always provide fresh water"], "suitable_for": ["Adult cats 1+ years", "Indoor and outdoor cats", "Daily nutrition"]}', 
true, false, 4.3, 178),

('Royal Canin Persian Adult Cat Food', 'royal-canin-persian-adult', 'Specially designed for Persian cats over 12 months. Exclusive almond-shaped kibble adapted to Persian jaw. Enriched with omega-3 and omega-6 fatty acids for healthy skin and coat maintenance.', 
279900, 319900, 
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'], 
(SELECT id FROM categories WHERE name = 'Cat Food'), 
'{"variants": [{"type": "size", "options": ["400g", "2kg", "4kg", "10kg"]}], "nutritional_info": [{"nutrient": "Crude Protein", "amount": "30.0% min"}, {"nutrient": "Crude Fat", "amount": "22.0% min"}, {"nutrient": "Crude Fiber", "amount": "4.4% max"}, {"nutrient": "Moisture", "amount": "5.5% max"}], "ingredients": ["Chicken by-product meal", "Rice", "Corn", "Chicken fat", "Natural flavors", "Fish oil"], "usage_instructions": "Feed according to feeding guide. Transition gradually over 7 days.", "safety_notes": ["Breed-specific nutrition", "Store in original packaging", "Keep sealed"], "suitable_for": ["Persian cats 12+ months", "Long-haired breeds", "Cats needing coat support"]}', 
true, true, 4.7, 92),

-- DOG ACCESSORIES
('Comfort Paw Orthopedic Memory Foam Bed', 'comfort-paw-orthopedic-bed', 'Premium orthopedic bed with high-density memory foam core. Provides superior joint support for senior dogs and those with arthritis. Removable, machine-washable cover with water-resistant liner.', 
249900, 299900, 
ARRAY['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'], 
(SELECT id FROM categories WHERE name = 'Dog Accessories'), 
'{"variants": [{"type": "size", "options": ["Small (60x45cm)", "Medium (75x60cm)", "Large (90x75cm)", "XL (105x90cm)"]}, {"type": "color", "options": ["Charcoal Gray", "Chocolate Brown", "Navy Blue"]}], "care_instructions": "Machine wash cover in cold water. Air dry only. Spot clean foam if needed.", "warranty": "2-year warranty on foam core", "usage_instructions": "Allow 24-48 hours for foam to fully expand. Place on flat surface away from direct sunlight.", "safety_notes": ["CertiPUR-US certified foam", "Non-toxic materials", "Hypoallergenic cover"], "suitable_for": ["Senior dogs", "Dogs with joint issues", "Post-surgery recovery", "All dog sizes"]}', 
true, true, 4.8, 156),

('Interactive Puzzle Feeder Pro', 'interactive-puzzle-feeder-pro', 'Advanced slow-feeding puzzle bowl with adjustable difficulty levels. Reduces eating speed by up to 10x, preventing bloat and improving digestion. Made from food-safe, BPA-free materials with non-slip base.', 
129900, 159900, 
ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'], 
(SELECT id FROM categories WHERE name = 'Dog Accessories'), 
'{"variants": [{"type": "size", "options": ["Small (1 cup)", "Medium (2 cups)", "Large (3 cups)"]}, {"type": "color", "options": ["Ocean Blue", "Forest Green", "Sunset Orange", "Arctic White"]}], "care_instructions": "Dishwasher safe (top rack). Hand wash with warm soapy water.", "usage_instructions": "Start with easiest setting. Gradually increase difficulty as dog learns. Supervise initial uses.", "safety_notes": ["BPA-free materials", "Non-slip rubber base", "Rounded edges for safety"], "suitable_for": ["Fast eaters", "Dogs needing mental stimulation", "Preventing bloat", "All breeds"]}', 
true, false, 4.5, 203),

-- DOG TOYS
('KONG Classic Dog Toy', 'kong-classic-dog-toy', 'The original KONG made from natural red rubber. Perfect for stuffing with treats to keep dogs mentally stimulated. Bounces unpredictably for exciting games of fetch. Veterinarian recommended worldwide.', 
89900, 109900, 
ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'], 
(SELECT id FROM categories WHERE name = 'Dog Toys'), 
'{"variants": [{"type": "size", "options": ["XS (up to 2kg)", "Small (7-16kg)", "Medium (16-30kg)", "Large (27-41kg)", "XL (41kg+)"]}, {"type": "color", "options": ["Classic Red", "Senior Purple", "Puppy Pink/Blue"]}], "care_instructions": "Dishwasher safe. Hand wash with warm water and mild soap.", "usage_instructions": "Stuff with treats or kibble. Supervise play. Replace when worn.", "safety_notes": ["Natural rubber", "Non-toxic", "Vet recommended", "Puncture resistant"], "suitable_for": ["All dog sizes", "Heavy chewers", "Mental stimulation", "Treat dispensing"]}', 
true, true, 4.9, 445),

-- CAT ACCESSORIES  
('Automatic Cat Water Fountain', 'automatic-cat-water-fountain', 'Ultra-quiet water fountain with triple filtration system. Encourages cats to drink more water for better kidney health. 2.4L capacity with LED water level indicator and automatic shut-off when empty.', 
199900, 249900, 
ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'], 
(SELECT id FROM categories WHERE name = 'Cat Accessories'), 
'{"variants": [{"type": "capacity", "options": ["1.6L", "2.4L", "3.2L"]}, {"type": "material", "options": ["Stainless Steel", "BPA-Free Plastic", "Ceramic"]}], "care_instructions": "Clean weekly. Replace filters monthly. Dishwasher safe (except pump).", "usage_instructions": "Fill with fresh water. Plug in and turn on. Monitor water level daily.", "safety_notes": ["Ultra-quiet pump", "LED indicators", "Auto shut-off", "Food-grade materials"], "suitable_for": ["All cats", "Multiple cat households", "Encouraging hydration", "Indoor cats"]}', 
true, false, 4.6, 187),

-- HEALTH & WELLNESS
('Himalaya Erina Plus Shampoo', 'himalaya-erina-plus-shampoo', 'Herbal shampoo with neem and eucalyptus for dogs and cats. Provides effective protection against ticks, fleas and other ectoparasites. Gentle formula suitable for regular use with natural conditioning agents.', 
34900, 42900, 
ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'], 
(SELECT id FROM categories WHERE name = 'Health & Wellness'), 
'{"variants": [{"type": "size", "options": ["150ml", "450ml"]}, {"type": "formula", "options": ["Regular", "Sensitive Skin", "Puppy/Kitten"]}], "care_instructions": "Store in cool, dry place. Keep away from direct sunlight.", "usage_instructions": "Wet coat thoroughly. Apply shampoo and work into lather. Rinse completely. Use weekly or as needed.", "safety_notes": ["Natural herbal formula", "No harsh chemicals", "Vet approved", "Safe for regular use"], "suitable_for": ["Dogs and cats", "All coat types", "Tick and flea prevention", "Sensitive skin"]}', 
true, false, 4.4, 298);

-- Insert product variants with proper pricing
INSERT INTO product_variants (product_id, sku, attributes, price_cents, stock_quantity) VALUES
-- Royal Canin Maxi Adult variants
((SELECT id FROM products WHERE slug = 'royal-canin-maxi-adult'), 'RC-MAXI-4KG', '{"size": "4kg"}', 189900, 45),
((SELECT id FROM products WHERE slug = 'royal-canin-maxi-adult'), 'RC-MAXI-10KG', '{"size": "10kg"}', 389900, 30),
((SELECT id FROM products WHERE slug = 'royal-canin-maxi-adult'), 'RC-MAXI-15KG', '{"size": "15kg"}', 549900, 20),

-- Pedigree Adult variants
((SELECT id FROM products WHERE slug = 'pedigree-adult-complete'), 'PED-ADULT-1.2KG', '{"size": "1.2kg"}', 79900, 60),
((SELECT id FROM products WHERE slug = 'pedigree-adult-complete'), 'PED-ADULT-3KG', '{"size": "3kg"}', 179900, 40),
((SELECT id FROM products WHERE slug = 'pedigree-adult-complete'), 'PED-ADULT-10KG', '{"size": "10kg"}', 499900, 25),
((SELECT id FROM products WHERE slug = 'pedigree-adult-complete'), 'PED-ADULT-20KG', '{"size": "20kg"}', 899900, 15),

-- Farmina N&D variants (size + life stage combinations)
((SELECT id FROM products WHERE slug = 'farmina-nd-grain-free-chicken'), 'FND-PUPPY-800G', '{"size": "800g", "life_stage": "Puppy"}', 349900, 35),
((SELECT id FROM products WHERE slug = 'farmina-nd-grain-free-chicken'), 'FND-ADULT-2.5KG', '{"size": "2.5kg", "life_stage": "Adult"}', 749900, 25),
((SELECT id FROM products WHERE slug = 'farmina-nd-grain-free-chicken'), 'FND-SENIOR-7KG', '{"size": "7kg", "life_stage": "Senior"}', 1899900, 15),

-- Whiskas variants (size + flavor combinations)
((SELECT id FROM products WHERE slug = 'whiskas-adult-ocean-fish'), 'WHI-OF-480G', '{"size": "480g", "flavor": "Ocean Fish"}', 149900, 50),
((SELECT id FROM products WHERE slug = 'whiskas-adult-ocean-fish'), 'WHI-CH-1.2KG', '{"size": "1.2kg", "flavor": "Chicken"}', 329900, 35),
((SELECT id FROM products WHERE slug = 'whiskas-adult-ocean-fish'), 'WHI-TU-3KG', '{"size": "3kg", "flavor": "Tuna"}', 699900, 20),

-- Comfort Paw Bed variants (size + color combinations)
((SELECT id FROM products WHERE slug = 'comfort-paw-orthopedic-bed'), 'CPB-SM-GRAY', '{"size": "Small (60x45cm)", "color": "Charcoal Gray"}', 249900, 25),
((SELECT id FROM products WHERE slug = 'comfort-paw-orthopedic-bed'), 'CPB-MD-BROWN', '{"size": "Medium (75x60cm)", "color": "Chocolate Brown"}', 299900, 20),
((SELECT id FROM products WHERE slug = 'comfort-paw-orthopedic-bed'), 'CPB-LG-NAVY', '{"size": "Large (90x75cm)", "color": "Navy Blue"}', 349900, 15),

-- KONG Classic variants
((SELECT id FROM products WHERE slug = 'kong-classic-dog-toy'), 'KONG-XS-RED', '{"size": "XS (up to 2kg)", "color": "Classic Red"}', 89900, 40),
((SELECT id FROM products WHERE slug = 'kong-classic-dog-toy'), 'KONG-SM-RED', '{"size": "Small (7-16kg)", "color": "Classic Red"}', 109900, 35),
((SELECT id FROM products WHERE slug = 'kong-classic-dog-toy'), 'KONG-MD-RED', '{"size": "Medium (16-30kg)", "color": "Classic Red"}', 129900, 30),
((SELECT id FROM products WHERE slug = 'kong-classic-dog-toy'), 'KONG-LG-PUR', '{"size": "Large (27-41kg)", "color": "Senior Purple"}', 149900, 25);

-- Insert realistic reviews
INSERT INTO reviews (product_id, user_id, rating, comment, images, helpful_votes, is_approved, created_at) VALUES
-- Royal Canin reviews
((SELECT id FROM products WHERE slug = 'royal-canin-maxi-adult'), (SELECT id FROM auth.users LIMIT 1), 5, 'Excellent food for my German Shepherd! His coat is shinier and he has more energy. The 10kg bag lasts about 6 weeks. Worth the premium price.', ARRAY['https://images.unsplash.com/photo-1552053831-71594a27632d?w=300'], 18, true, NOW() - INTERVAL '3 days'),
((SELECT id FROM products WHERE slug = 'royal-canin-maxi-adult'), (SELECT id FROM auth.users LIMIT 1), 4, 'Good quality food but quite expensive. My Labrador loves it and his digestion has improved significantly since switching.', NULL, 12, true, NOW() - INTERVAL '1 week'),
((SELECT id FROM products WHERE slug = 'royal-canin-maxi-adult'), (SELECT id FROM auth.users LIMIT 1), 5, 'Vet recommended this for my Golden Retriever with joint issues. Noticed improvement in mobility within 3 weeks. Highly recommend!', NULL, 25, true, NOW() - INTERVAL '2 weeks'),

-- KONG toy reviews
((SELECT id FROM products WHERE slug = 'kong-classic-dog-toy'), (SELECT id FROM auth.users LIMIT 1), 5, 'Indestructible! My pit bull has been chewing this for 6 months and it still looks new. Stuff it with peanut butter and he is busy for hours.', ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300'], 32, true, NOW() - INTERVAL '4 days'),
((SELECT id FROM products WHERE slug = 'kong-classic-dog-toy'), (SELECT id FROM auth.users LIMIT 1), 4, 'Great toy for mental stimulation. My Border Collie loves the challenge of getting treats out. Size medium is perfect for 25kg dog.', NULL, 15, true, NOW() - INTERVAL '1 week'),

-- Comfort Paw Bed reviews
((SELECT id FROM products WHERE slug = 'comfort-paw-orthopedic-bed'), (SELECT id FROM auth.users LIMIT 1), 5, 'Amazing bed! My 12-year-old Labrador with hip dysplasia sleeps so much better now. The memory foam really makes a difference.', ARRAY['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300'], 28, true, NOW() - INTERVAL '5 days'),
((SELECT id FROM products WHERE slug = 'comfort-paw-orthopedic-bed'), (SELECT id FROM auth.users LIMIT 1), 4, 'Very comfortable bed. My dog took to it immediately. Cover is easy to remove and wash. Only wish it came in more colors.', NULL, 11, true, NOW() - INTERVAL '10 days');

-- Insert product questions and answers
INSERT INTO product_questions (product_id, user_id, question, is_approved, created_at) VALUES
-- Royal Canin questions
((SELECT id FROM products WHERE slug = 'royal-canin-maxi-adult'), (SELECT id FROM auth.users LIMIT 1), 'Is this suitable for German Shepherds with sensitive stomachs?', true, NOW() - INTERVAL '2 days'),
((SELECT id FROM products WHERE slug = 'royal-canin-maxi-adult'), (SELECT id FROM auth.users LIMIT 1), 'What is the feeding amount for a 35kg active dog?', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM products WHERE slug = 'royal-canin-maxi-adult'), (SELECT id FROM auth.users LIMIT 1), 'Does this help with joint health for older dogs?', true, NOW() - INTERVAL '1 week'),

-- KONG questions
((SELECT id FROM products WHERE slug = 'kong-classic-dog-toy'), (SELECT id FROM auth.users LIMIT 1), 'Which size should I get for a 20kg Labrador?', true, NOW() - INTERVAL '3 days'),
((SELECT id FROM products WHERE slug = 'kong-classic-dog-toy'), (SELECT id FROM auth.users LIMIT 1), 'Is this safe for aggressive chewers?', true, NOW() - INTERVAL '6 days'),

-- Comfort Paw Bed questions
((SELECT id FROM products WHERE slug = 'comfort-paw-orthopedic-bed'), (SELECT id FROM auth.users LIMIT 1), 'How thick is the memory foam layer?', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM products WHERE slug = 'comfort-paw-orthopedic-bed'), (SELECT id FROM auth.users LIMIT 1), 'Can this be used outdoors on a covered patio?', true, NOW() - INTERVAL '1 week');

-- Insert answers to questions
INSERT INTO product_answers (question_id, user_id, answer, is_staff_reply, is_approved, created_at) VALUES
-- Royal Canin answers
((SELECT id FROM product_questions WHERE question LIKE '%sensitive stomachs%' LIMIT 1), NULL, 'Yes, this formula is designed to be highly digestible and is suitable for dogs with sensitive stomachs. The prebiotics help support healthy digestion. However, we recommend consulting your vet before switching if your dog has known digestive issues.', true, true, NOW() - INTERVAL '1 day'),

((SELECT id FROM product_questions WHERE question LIKE '%35kg active dog%' LIMIT 1), NULL, 'For a 35kg active dog, we recommend 390-450g per day, divided into 2-3 meals. Please refer to the feeding guide on the package and adjust based on your dog body condition and activity level.', true, true, NOW() - INTERVAL '4 days'),

((SELECT id FROM product_questions WHERE question LIKE '%joint health%' LIMIT 1), NULL, 'Yes! This formula contains glucosamine and chondroitin which help support joint health. It is specifically formulated for large breed dogs who are more prone to joint issues. Many customers report improved mobility in their senior dogs.', true, true, NOW() - INTERVAL '6 days'),

-- KONG answers
((SELECT id FROM product_questions WHERE question LIKE '%20kg Labrador%' LIMIT 1), NULL, 'For a 20kg Labrador, we recommend the Medium size KONG (16-30kg range). This size is perfect for most Labs and provides the right challenge level for treat stuffing.', true, true, NOW() - INTERVAL '2 days'),

((SELECT id FROM product_questions WHERE question LIKE '%aggressive chewers%' LIMIT 1), NULL, 'Absolutely! KONG Classic is made from our toughest natural rubber compound and is designed specifically for power chewers. It is virtually indestructible and vet-recommended worldwide. Perfect for aggressive chewers.', true, true, NOW() - INTERVAL '5 days'),

-- Comfort Paw Bed answers
((SELECT id FROM product_questions WHERE question LIKE '%memory foam layer%' LIMIT 1), NULL, 'The memory foam core is 7.5cm (3 inches) thick with high-density support. It is CertiPUR-US certified and provides excellent pressure relief for joints. The foam is designed to contour to your dog body shape.', true, true, NOW() - INTERVAL '3 days'),

((SELECT id FROM product_questions WHERE question LIKE '%outdoors%' LIMIT 1), NULL, 'While the bed can be used on a covered patio, it is designed primarily for indoor use. The memory foam and cover are not weather-resistant. If used outdoors, ensure it stays completely dry and bring inside during rain or high humidity.', true, true, NOW() - INTERVAL '6 days');

-- Update category product counts
UPDATE categories SET product_count = (
    SELECT COUNT(*) FROM products WHERE category_id = categories.id AND is_active = true
);
