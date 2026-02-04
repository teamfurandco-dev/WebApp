# Fur & Co - Monorepo

A modern monorepo for Fur & Co e-commerce platform using pnpm workspaces and Turborepo.

## 🏗️ Project Structure

```
/Fur&Co
├── apps/
│   ├── webapp/          # Customer-facing website (Vite + React)
│   ├── admin/           # Admin dashboard (Vite + React)
│   └── backend/         # API server (Fastify + Prisma)
├── packages/
│   ├── ui/              # Shared UI components
│   ├── utils/           # Shared utilities
│   ├── types/           # Shared TypeScript types
│   └── config/          # Shared configurations
├── scripts/             # Database & build scripts
├── database/            # SQL files & migrations
└── docs/                # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Install pnpm globally if not already installed
npm install -g pnpm

# Install dependencies
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter webapp dev
pnpm --filter admin dev
pnpm --filter backend dev
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter webapp build
```

### Deployment

```bash
# Deploy webapp to GitHub Pages
pnpm deploy
```

## 📦 Packages

### @fur-co/ui
Shared UI components built with Radix UI and Tailwind CSS.

### @fur-co/utils
Common utility functions used across applications.

### @fur-co/types
Shared TypeScript types and interfaces.

### @fur-co/config
Shared configuration files (Tailwind, PostCSS, TypeScript).

## 🔧 Workspace Commands

```bash
# Add dependency to specific app
pnpm --filter webapp add <package>

# Add dependency to all apps
pnpm add <package> -w

# Run script in specific app
pnpm --filter webapp <script-name>
```

## 📝 Environment Variables

Each app has its own `.env` file:
- `apps/webapp/.env`
- `apps/admin/.env`
- `apps/backend/.env`

Copy `.env.example` files and configure as needed.

## 🎨 Key Features

### Tri-State Ecosystem
The webapp features a unique "Tri-State  Ecosystem" that adapts the user experience:

1. **GATEWAY (Default)** - Neutral, minimal theme for standard shopping
2. **CORE (Unlimited)** - High-contrast, commercial theme at `/unlimited` for subscription plans
3. **ORIGIN (Niche)** - Organic, artisanal theme at `/niche` for curated products

### Unlimited Fur Subscription System
A comprehensive subscription management system allowing customers to:
- Create monthly subscription plans with custom budgets
- Build one-time pet care bundles
- Select personalized products based on pet profiles
- Manage recurring deliveries and billing

### Consolidated API Architecture
Backend implements "one-page" consolidated endpoints for optimal performance:
- `/api/home` - All homepage data in single call
- `/api/products/explore` - Products with filters, categories, pagination
- `/api/products/:slug/full` - Complete product details with variants, reviews, Q&A
- `/api/cart/summary` - Cart totals, stock warnings, recommendations

## 🔧 Tech Stack

- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: Fastify + Prisma + PostgreSQL (Supabase)
- **Authentication**: Supabase Auth with JWT
- **Storage**: Supabase Storage for media files
- **Real-time**: WebSocket support
- **Validation**: Zod schemas
- **API Docs**: Swagger/OpenAPI

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test locally with `pnpm dev`
4. Build to ensure no errors: `pnpm build`
5. Submit a pull request

## 📄 License

Private - All rights reserved
