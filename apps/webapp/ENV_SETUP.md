# Environment Setup Guide

## Error: Invalid supabaseUrl

If you see this error, you need to configure your Supabase credentials.

## Quick Fix

### 1. Get Your Supabase Credentials

Go to your Supabase project:
1. Visit https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long JWT token)

### 2. Update Environment File

Edit `apps/webapp/.env`:

```env
# Replace with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API (keep as is for local development)
VITE_API_URL=http://localhost:3000
```

### 3. Restart Dev Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
pnpm dev
```

## Don't Have Supabase Set Up?

If you haven't created a Supabase project yet:

1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new project
4. Wait for it to initialize (~2 minutes)
5. Follow steps above to get credentials

## Backend Environment

Also make sure your backend has Supabase configured in `apps/backend/.env`:

```env
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing Without Supabase (Temporary)

If you want to test the backend APIs without Supabase auth temporarily, you can:

1. Comment out the `authenticate` middleware in backend routes
2. Or use a mock auth context in the frontend

**Note:** This is only for testing. Production requires proper authentication.
