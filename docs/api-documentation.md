# Fur & Co API Documentation

## Overview

This document provides comprehensive API documentation for the Fur & Co frontend integration. All APIs use Supabase as the backend with direct client-side queries.

## Base Configuration

```javascript
// Environment Variables Required
VITE_SUPABASE_URL=https://isaphgvbdyqrblwnsrmn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

// Import
import { api } from '@/services/api';
```

## API Endpoints

### Products

#### `api.getProducts(params)`

**Purpose**: Fetch products with filtering, sorting, and search capabilities

**Parameters**:
```typescript
{
  category?: string;  // Filter by category name (e.g., "Dog Food", "Toys")
  sort?: string;      // "price-low" | "price-high" | "rating" | "featured"
  search?: string;    // Search term for name/description
}
```

**Response Format**:
```json
[
  {
    "id": "e213f3e2-1f0a-4d84-b2b1-78ed8f1a0001",
    "name": "Wholesome Kibble Premium Adult",
    "description": "Premium dry dog food made with real chicken...",
    "base_price_cents": 299900,
    "compare_at_price_cents": 349900,
    "images": [
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500"
    ],
    "category": "Dog Food",
    "average_rating": 4.5,
    "reviews_count": 127,
    "is_featured": true,
    "is_active": true,
    "variants": [
      {
        "type": "size",
        "options": ["1.5kg", "3kg", "7kg", "12kg"]
      }
    ],
    "created_at": "2024-01-08T12:00:00Z",
    "updated_at": "2024-01-08T12:00:00Z"
  }
]
```

**Usage Example**:
```javascript
// Get all products
const products = await api.getProducts();

// Filter by category
const dogFood = await api.getProducts({ category: 'Dog Food' });

// Search and sort
const results = await api.getProducts({ 
  search: 'kibble', 
  sort: 'price-low' 
});
```

---

#### `api.getProductById(id)`

**Purpose**: Fetch detailed information for a single product

**Parameters**:
- `id` (string): Product UUID

**Response Format**:
```json
{
  "id": "e213f3e2-1f0a-4d84-b2b1-78ed8f1a0001",
  "name": "Wholesome Kibble Premium Adult",
  "description": "Premium dry dog food made with real chicken and wholesome grains...",
  "base_price_cents": 299900,
  "compare_at_price_cents": 349900,
  "images": ["https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500"],
  "category": "Dog Food",
  "rating": 4.5,
  "reviewsCount": 127,
  "variants": [
    {
      "type": "size",
      "options": ["1.5kg", "3kg", "7kg", "12kg"]
    }
  ],
  "nutritional_info": [
    {
      "nutrient": "Crude Protein",
      "amount": "26.0% min"
    },
    {
      "nutrient": "Crude Fat", 
      "amount": "15.0% min"
    }
  ],
  "ingredients": ["Chicken", "Brown Rice", "Sweet Potato", "Peas"],
  "usage_instructions": "Feed according to your dog weight and activity level. Transition gradually over 7-10 days.",
  "safety_notes": [
    "Store in cool, dry place",
    "Keep away from direct sunlight",
    "Use within 6 weeks of opening"
  ],
  "suitable_for": [
    "Adult dogs (1-7 years)",
    "Medium to large breeds",
    "Active and working dogs"
  ]
}
```

**Usage Example**:
```javascript
const product = await api.getProductById('e213f3e2-1f0a-4d84-b2b1-78ed8f1a0001');
if (product) {
  console.log(product.name, product.nutritional_info);
}
```

---

### Categories

#### `api.getCategories()`

**Purpose**: Fetch all product categories

**Parameters**: None

