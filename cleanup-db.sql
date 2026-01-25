-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Any other tables that might exist
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
