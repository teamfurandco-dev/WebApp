# API Integration Specification
## Product Page & Product List Integration

### Overview
This document specifies the exact API contract between frontend and backend for Product List and Product Detail pages.

## Required API Endpoints

### 1. GET /api/products
**Purpose**: Fetch products for shop page with filtering/sorting

**Query Parameters**:
```typescript
{
  category?: string;     // Filter by category name
  sort?: 'price-low' | 'price-high' | 'rating' | 'featured';
  search?: string;       // Search term
  limit?: number;        // Pagination limit
  offset?: number;       // Pagination offset
}
```

**Response Format**:
```typescript
{
  products: Array<{
    id: string;
    name: string;
    description: string;
    base_price_cents: number;
    compare_at_price_cents?: number;
    images: string[];
    category: string;
    average_rating: number;
    reviews_count: number;
    is_active: boolean;
    is_featured: boolean;
    variants: Array<{
      type: string;      // 'size', 'color', etc.
      options: string[]; // ['1.5kg', '3kg', '7kg']
    }>;
  }>;
  total_count: number;
  has_more: boolean;
}
```

### 2. GET /api/products/:id
**Purpose**: Fetch single product details

**Response Format**:
```typescript
{
  id: string;
  name: string;
  description: string;
  base_price_cents: number;
  compare_at_price_cents?: number;
  images: string[];
  category: string;
  average_rating: number;
  reviews_count: number;
  is_active: boolean;
  is_featured: boolean;
  variants: Array<{
    type: string;
    options: string[];
  }>;
  nutritional_info?: Array<{
    nutrient: string;
    amount: string;
  }>;
  ingredients?: string[];
  usage_instructions?: string;
  safety_notes?: string[];
  suitable_for?: string[];
}
```

### 3. GET /api/categories
**Purpose**: Fetch all product categories

**Response Format**:
```typescript
{
  categories: Array<{
    id: string;
    name: string;
    product_count: number;
  }>
}
```

### 4. GET /api/products/:id/questions
**Purpose**: Fetch Q&A for product

**Response Format**:
```typescript
{
  questions: Array<{
    id: string;
    content: string;
    user_name: string;
    created_at: string;
    answers: Array<{
      id: string;
      content: string;
      user_name: string;
      created_at: string;
      is_official: boolean;
    }>;
  }>
}
```

### 5. POST /api/products/:id/questions
**Purpose**: Add new question

**Request Body**:
```typescript
{
  content: string;
  user_id: string;
}
```

## Database Schema Requirements

### Products Table
```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price_cents bigint NOT NULL,
  compare_at_price_cents bigint,
  images jsonb DEFAULT '[]'::jsonb,
  category text NOT NULL,
  average_rating numeric(3,2) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  variants jsonb DEFAULT '[]'::jsonb,
  nutritional_info jsonb,
  ingredients jsonb,
  usage_instructions text,
  safety_notes jsonb,
  suitable_for jsonb,
  search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', name || ' ' || description)) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_products_active ON products (is_active);
CREATE INDEX idx_products_category ON products (category) WHERE is_active = true;
CREATE INDEX idx_products_featured ON products (is_featured) WHERE is_active = true;
CREATE INDEX idx_products_search ON products USING gin(search_vector);
CREATE INDEX idx_products_price ON products (base_price_cents) WHERE is_active = true;
CREATE INDEX idx_products_rating ON products (average_rating DESC) WHERE is_active = true;
```

### Categories Table
```sql
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  product_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

## Frontend Integration Points

### API Service Updates Required
File: `/src/services/api.js`

**Current Issues to Fix**:
1. `getProducts()` - Update to handle new response format
2. `getProductById()` - Add nutritional_info and other new fields
3. Error handling for network failures
4. Loading states management

### Component Updates Required

**ProductList.jsx**:
- Update product mapping for new response structure
- Handle pagination with `has_more` flag
- Update category filtering logic

**ProductDetailOptimized.jsx**:
- Map nutritional_info to ingredients section
- Handle variants array structure
- Update Q&A integration

## Backend Implementation Tasks

### 1. Database Migration
- Apply optimized schema from previous optimization
- Seed sample data matching frontend expectations

### 2. API Endpoints
- Implement all 5 required endpoints
- Add proper error handling and validation
- Implement search functionality with PostgreSQL FTS

### 3. Data Seeding
- Create realistic product data
- Include proper image URLs
- Set up categories with product counts

## Integration Testing Checklist

### Frontend Tests
- [ ] Product list loads with categories
- [ ] Search functionality works
- [ ] Sorting by price/rating works
- [ ] Product detail page loads all sections
- [ ] Q&A functionality works
- [ ] Image gallery works
- [ ] Variant selection works

### Backend Tests
- [ ] All endpoints return correct format
- [ ] Search returns relevant results
- [ ] Filtering by category works
- [ ] Pagination works correctly
- [ ] Error responses are properly formatted

## Error Handling Contract

### Standard Error Response
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (product/category not found)
- `500` - Internal Server Error

## Environment Variables Required

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

## Next Steps

1. **Backend Agent**: Implement API endpoints and database schema
2. **Frontend Agent**: Update API service and components
3. **Integration Testing**: Test all endpoints together
4. **Performance Optimization**: Add caching and optimize queries