**Response Format**:
```json
[
  {
    "id": "f0b4a640-77d3-4d9c-8b2c-1084c0b11111",
    "name": "Dog Food",
    "slug": "dog-food",
    "image_url": null,
    "parent_id": null,
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "f0b4a640-77d3-4d9c-8b2c-1084c0b22222", 
    "name": "Cat Food",
    "slug": "cat-food",
    "image_url": null,
    "parent_id": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**Usage Example**:
```javascript
const categories = await api.getCategories();
const categoryNames = categories.map(cat => cat.name);
```

---

### Product Q&A

#### `api.getQuestions(productId)`

**Purpose**: Fetch questions and answers for a specific product

**Parameters**:
- `productId` (string): Product UUID

**Response Format**:
```json
[
  {
    "id": "q1-uuid",
    "question": "Is this suitable for dogs with sensitive stomachs?",
    "user_name": "John Doe",
    "created_at": "2024-01-05T10:30:00Z",
    "answers": [
      {
        "id": "a1-uuid",
        "answer": "Yes, this formula is designed to be gentle on sensitive stomachs. It contains prebiotics and easily digestible ingredients.",
        "user_name": "Fur&Co Support",
        "is_staff_reply": true,
        "created_at": "2024-01-05T14:20:00Z"
      }
    ]
  },
  {
    "id": "q2-uuid",
    "question": "What is the protein source in this food?",
    "user_name": "Sarah Smith",
    "created_at": "2024-01-03T16:45:00Z",
    "answers": [
      {
        "id": "a2-uuid",
        "answer": "The primary protein source is deboned chicken, which makes up the first ingredient. We also include chicken meal for concentrated protein.",
        "user_name": "Fur&Co Support", 
        "is_staff_reply": true,
        "created_at": "2024-01-04T09:15:00Z"
      }
    ]
  }
]
```

**Usage Example**:
```javascript
const questions = await api.getQuestions('product-uuid');
questions.forEach(q => {
  console.log(`Q: ${q.question}`);
  q.answers.forEach(a => {
    console.log(`A: ${a.answer} (by ${a.user_name})`);
  });
});
```

---

#### `api.addQuestion(productId, content, userId)`

**Purpose**: Add a new question for a product

**Parameters**:
- `productId` (string): Product UUID
- `content` (string): Question text
- `userId` (string): User UUID (must be authenticated)

**Response Format**:
```json
{
  "id": "new-question-uuid",
  "question": "How long does shipping take?",
  "user_name": "You",
  "created_at": "2024-01-08T18:00:00Z",
  "answers": []
}
```

**Usage Example**:
```javascript
const newQuestion = await api.addQuestion(
  'product-uuid',
  'Is this suitable for senior dogs?',
  'user-uuid'
);
```

---

### Orders

#### `api.getOrders(userId)`

**Purpose**: Fetch user's order history

**Parameters**:
- `userId` (string): User UUID

**Response Format**:
```json
[
  {
    "id": "order-uuid",
    "user_id": "user-uuid",
    "status": "delivered",
    "total_amount_cents": 299900,
    "subtotal_amount_cents": 299900,
    "tax_amount_cents": 0,
    "shipping_cost_cents": 0,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-05T16:30:00Z",
    "items": [
      {
        "product_id": "product-uuid",
        "name": "Wholesome Kibble Premium Adult",
        "quantity": 1,
        "price_cents": 299900,
        "variant": "7kg"
      }
    ],
    "events": [
      {
        "status": "Order Placed",
        "date": "2024-01-01T10:00:00Z",
        "completed": true,
        "description": "Your order has been placed."
      },
      {
        "status": "Processing", 
        "date": "2024-01-02T08:00:00Z",
        "completed": true,
        "description": "We are preparing your package."
      },
      {
        "status": "Shipped",
        "date": "2024-01-03T14:00:00Z", 
        "completed": true,
        "description": "Tracking: TRK123456789"
      },
      {
        "status": "Delivered",
        "date": "2024-01-05T16:30:00Z",
        "completed": true,
        "description": "Package delivered."
      }
    ]
  }
]
```

---

### Featured Products

#### `api.getFeaturedProducts()`

**Purpose**: Fetch featured products for homepage

**Parameters**: None

**Response Format**: Same as `getProducts()` but limited to featured products

**Usage Example**:
```javascript
const featured = await api.getFeaturedProducts();
// Returns max 6 featured products
```

---

#### `api.getTrendingProducts()`

**Purpose**: Fetch trending products based on review count

**Parameters**: None

**Response Format**: Same as `getProducts()` but sorted by review count

**Usage Example**:
```javascript
const trending = await api.getTrendingProducts();
// Returns max 6 products sorted by reviews_count DESC
```

---

## Database Schema Reference

### Key Tables

**products**:
- `id` (uuid, primary key)
- `name` (text)
- `slug` (text, unique)
- `description` (text)
- `base_price_cents` (integer)
- `compare_at_price_cents` (integer, nullable)
- `images` (text array)
- `category_id` (uuid, foreign key to categories)
- `attributes` (jsonb) - Contains variants, nutritional_info, etc.
- `is_active` (boolean)
- `is_featured` (boolean)
- `average_rating` (numeric)
- `reviews_count` (integer)

**categories**:
- `id` (uuid, primary key)
- `name` (text, unique)
- `slug` (text, unique)

**product_questions**:
- `id` (uuid, primary key)
- `product_id` (uuid, foreign key)
- `user_id` (uuid, foreign key)
- `question` (text)
- `is_approved` (boolean)

**product_answers**:
- `id` (uuid, primary key)
- `question_id` (uuid, foreign key)
- `user_id` (uuid, foreign key)
- `answer` (text)
- `is_staff_reply` (boolean)

## Error Handling

All API functions include error handling and will:
- Log errors to console
- Return empty arrays `[]` for list endpoints
- Return `null` for single item endpoints
- Never throw exceptions

**Example Error Handling**:
```javascript
const products = await api.getProducts({ category: 'Invalid' });
// Returns [] if error occurs

