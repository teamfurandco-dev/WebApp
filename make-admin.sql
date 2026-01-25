-- Make a user admin by email
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your-email@gmail.com';

-- Or create an admin user directly (if they don't exist)
INSERT INTO "User" (id, email, name, role, "supabaseId")
VALUES (
  gen_random_uuid(),
  'admin@furco.com',
  'Admin User',
  'ADMIN',
  NULL  -- Will be set when they first log in
);
