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

### Health Check
- `GET /health` - Server health status

### Products (Coming soon)
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/questions` - Get product Q&A

### Orders (Coming soon)
- `GET /api/orders` - Get user orders (protected)
- `POST /api/orders` - Create new order (protected)
- `PATCH /api/orders/:id/status` - Update order status (protected)

### Users (Coming soon)
- `GET /api/profile` - Get user profile (protected)
- `PATCH /api/profile` - Update profile (protected)
- `GET /api/addresses` - Get shipping addresses (protected)

## Development

### Module Structure

Each feature module follows this structure:

```
modules/[feature]/
├── schema.ts    # Zod validation schemas
├── service.ts   # Business logic
├── routes.ts    # Route handlers
└── types.ts     # TypeScript types
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

## Status

✅ Task 1: Monorepo structure & backend foundation
⏳ Task 2: Prisma setup (waiting for DATABASE_URL)
⏳ Task 3-20: Pending

See `SETUP.md` for detailed setup instructions.
