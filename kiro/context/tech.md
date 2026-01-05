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
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **API Layer**: Custom API service (`/src/services/api.js`)
- **Real-time**: Supabase subscriptions (TODO: verify usage)

## Key Context Providers
1. **ThemeProvider** - Manages tri-state ecosystem
2. **AuthProvider** - User authentication and session management
3. **WishlistProvider** - Shopping wishlist functionality

## Database Schema (Inferred)
- `products` - Product catalog with categories, pricing, images
- `categories` - Product categorization
- `orders` - Order management with items and shipments
- `profiles` - User profiles with referral codes
- `addresses` - User shipping addresses
- `blog_posts` - Content management
- `product_questions` - Q&A system
- `referrals` - Referral program tracking
- `user_activity_logs` - User behavior analytics

## Build & Deployment
- **Build Tool**: Vite with React plugin
- **Deployment**: GitHub Pages via gh-pages
- **Base Path**: `/WebApp` (configured in router)
- **Environment**: Vite environment variables

## File Structure

src/
├── components/
│   ├── common/     # Shared components (Navbar, Footer)
│   ├── home/       # Home page specific components
│   ├── ui/         # Shadcn/ui components
│   └── [feature]/ # Feature-specific components
├── context/        # React Context providers
├── pages/          # Route components
├── services/       # API and external services
├── lib/           # Utilities and configurations
└── layouts/       # Layout components

## TODO: Document API endpoints and data flow
## TODO: Add performance optimization notes
## TODO: Document testing strategy (currently no tests)
