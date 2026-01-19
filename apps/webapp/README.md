# Webapp - Customer-Facing Website

The main customer-facing e-commerce website for Fur & Co.

## Features

- Product browsing and search
- Shopping cart and checkout
- User authentication and profiles
- Wishlist functionality
- Tri-State Ecosystem (Gateway/Core/Origin themes)
- Blog and content pages

## Development

```bash
# From root
pnpm --filter webapp dev

# Or from this directory
pnpm dev
```

## Building

```bash
pnpm build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

## Deployment

Deployed to GitHub Pages via:

```bash
# From root
pnpm deploy
```
