# Fur & Co Technical Architecture

## Frontend Stack
- **Framework**: React 18.3.1 with Vite 6.0.3
- **Routing**: React Router DOM v7.9.6
- **Styling**: Tailwind CSS 3.4.15 + CSS Custom Properties
- **UI Components**: Radix UI primitives + Shadcn/ui
- **Animations**: Framer Motion 12.23.25
- **Icons**: Lucide React 0.460.0
- **State Management**: React Context API

## Backend & Data
- **Backend Framework**: Fastify 5.x with TypeScript
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma 7.x
- **Authentication**: Supabase Auth with JWT + Google OAuth
- **API Layer**: RESTful API with consolidated endpoints
- **Validation**: Zod schemas
- **Real-time**: WebSocket support via @fastify/websocket

## Key Context Providers
1. **ThemeProvider** - Manages tri-state ecosystem
2. **AuthProvider** - User authentication and session management
3. **CartProvider** - Shopping cart functionality  
4. **WishlistProvider** - Shopping wishlist functionality
5. **UnlimitedFurProvider** - Subscription system state

## Database Schema
- `products` - Product catalog with categories, pricing, images
- `product_variants` - Product variations (size, color, etc.)
- `categories` - Product categorization
- `orders` - Order management with items and shipments
- `profiles` - User profiles extended with referral codes
- `addresses` - User shipping addresses
- `cart_items` - Shopping cart persistence
- `wishlist_items` - Wishlist management
- `blogs` - Content management system
- `reviews` - Product reviews with ratings
- `product_questions` / `product_answers` - Q&A system
- `monthly_plans` - Unlimited Fur subscription plans
- `referrals` - Referral program tracking
- `user_activity_logs` - User behavior analytics

## Build & Deployment
- **Build Tool**: Vite with React plugin
- **Deployment**: GitHub Pages via gh-pages
- **Base Path**: `/WebApp` (configured in router)
- **Environment**: Vite environment variables

## File Structure

### Frontend (apps/webapp)
```
src/
├── components/
│   ├── common/      # Shared components (Navbar, Footer)
│   ├── home/        # Home page specific components
│   ├── blog/        # Blog components
│   ├── product/     # Product-related components
│   ├── ui/          # Shadcn/ui components
│   └── [feature]/  # Feature-specific components
├── context/         # React Context providers
├── pages/           # Route components
│   └── unlimited-fur/ # Subscription system pages
├── services/        # API and external services
├── lib/            # Utilities and configurations
└── layouts/        # Layout components
```

### Backend (apps/backend)
```
src/
├── modules/         # 15 feature modules
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── unlimited-fur/
│   └── ...
├── shared/          # Shared utilities, middleware, types
├── config/          # Configuration management
└── server.ts        # Application entry point
```

## Consolidated API Endpoints
Backend uses "one-page" approach for optimal performance:
- `GET /api/home` - All homepage data (hero, products, categories, blogs)
- `GET /api/products/explore` - Products with filters, categories, pagination
- `GET /api/products/:slug/full` - Complete details with variants, reviews, Q&A
- `GET /api/cart/summary` - Cart totals, stock warnings, recommendations

## TODO: Document API endpoints and data flow
## TODO: Add performance optimization notes
## TODO: Document testing strategy (currently no tests)
