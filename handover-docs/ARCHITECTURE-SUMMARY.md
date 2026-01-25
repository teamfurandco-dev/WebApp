# Architecture Summary

## Monorepo Organization

### Turborepo + pnpm Workspaces
The project uses Turborepo for build orchestration and pnpm workspaces for dependency management. This setup provides:
- **Shared Dependencies**: Common packages are installed once and shared across apps
- **Parallel Builds**: Multiple applications can be built simultaneously
- **Incremental Builds**: Only changed packages are rebuilt
- **Task Pipelines**: Coordinated build, test, and deployment workflows

### Workspace Structure
```
/Fur&Co
├── apps/           # Applications (deployable units)
├── packages/       # Shared libraries and configurations
├── scripts/        # Database and utility scripts
├── database/       # SQL files and migrations
└── docs/          # Project documentation
```

## Application Architecture

### Three-Tier Architecture
1. **Presentation Layer**: React applications (webapp, admin)
2. **API Layer**: Fastify backend with RESTful endpoints
3. **Data Layer**: PostgreSQL database with Prisma ORM

### Application Interactions

#### Webapp (Customer Frontend)
- **Purpose**: Customer-facing e-commerce experience
- **Communication**: REST API calls to backend
- **Authentication**: Supabase Auth integration
- **State Management**: React Context for global state
- **Routing**: React Router for client-side navigation

#### Admin (Business Frontend)
- **Purpose**: Business management and content administration
- **Communication**: Same backend API with admin-specific endpoints
- **Authentication**: Role-based access control
- **Features**: Product management, order processing, content creation

#### Backend (API Server)
- **Purpose**: Business logic, data processing, and API endpoints
- **Architecture**: Modular structure with feature-based organization
- **Database**: Prisma ORM for type-safe database operations
- **Authentication**: Supabase Auth token validation

## Data Flow Patterns

### Customer Journey Flow
1. **Discovery**: Browse products via webapp → Backend API → Database
2. **Selection**: Add to cart → Local state → Backend persistence
3. **Checkout**: Order creation → Payment processing → Database storage
4. **Fulfillment**: Order management via admin → Status updates → Customer notifications

### Subscription Flow (Unlimited Fur)
1. **Setup**: Budget selection → Product curation → Subscription creation
2. **Recurring**: Automated billing → Product selection → Order generation
3. **Management**: Customer modifications → Backend processing → Database updates

## Shared Packages Architecture

### UI Package (`@fur-co/ui`)
- **Purpose**: Consistent design system across applications
- **Components**: Buttons, forms, cards, modals, and layout components
- **Styling**: Tailwind CSS with custom design tokens
- **Usage**: Imported by both webapp and admin applications

### Utils Package (`@fur-co/utils`)
- **Purpose**: Common utility functions and helpers
- **Functions**: Date formatting, string manipulation, validation helpers
- **Usage**: Shared across frontend and backend where applicable

### Types Package (`@fur-co/types`)
- **Purpose**: TypeScript type definitions for data models
- **Types**: Product, User, Order, and API response types
- **Usage**: Ensures type consistency across the entire stack

### Config Package (`@fur-co/config`)
- **Purpose**: Shared configuration files
- **Configs**: Tailwind config, PostCSS config, TypeScript config
- **Usage**: Consistent build and styling configuration

## Authentication Architecture

### Supabase Auth Integration
- **Provider**: Supabase handles user authentication and session management
- **Flow**: Email/password authentication with email verification
- **Tokens**: JWT tokens for API authentication
- **Sessions**: Persistent sessions with automatic token refresh

### Frontend Authentication
- **Context**: React Context provides authentication state
- **Guards**: Route protection for authenticated-only pages
- **Persistence**: Local storage for session persistence

### Backend Authentication
- **Middleware**: JWT token validation on protected routes
- **Authorization**: Role-based access control for admin functions
- **Security**: Token verification with Supabase public key

## Database Architecture

### PostgreSQL with Prisma
- **ORM**: Prisma provides type-safe database access
- **Migrations**: Version-controlled database schema changes
- **Relations**: Complex relationships between products, users, orders
- **Indexing**: Optimized queries with strategic database indexes

### Data Relationships
- **Products**: Variants, images, categories, and pricing
- **Users**: Profiles, addresses, orders, and subscriptions
- **Orders**: Line items, payments, and fulfillment status
- **Subscriptions**: Unlimited Fur plans with recurring billing

## File Storage Architecture

### Supabase Storage
- **Purpose**: Image and file storage for products and content
- **Organization**: Bucket-based organization with proper access controls
- **URLs**: Dynamic URL generation for secure file access
- **Upload**: Direct upload from frontend with backend validation

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Route-based code splitting for faster initial loads
- **Image Optimization**: Lazy loading and responsive images
- **Caching**: Browser caching for static assets

### Backend Optimization
- **Database Queries**: Optimized queries with proper indexing
- **API Response**: Efficient data serialization and pagination
- **Caching**: Strategic caching for frequently accessed data

## Scalability Design

### Horizontal Scaling
- **Stateless Backend**: API server can be horizontally scaled
- **Database**: PostgreSQL with read replicas for scaling reads
- **CDN**: Static assets served via CDN for global performance

### Modular Architecture
- **Feature Modules**: Backend organized by business domains
- **Microservice Ready**: Architecture supports future microservice extraction
- **API Versioning**: Structured for API evolution and backward compatibility
