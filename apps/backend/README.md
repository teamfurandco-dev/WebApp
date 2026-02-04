# Fur & Co Backend

Production-ready backend API built with Fastify, Prisma, Zod, and PostgreSQL.

## Architecture

```
backend/
├── src/
│   ├── modules/          # Feature modules (products, orders, users, etc.)
│   ├── shared/           # Shared utilities, middleware, types
│   ├── config/           # Configuration management
│   └── server.ts         # Application entry point
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## Tech Stack

- **Framework**: Fastify 5.x
- **Database**: PostgreSQL (Supabase-hosted)
- **ORM**: Prisma 7.x
- **Validation**: Zod
- **Authentication**: Supabase JWT
- **Real-time**: WebSockets (@fastify/websocket)
- **Language**: TypeScript (strict mode)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase project with existing database

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

**Required variables:**
- `DATABASE_URL`: Get from Supabase Dashboard → Settings → Database → Connection String (Session mode, port 5432)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Public anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (keep secret!)

### 3. Introspect Database Schema

```bash
npm run prisma:pull
npm run prisma:generate
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:pull` - Introspect database schema
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema changes to database

## API Endpoints

### System
- `GET /health` - Server health status
- `GET /docs` - Swagger API documentation

### Home (Consolidated)
- `GET /api/home` -Get all home page data (hero, featured products, categories, blogs)

### Products  
- `GET /api/products` - List products with filters
- `GET /api/products/explore` - Products with categories and pagination (consolidated)
- `GET /api/products/:slug` - Get product details
- `GET /api/products/:slug/full` - Complete product details (variants, reviews, Q&A, related)
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details

### Cart
- `GET /api/cart` - Get user's cart
- `GET /api/cart/summary` - Cart with totals, stock warnings, recommendations (consolidated)
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart` - Update cart item
- `DELETE /api/cart` - Remove from cart

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist` - Remove from wishlist
- `GET /api/wishlist/check/:productId` - Check if in wishlist

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `POST /api/orders/:id/cancel` - Cancel order
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Users
- `GET /api/users/me` - Get user profile
- `PATCH /api/users/me` - Update profile
- `GET /api/users/me/stats` - User statistics

### Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add address
- `PATCH /api/addresses` - Update address
- `DELETE /api/addresses` - Delete address
- `GET /api/addresses/default` - Get default address
- `POST /api/addresses/:id/default` - Set as default

### Reviews
- `GET /api/reviews` - List reviews
- `GET /api/products/:id/reviews` - Product reviews
- `POST /api/reviews` - Create review
- `POST /api/reviews/:id/helpful` - Mark review helpful

### Questions & Answers
- `GET /api/questions` - List product questions
- `POST /api/questions` - Ask question  
- `POST /api/questions/:id/answers` - Answer question

### Blogs
- `GET /api/blogs` - List blog posts
- `GET /api/blogs/:slug` - Get blog post
- `POST /api/blogs` - Create blog (admin)
- `PATCH /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)

### Inventory (Admin)
- `GET /api/inventory` - List inventory
- `PATCH /api/inventory/:id` - Update stock levels

### Uploads
- `POST /api/uploads/products/:id` - Upload product image
- `POST /api/uploads/blogs/:id` - Upload blog image
- `DELETE /api/uploads/:bucket/:path` - Delete file

### Unlimited Fur (Subscription System)
- `GET /api/unlimited-fur/budget-options` - Budget tier options
- `POST /api/unlimited-fur/draft/budget` - Save draft budget
- `GET /api/unlimited-fur/monthly-plan` - Get monthly plan
- `POST /api/unlimited-fur/monthly-plan` - Create monthly plan
- `PUT /api/unlimited-fur/monthly-plan/:id` - Update plan
- More endpoints for bundle system, pet profiles, category selection, shopping

## Development

### Module Structure

Each feature module follows this structure:

```
modules/[feature]/
├── schema.ts    # Zod validation schemas
├── service.ts   # Business logic
├── routes.ts    # Route handlers
└── types.ts     # TypeScript types (optional)
```

### Adding a New Module

1. Create folder in `src/modules/[feature]`
2. Define Zod schemas in `schema.ts`
3. Implement business logic in `service.ts`
4. Create route handlers in `routes.ts`
5. Register routes in `server.ts`

## Security

- JWT token validation on protected routes
- Rate limiting on authentication endpoints
- CORS configured for frontend origin only
- Helmet security headers
- Input validation with Zod on all endpoints

## Production Status

✅ **Fully Implemented:**
- Monorepo structure & backend foundation
- Prisma ORM with Supabase PostgreSQL
- 15 feature modules (products, cart, orders, users, blogs, etc.)
- Consolidated endpoints for optimal performance
- Real-time features via WebSocket
- Admin inventory management
- Unlimited Fur subscription system

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint specifications.
