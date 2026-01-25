-- Load comprehensive dummy data for Fur & Co

-- First, let's add more products with proper variants and attributes
INSERT INTO products (name, slug, description, base_price_cents, compare_at_price_cents, images, category_id, attributes, is_active, is_featured, average_rating, reviews_count) VALUES
('Wholesome Kibble Premium Adult', 'wholesome-kibble-premium', 'Premium dry dog food made with real chicken and wholesome grains. Specially formulated for adult dogs with high-quality proteins and essential nutrients that support muscle maintenance, shiny coats, and boundless energy.', 299900, 349900, 
ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'], 
(SELECT id FROM categories WHERE name = 'Dog Food'), 
'{"variants": [{"type": "size", "options": ["1.5kg", "3kg", "7kg", "12kg"]}], "nutritional_info": [{"nutrient": "Crude Protein", "amount": "26.0% min"}, {"nutrient": "Crude Fat", "amount": "15.0% min"}, {"nutrient": "Crude Fiber", "amount": "4.0% max"}, {"nutrient": "Moisture", "amount": "10.0% max"}, {"nutrient": "Omega-6 Fatty Acids", "amount": "2.5% min"}], "ingredients": ["Chicken", "Brown Rice", "Sweet Potato", "Peas", "Carrots", "Blueberries"], "usage_instructions": "Feed according to your dog weight and activity level. Transition gradually over 7-10 days by mixing with current food. Always provide fresh water.", "safety_notes": ["Store in cool, dry place", "Keep away from direct sunlight", "Use within 6 weeks of opening", "Not suitable for puppies under 12 months"], "suitable_for": ["Adult dogs (1-7 years)", "Medium to large breeds", "Active and working dogs", "Dogs with normal activity levels"]}', 
true, true, 4.5, 127),

('Comfort Paw Orthopedic Bed', 'comfort-paw-bed', 'Ultra-soft orthopedic bed designed for maximum comfort and joint support. Perfect for senior dogs and those with joint issues. Features memory foam construction and removable, machine-washable cover.', 149900, 199900, 
ARRAY['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'], 
(SELECT id FROM categories WHERE name = 'Accessories'), 
'{"variants": [{"type": "size", "options": ["Small (60x45cm)", "Medium (75x60cm)", "Large (90x75cm)", "XL (105x90cm)"]}], "usage_instructions": "Place in a quiet area away from high traffic. Machine washable cover can be removed for easy cleaning.", "safety_notes": ["Spot clean regularly", "Machine wash cover weekly", "Allow to air dry completely", "Inspect regularly for wear"], "suitable_for": ["All dog sizes", "Senior dogs", "Dogs with joint issues", "Recovery from surgery"]}', 
true, true, 4.8, 89),

('Interactive Puzzle Feeder', 'puzzle-feeder', 'Slow feeding puzzle bowl that challenges your dog mentally while preventing fast eating and bloating. Made from food-safe, non-toxic materials with anti-slip base.', 79900, 99900, 
ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'], 
(SELECT id FROM categories WHERE name = 'Toys'), 
'{"variants": [{"type": "color", "options": ["Ocean Blue", "Forest Green", "Sunset Pink", "Charcoal Gray"]}], "usage_instructions": "Fill with dry food or treats. Supervise during first few uses until your dog gets familiar. Clean after each use.", "safety_notes": ["Dishwasher safe (top rack only)", "Inspect regularly for damage", "Replace if cracks appear", "Not suitable for aggressive chewers"], "suitable_for": ["Fast eaters", "Dogs needing mental stimulation", "All dog sizes", "Indoor feeding"]}', 
true, false, 4.2, 56);

-- Add product variants to the product_variants table
INSERT INTO product_variants (product_id, sku, attributes, price_cents, stock_quantity) VALUES
-- Wholesome Kibble variants
((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), 'WK-PREM-1.5', '{"size": "1.5kg"}', 299900, 50),
((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), 'WK-PREM-3', '{"size": "3kg"}', 449900, 75),
((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), 'WK-PREM-7', '{"size": "7kg"}', 899900, 30),
((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), 'WK-PREM-12', '{"size": "12kg"}', 1299900, 20),

