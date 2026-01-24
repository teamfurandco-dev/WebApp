-- Insert sample categories for pet products
INSERT INTO "categories" (id, name, slug, description, "isActive", "displayOrder", "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'Dog Food', 'dog-food', 'Premium dog food and treats', true, 1, NOW(), NOW()),
(gen_random_uuid(), 'Cat Food', 'cat-food', 'Nutritious cat food and treats', true, 2, NOW(), NOW()),
(gen_random_uuid(), 'Dog Toys', 'dog-toys', 'Fun and engaging toys for dogs', true, 3, NOW(), NOW()),
(gen_random_uuid(), 'Cat Toys', 'cat-toys', 'Interactive toys for cats', true, 4, NOW(), NOW()),
(gen_random_uuid(), 'Pet Accessories', 'pet-accessories', 'Collars, leashes, and accessories', true, 5, NOW(), NOW()),
(gen_random_uuid(), 'Pet Grooming', 'pet-grooming', 'Grooming supplies and tools', true, 6, NOW(), NOW()),
(gen_random_uuid(), 'Pet Health', 'pet-health', 'Health and wellness products', true, 7, NOW(), NOW());