const product = await api.getProductById('invalid-id');
// Returns null if error occurs
```

## Frontend Integration

### ProductList Component
```javascript
// In ProductList.jsx
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);

useEffect(() => {
  const loadData = async () => {
    const [prods, cats] = await Promise.all([
      api.getProducts({ category: selectedCategory, sort }),
      api.getCategories()
    ]);
    setProducts(prods);
    setCategories(cats);
  };
  loadData();
}, [selectedCategory, sort]);
```

### ProductDetail Component
```javascript
// In ProductDetail.jsx
const [product, setProduct] = useState(null);
const [questions, setQuestions] = useState([]);

useEffect(() => {
  const loadProduct = async () => {
    const [productData, questionsData] = await Promise.all([
      api.getProductById(id),
      api.getQuestions(id)
    ]);
    setProduct(productData);
    setQuestions(questionsData);
  };
  loadProduct();
}, [id]);
```

## Testing

### Manual Testing
```javascript
// Test in browser console
import { api } from './src/services/api.js';

// Test products
api.getProducts().then(console.log);

// Test categories
api.getCategories().then(console.log);

// Test single product
api.getProductById('your-product-id').then(console.log);

// Test Q&A
api.getQuestions('your-product-id').then(console.log);
```

### Sample Data Available

The database contains sample data for:
- ✅ 7 products (4 original + 3 new with enhanced attributes)
- ✅ 4 categories (Dog Food, Cat Food, Toys, Accessories)
- ✅ Product variants in attributes JSONB
- ✅ Sample questions and answers
- ✅ Nutritional information and usage instructions

## Notes for Backend Team

1. **Direct Supabase Integration**: No separate API server needed - frontend connects directly to Supabase
2. **RLS Policies**: Ensure proper Row Level Security policies are configured
3. **JSONB Attributes**: Product variants, nutritional info, and other metadata stored in `attributes` JSONB column
4. **Category Joins**: Products are joined with categories table to get category names
5. **Question Moderation**: New questions require `is_approved = true` to appear in results

This API service is production-ready and handles all the data transformation needed for the frontend components.