-- Comfort Paw Bed variants
((SELECT id FROM products WHERE slug = 'comfort-paw-bed'), 'CPB-SMALL', '{"size": "Small (60x45cm)"}', 149900, 25),
((SELECT id FROM products WHERE slug = 'comfort-paw-bed'), 'CPB-MEDIUM', '{"size": "Medium (75x60cm)"}', 179900, 30),
((SELECT id FROM products WHERE slug = 'comfort-paw-bed'), 'CPB-LARGE', '{"size": "Large (90x75cm)"}', 219900, 20),
((SELECT id FROM products WHERE slug = 'comfort-paw-bed'), 'CPB-XL', '{"size": "XL (105x90cm)"}', 259900, 15),

-- Puzzle Feeder variants
((SELECT id FROM products WHERE slug = 'puzzle-feeder'), 'PF-BLUE', '{"color": "Ocean Blue"}', 79900, 40),
((SELECT id FROM products WHERE slug = 'puzzle-feeder'), 'PF-GREEN', '{"color": "Forest Green"}', 79900, 35),
((SELECT id FROM products WHERE slug = 'puzzle-feeder'), 'PF-PINK', '{"color": "Sunset Pink"}', 79900, 30),
((SELECT id FROM products WHERE slug = 'puzzle-feeder'), 'PF-GRAY', '{"color": "Charcoal Gray"}', 79900, 25);

-- Add realistic reviews for products
INSERT INTO reviews (product_id, user_id, rating, comment, images, helpful_votes, is_approved, created_at) VALUES
-- Reviews for Wholesome Kibble
((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), (SELECT id FROM auth.users LIMIT 1), 5, 'My Golden Retriever absolutely loves this food! His coat has never been shinier and his energy levels are through the roof. The 7kg bag lasts us about 6 weeks. Highly recommend!', ARRAY['https://images.unsplash.com/photo-1552053831-71594a27632d?w=300'], 12, true, NOW() - INTERVAL '2 days'),

((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), (SELECT id FROM auth.users LIMIT 1), 4, 'Great quality food. My dog had some digestive issues with other brands but this one works perfectly. The only downside is the price, but you get what you pay for.', NULL, 8, true, NOW() - INTERVAL '1 week'),

((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), (SELECT id FROM auth.users LIMIT 1), 5, 'Vet recommended this brand and I can see why. My senior dog (10 years old) has more energy now and his joints seem better. The kibble size is perfect too.', NULL, 15, true, NOW() - INTERVAL '3 weeks'),

-- Reviews for Comfort Paw Bed
((SELECT id FROM products WHERE slug = 'comfort-paw-bed'), (SELECT id FROM auth.users LIMIT 1), 5, 'This bed is amazing! My 8-year-old Labrador with hip dysplasia sleeps so much better now. The memory foam really makes a difference. Worth every penny.', ARRAY['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300'], 20, true, NOW() - INTERVAL '5 days'),

((SELECT id FROM products WHERE slug = 'comfort-paw-bed'), (SELECT id FROM auth.users LIMIT 1), 4, 'Very comfortable bed, my dog loves it. The cover is easy to wash which is great. Only wish it came in more colors.', NULL, 6, true, NOW() - INTERVAL '2 weeks'),

-- Reviews for Puzzle Feeder
((SELECT id FROM products WHERE slug = 'puzzle-feeder'), (SELECT id FROM auth.users LIMIT 1), 4, 'Great for slowing down my fast-eating Beagle. Takes him about 15 minutes to finish his meal now instead of 30 seconds! Easy to clean too.', NULL, 9, true, NOW() - INTERVAL '1 week'),

((SELECT id FROM products WHERE slug = 'puzzle-feeder'), (SELECT id FROM auth.users LIMIT 1), 3, 'Works as advertised but my dog figured it out pretty quickly. Still slows him down a bit. Build quality is good.', NULL, 3, true, NOW() - INTERVAL '10 days');

