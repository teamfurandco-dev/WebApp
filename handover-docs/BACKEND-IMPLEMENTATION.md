# Backend Implementation Guide

## Fastify Server Architecture

### Server Structure
The backend is built with Fastify, a high-performance Node.js web framework. The server is organized with a modular architecture that separates concerns and promotes maintainability.

### Module Organization
The backend follows a feature-based module structure where each business domain has its own module:

#### Core Modules
- **Products**: Product catalog management, variants, and pricing
- **Users**: User authentication, profiles, and account management
- **Orders**: Order processing, payment handling, and fulfillment
- **Categories**: Product categorization and taxonomy
- **Cart**: Shopping cart functionality and session management
- **Wishlist**: User wishlist management
- **Addresses**: User address management for shipping

#### Specialized Modules
- **Unlimited Fur**: Subscription system with budget management and recurring billing
- **Blogs**: Content management system for educational articles
- **Questions**: Customer Q&A system for products
- **Uploads**: File upload handling and storage management

### Module Structure Pattern
Each module follows a consistent structure:
- **Routes**: HTTP endpoint definitions and request handling
- **Service**: Business logic and data processing
- **Schema**: Request/response validation schemas
- **Types**: TypeScript type definitions specific to the module

## Prisma ORM Integration

### Database Management Approach
Prisma serves as the ORM layer, providing type-safe database access and automatic query generation. The integration includes:

#### Schema Management
- **Declarative Schema**: Database structure defined in Prisma schema file
- **Migration System**: Version-controlled database changes
- **Type Generation**: Automatic TypeScript types from database schema

#### Query Patterns
- **CRUD Operations**: Standard create, read, update, delete operations
- **Complex Queries**: Joins, filtering, and aggregation queries
- **Transaction Support**: Multi-operation transactions for data consistency

#### Performance Optimization
- **Query Optimization**: Efficient queries with proper select statements
- **Indexing Strategy**: Database indexes for frequently queried fields
- **Connection Pooling**: Managed database connections for scalability

## API Design Patterns

### RESTful Architecture
The API follows REST principles with consistent patterns:

#### Endpoint Structure
- **Resource-based URLs**: `/api/products`, `/api/orders`, `/api/users`
- **HTTP Methods**: GET for retrieval, POST for creation, PATCH for updates, DELETE for removal
- **Nested Resources**: `/api/products/:id/variants` for related resources

#### Response Patterns
- **Consistent Format**: Standardized response structure across all endpoints
- **Error Handling**: Uniform error responses with appropriate HTTP status codes
- **Pagination**: Cursor-based pagination for large datasets

#### Request Validation
- **Schema Validation**: All requests validated against predefined schemas
- **Type Safety**: TypeScript ensures compile-time type checking
- **Sanitization**: Input sanitization to prevent security vulnerabilities

## Authentication and Authorization

### Supabase Auth Integration
The backend integrates with Supabase for authentication:

#### Token Validation
- **JWT Verification**: All protected routes verify Supabase JWT tokens
- **User Context**: Authenticated user information extracted from tokens
- **Session Management**: Token refresh and expiration handling

#### Authorization Patterns
- **Role-based Access**: Different access levels for customers and administrators
- **Resource Ownership**: Users can only access their own data
- **Admin Protection**: Administrative functions require elevated permissions

### Security Implementation
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation and sanitization

## File Upload and Storage

### Supabase Storage Integration
File handling is managed through Supabase Storage:

#### Upload Process
- **Direct Upload**: Files uploaded directly to Supabase Storage
- **Validation**: File type and size validation before storage
- **Organization**: Files organized in buckets by type (products, blogs, etc.)

#### URL Management
- **Dynamic URLs**: Public URLs generated at runtime
- **Access Control**: Proper permissions for file access
- **CDN Integration**: Files served through Supabase CDN for performance

## Key Module Implementations

### Products Module
- **Catalog Management**: Complete product lifecycle management
- **Variant System**: Support for product variations (size, color, etc.)
- **Pricing Logic**: Complex pricing with discounts and promotions
- **Inventory Tracking**: Stock management and availability checking

### Orders Module
- **Order Processing**: Complete order lifecycle from creation to fulfillment
- **Payment Integration**: Payment processing and transaction management
- **Status Tracking**: Order status updates and customer notifications
- **Fulfillment**: Shipping and delivery management

### Users Module
- **Profile Management**: User account creation and maintenance
- **Authentication**: Login, signup, and password management
- **Address Management**: Multiple shipping addresses per user
- **Preferences**: User preferences and settings

### Unlimited Fur Module
- **Subscription Management**: Monthly subscription creation and management
- **Budget Control**: Spending limit enforcement and tracking
- **Product Curation**: Automated product selection within budget constraints
- **Billing Automation**: Recurring payment processing and invoice generation

### Blogs Module
- **Content Management**: Blog post creation, editing, and publishing
- **SEO Optimization**: Meta tags and search engine optimization
- **Image Management**: Blog image upload and optimization
- **Publishing Workflow**: Draft, review, and publish workflow

## Error Handling and Logging

### Error Management
- **Centralized Handling**: Global error handler for consistent error responses
- **Error Types**: Custom error classes for different error scenarios
- **Status Codes**: Appropriate HTTP status codes for different error types

### Logging Strategy
- **Request Logging**: All API requests logged with relevant details
- **Error Logging**: Detailed error logging for debugging and monitoring
- **Performance Monitoring**: Response time and performance metrics

## Database Schema Design

### Core Entities
- **Products**: Main product information with variants and images
- **Users**: User accounts with profiles and authentication data
- **Orders**: Order information with line items and payment details
- **Categories**: Product categorization hierarchy

### Relationship Management
- **Foreign Keys**: Proper foreign key relationships for data integrity
- **Indexes**: Strategic indexing for query performance
- **Constraints**: Database constraints for data validation

### Data Integrity
- **Transactions**: Multi-table operations wrapped in transactions
- **Validation**: Database-level validation rules
- **Cascading**: Proper cascading deletes for related data

## Performance and Scalability

### Query Optimization
- **Efficient Queries**: Optimized database queries with minimal data transfer
- **Eager Loading**: Strategic eager loading to reduce N+1 query problems
- **Pagination**: Efficient pagination for large datasets

### Caching Strategy
- **Query Caching**: Frequently accessed data cached for performance
- **Session Caching**: User session data cached for quick access
- **Static Content**: Static content served with appropriate cache headers

### Monitoring and Metrics
- **Performance Monitoring**: API response time monitoring
- **Error Tracking**: Error rate monitoring and alerting
- **Usage Analytics**: API usage patterns and optimization opportunities
