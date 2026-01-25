# Admin Dashboard

Internal admin dashboard for managing Fur & Co operations.

## Features

- Dashboard overview with key metrics
- Product management
- Order management
- User management

## Development

```bash
# From root
pnpm --filter admin dev

# Or from this directory
pnpm dev
```

The admin dashboard runs on port 3001 by default.

## Building

```bash
pnpm build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `VITE_API_URL` - Backend API URL
