# Fur & Co - Project Overview

## What is Fur & Co?

Fur & Co is a modern pet e-commerce platform designed to provide curated, science-backed pet essentials for dogs and cats. The platform focuses on delivering high-quality products through both traditional e-commerce and innovative subscription models.

## Business Model & Value Proposition

### Core Value Proposition
- **Curated Essentials**: Vet-approved, science-backed products for pet health and happiness
- **Budget Control**: Customers set monthly budgets and shop within their limits
- **Convenience**: Automated deliveries and subscription management
- **Quality Assurance**: Every product is carefully selected and tested

### Revenue Streams
1. **Traditional E-commerce**: One-time product purchases
2. **Unlimited Fur Subscriptions**: Monthly recurring revenue from subscription plans
3. **Bundle Discounts**: Encouraging larger basket sizes with percentage discounts

## Technology Stack Choices

### Frontend
- **React 18**: Modern UI library with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Animation library for smooth user interactions
- **React Router**: Client-side routing for single-page application

### Backend
- **Fastify**: High-performance Node.js web framework
- **Prisma**: Type-safe ORM for database operations
- **PostgreSQL**: Robust relational database for complex data relationships
- **Supabase**: Backend-as-a-Service for authentication, storage, and database hosting

### Development & Deployment
- **Turborepo**: Monorepo build system for managing multiple applications
- **pnpm**: Fast, disk space efficient package manager
- **TypeScript**: Type safety across the entire stack

## Monorepo Structure

The project is organized as a monorepo with three main applications:

### Applications (`/apps/`)
1. **webapp**: Customer-facing e-commerce website
2. **admin**: Business management dashboard
3. **backend**: API server and business logic

### Shared Packages (`/packages/`)
1. **ui**: Reusable UI components (buttons, forms, etc.)
2. **utils**: Common utility functions
3. **types**: Shared TypeScript type definitions
4. **config**: Shared configuration files (Tailwind, PostCSS, TypeScript)

## Key Features Built

### Customer Experience
- **Product Browsing**: Category-based product discovery with filtering
- **Shopping Cart**: Add/remove products with quantity management
- **Wishlist**: Save products for later purchase
- **User Authentication**: Secure login/signup with email verification
- **Order Management**: Track orders and view purchase history
- **Responsive Design**: Mobile-first design that works on all devices

### Unlimited Fur Subscription System
- **Budget Selection**: Customers choose monthly spending limits
- **Product Curation**: AI-powered product recommendations within budget
- **Flexible Management**: Pause, skip, or modify subscriptions anytime
- **Automatic Billing**: Recurring payments with transparent pricing

### Business Management
- **Product Management**: Add, edit, and organize product catalog
- **Order Processing**: View and manage customer orders
- **User Management**: Customer support and account management
- **Content Management**: Blog posts and educational content

### Content & Marketing
- **Blog System**: Educational content about pet care
- **SEO Optimization**: Meta tags, structured data, and search-friendly URLs
- **Multi-theme Support**: Different visual themes for different product categories

## Target Audience

### Primary Customers
- **Pet Parents**: Dog and cat owners who prioritize quality and convenience
- **Busy Professionals**: People who want automated pet care solutions
- **Health-Conscious Pet Owners**: Customers seeking vet-approved products

### Business Users
- **Store Managers**: Managing product catalog and inventory
- **Customer Service**: Handling customer inquiries and orders
- **Content Creators**: Publishing educational blog content

## Current Development Status

The platform is in active development with core e-commerce functionality complete and the Unlimited Fur subscription system implemented. The project is structured for scalability and maintainability, with a strong foundation for future feature development.

## Next Phase Opportunities

- Enhanced personalization and AI recommendations
- Mobile app development
- Advanced analytics and reporting
- Integration with additional payment providers
- Expansion to additional pet types and product categories