-- Add product questions and answers
INSERT INTO product_questions (product_id, user_id, question, is_approved, created_at) VALUES
-- Questions for Wholesome Kibble
((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), (SELECT id FROM auth.users LIMIT 1), 'Is this suitable for dogs with sensitive stomachs?', true, NOW() - INTERVAL '3 days'),
((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), (SELECT id FROM auth.users LIMIT 1), 'What is the protein source in this food?', true, NOW() - INTERVAL '1 week'),
((SELECT id FROM products WHERE slug = 'wholesome-kibble-premium'), (SELECT id FROM auth.users LIMIT 1), 'How long does the 12kg bag typically last for a 30kg dog?', true, NOW() - INTERVAL '2 weeks'),

-- Questions for Comfort Paw Bed
((SELECT id FROM products WHERE slug = 'comfort-paw-bed'), (SELECT id FROM auth.users LIMIT 1), 'Is the memory foam CertiPUR-US certified?', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM products WHERE slug = 'comfort-paw-bed'), (SELECT id FROM auth.users LIMIT 1), 'Can this bed be used outdoors?', true, NOW() - INTERVAL '1 week'),

-- Questions for Puzzle Feeder
((SELECT id FROM products WHERE slug = 'puzzle-feeder'), (SELECT id FROM auth.users LIMIT 1), 'Is this dishwasher safe?', true, NOW() - INTERVAL '2 days'),
((SELECT id FROM products WHERE slug = 'puzzle-feeder'), (SELECT id FROM auth.users LIMIT 1), 'What is the maximum amount of food this can hold?', true, NOW() - INTERVAL '5 days');

-- Add answers to the questions
INSERT INTO product_answers (question_id, user_id, answer, is_staff_reply, is_approved, created_at) VALUES
-- Answers for Wholesome Kibble questions
((SELECT id FROM product_questions WHERE question LIKE '%sensitive stomachs%' LIMIT 1), NULL, 'Yes, this formula is designed to be gentle on sensitive stomachs. It contains prebiotics and easily digestible ingredients. However, we always recommend consulting with your vet before switching foods if your dog has known sensitivities.', true, true, NOW() - INTERVAL '2 days'),

((SELECT id FROM product_questions WHERE question LIKE '%protein source%' LIMIT 1), NULL, 'The primary protein source is deboned chicken, which makes up the first ingredient. We also include chicken meal for concentrated protein. The food contains 26% minimum crude protein.', true, true, NOW() - INTERVAL '6 days'),

((SELECT id FROM product_questions WHERE question LIKE '%12kg bag%' LIMIT 1), NULL, 'For a 30kg active adult dog, the 12kg bag typically lasts 6-8 weeks, depending on activity level. We recommend feeding 300-400g per day for a dog of that size, but always check the feeding guide on the package.', true, true, NOW() - INTERVAL '1 week'),

-- Answers for Comfort Paw Bed questions
((SELECT id FROM product_questions WHERE question LIKE '%CertiPUR-US%' LIMIT 1), NULL, 'Yes, our memory foam is CertiPUR-US certified, meaning it is made without harmful chemicals and meets strict standards for content, emissions, and durability.', true, true, NOW() - INTERVAL '3 days'),

((SELECT id FROM product_questions WHERE question LIKE '%outdoors%' LIMIT 1), NULL, 'While the bed can be used outdoors temporarily, it is designed for indoor use. The memory foam and fabric are not weather-resistant, so we recommend keeping it in a covered, dry area if used outside.', true, true, NOW() - INTERVAL '6 days'),

-- Answers for Puzzle Feeder questions
((SELECT id FROM product_questions WHERE question LIKE '%dishwasher safe%' LIMIT 1), NULL, 'Yes, the puzzle feeder is dishwasher safe on the top rack only. We recommend using a gentle cycle and allowing it to air dry completely before use.', true, true, NOW() - INTERVAL '1 day'),

((SELECT id FROM product_questions WHERE question LIKE '%maximum amount%' LIMIT 1), NULL, 'The puzzle feeder can hold up to 2 cups (approximately 240g) of dry kibble. The design works best when filled to about 80% capacity to allow proper puzzle function.', true, true, NOW() - INTERVAL '4 days');
