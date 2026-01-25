# Backend Setup Instructions

## ⚠️ ACTION REQUIRED: Database Connection

Before proceeding, you need to update the `DATABASE_URL` in `/backend/.env`:

### Steps to get your Supabase database connection string:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/isaphgvbdyqrblwnsrmn
2. Navigate to: **Project Settings** → **Database** → **Connection String**
3. Select **URI** tab
4. Copy the connection string (it will look like):
   ```
   postgresql://postgres.isaphgvbdyqrblwnsrmn:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Update the `DATABASE_URL` in `/backend/.env`

### Alternative: Use Session Mode (recommended for Prisma)

For better compatibility with Prisma, use **Session mode** connection string:
1. In Supabase Dashboard → Database → Connection String
2. Switch to **Session mode** (port 5432 instead of 6543)
3. Copy and use that connection string

### After updating the DATABASE_URL:

Run these commands to introspect your existing database:
```bash
cd backend
npm run prisma:pull    # Introspect existing Supabase schema
npm run prisma:generate # Generate Prisma Client
```

## Current Status

✅ Task 1: Monorepo structure created
✅ Task 1: Backend foundation with Fastify initialized
✅ Task 1: Health check endpoint working (`GET /health`)
⏳ Task 2: Waiting for DATABASE_URL configuration

## Next Steps

Once DATABASE_URL is configured, I'll continue with:
- Introspecting the existing Supabase schema
- Generating Prisma Client
- Creating database utilities
- Building shared infrastructure (validation, error handling)
