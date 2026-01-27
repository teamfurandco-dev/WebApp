# Backend API Documentation & Integration Guide

## Overview

This document provides comprehensive documentation for the Fur & Co backend API, including the newly implemented Review System and Inventory Management features.

## Base URL
```
Development: http://localhost:3000
Production: [TBD]
```

## Authentication

Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

Admin endpoints require the user to have `role: "admin"`.

---

## Product Reviews API

### Get Product Reviews
```http
GET /api/products/:productId/reviews
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 50)
- `rating` (number, optional): Filter by rating (1-5)
- `status` (string, optional): Filter by status (PENDING, APPROVED, REJECTED)

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "title": "Great product!",
        "comment": "My dog loves this toy...",
        "status": "APPROVED",
        "isVerifiedPurchase": true,
        "helpfulCount": 3,
        "createdAt": "2026-01-27T12:00:00Z",
        "user": {
          "id": "uuid",
          "name": "John Doe",
          "avatarUrl": "https://..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Create Review
```http
POST /api/products/:productId/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great product!",
  "comment": "My dog loves this toy..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "rating": 5,
    "title": "Great product!",
    "comment": "My dog loves this toy...",
    "status": "APPROVED",
    "isVerifiedPurchase": false,
    "createdAt": "2026-01-27T12:00:00Z",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "avatarUrl": "https://..."
    }
  }
}
```

### Update Review
```http
PATCH /api/reviews/:reviewId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment"
}
```

### Delete Review
```http
DELETE /api/reviews/:reviewId
Authorization: Bearer <token>
```

### Moderate Review (Admin Only)
```http
PATCH /api/admin/reviews/:reviewId/moderate
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

---

## Inventory Management API

### Update Stock
```http
POST /api/admin/inventory/:variantId/stock
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "quantity": 50,
  "type": "RESTOCK",
  "reason": "Weekly restock",
  "reference": "PO-2026-001",
  "notes": "Received from supplier"
}
```

**Movement Types:**
- `RESTOCK`: Adding new inventory
- `SALE`: Stock sold to customer
- `RETURN`: Returned items
- `ADJUSTMENT`: Manual adjustment
- `DAMAGE`: Damaged goods
- `EXPIRED`: Expired products

### Get Inventory Report
```http
GET /api/admin/inventory/report
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page (max: 100)
- `status` (string): Filter by stock status
- `productId` (string): Filter by product

**Stock Status Values:**
- `IN_STOCK`: Normal stock levels
- `LOW_STOCK`: Below threshold
- `OUT_OF_STOCK`: Zero stock
- `DISCONTINUED`: No longer available

### Get Low Stock Alerts
```http
GET /api/admin/inventory/alerts
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "variant-uuid",
      "sku": "DOG-FOOD-1KG",
      "name": "1kg",
      "stock": 3,
      "lowStockThreshold": 10,
      "stockStatus": "LOW_STOCK",
      "product": {
        "id": "product-uuid",
        "name": "Premium Dog Food",
        "slug": "premium-dog-food"
      }
    }
  ]
}
```

### Get Inventory Logs
```http
GET /api/admin/inventory/:variantId/logs
Authorization: Bearer <admin_token>
```

### Update Low Stock Threshold
```http
PATCH /api/admin/inventory/:variantId/threshold
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "threshold": 15
}
```

---

## Product Variants API

### Get Product Variants
```http
GET /api/products/:productId/variants
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "sku": "DOG-FOOD-500G",
      "name": "500g",
      "size": "500g",
      "color": null,
      "weight": null,
      "price": 2999,
      "compareAtPrice": 3499,
      "stock": 45,
      "isActive": true,
      "lowStockThreshold": 10,
      "stockStatus": "IN_STOCK",
      "lastRestocked": "2026-01-20T10:00:00Z",
      "displayOrder": 0,
      "createdAt": "2026-01-15T12:00:00Z",
      "updatedAt": "2026-01-27T12:00:00Z"
    }
  ]
}
```

---

## Enhanced Product Response

Products now include review aggregation and inventory data:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Premium Dog Food",
    "slug": "premium-dog-food",
    "description": "High-quality nutrition...",
    "averageRating": 4.5,
    "reviewCount": 127,
    "variants": [
      {
        "id": "uuid",
        "sku": "DOG-FOOD-500G",
        "name": "500g",
        "price": 2999,
        "stock": 45,
        "stockStatus": "IN_STOCK"
      }
    ],
    "images": [
      {
        "id": "uuid",
        "url": "https://...",
        "altText": "Premium Dog Food",
        "isPrimary": true
      }
    ]
  }
}
```

---

## Frontend Integration Guide

### 1. API Service Updates

Update your frontend API service to use the new endpoints:

```javascript
// Add to api.js
export const api = {
  // ... existing methods

  // Reviews
  getReviews: async (productId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/api/products/${productId}/reviews?${query}`);
  },

  createReview: async (productId, reviewData) => {
    return await apiRequest(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: reviewData
    });
  },

  updateReview: async (reviewId, reviewData) => {
    return await apiRequest(`/api/reviews/${reviewId}`, {
      method: 'PATCH',
      body: reviewData
    });
  },

  deleteReview: async (reviewId) => {
    return await apiRequest(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  },

  // Product Variants
  getProductVariants: async (productId) => {
    return await apiRequest(`/api/products/${productId}/variants`);
  },

  // Inventory (Admin)
  updateStock: async (variantId, stockData) => {
    return await apiRequest(`/api/admin/inventory/${variantId}/stock`, {
      method: 'POST',
      body: stockData
    });
  },

  getInventoryReport: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/api/admin/inventory/report?${query}`);
  },

  getLowStockAlerts: async () => {
    return await apiRequest('/api/admin/inventory/alerts');
  }
};
```

### 2. Component Updates

Update your components to use the new data structure:

```jsx
// ProductDetail.jsx
const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [productData, reviewsData, variantsData] = await Promise.all([
        api.getProductById(productId),
        api.getReviews(productId),
        api.getProductVariants(productId)
      ]);
      
      setProduct(productData);
      setReviews(reviewsData.reviews);
      setVariants(variantsData);
    };

    fetchData();
  }, [productId]);

  return (
    <div>
      <h1>{product?.name}</h1>
      <div>Rating: {product?.averageRating} ({product?.reviewCount} reviews)</div>
      
      {/* Variants */}
      <div>
        {variants.map(variant => (
          <div key={variant.id}>
            {variant.name} - ${variant.price / 100}
            <span className={variant.stockStatus === 'IN_STOCK' ? 'text-green' : 'text-red'}>
              {variant.stock} in stock
            </span>
          </div>
        ))}
      </div>

      {/* Reviews */}
      <div>
        {reviews.map(review => (
          <div key={review.id}>
            <div>★ {review.rating} - {review.title}</div>
            <p>{review.comment}</p>
            <small>by {review.user.name}</small>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Review Component

```jsx
// ReviewForm.jsx
const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const review = await api.createReview(productId, {
        rating,
        title,
        comment
      });
      onReviewSubmitted(review);
      // Reset form
      setRating(5);
      setTitle('');
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} stars</option>)}
        </select>
      </div>
      <div>
        <label>Title:</label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review title"
        />
      </div>
      <div>
        <label>Comment:</label>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
        />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};
```

### 4. Admin Inventory Dashboard

```jsx
// InventoryDashboard.jsx
const InventoryDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [alertsData, inventoryData] = await Promise.all([
        api.getLowStockAlerts(),
        api.getInventoryReport()
      ]);
      
      setAlerts(alertsData);
      setInventory(inventoryData.variants);
    };

    fetchData();
  }, []);

  const handleStockUpdate = async (variantId, quantity, type, reason) => {
    try {
      await api.updateStock(variantId, {
        quantity,
        type,
        reason
      });
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  return (
    <div>
      <h2>Low Stock Alerts</h2>
      {alerts.map(variant => (
        <div key={variant.id} className="alert">
          {variant.product.name} - {variant.name}: {variant.stock} left
          <button onClick={() => handleStockUpdate(variant.id, 50, 'RESTOCK', 'Emergency restock')}>
            Restock
          </button>
        </div>
      ))}

      <h2>Inventory Report</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Variant</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(variant => (
            <tr key={variant.id}>
              <td>{variant.product.name}</td>
              <td>{variant.name}</td>
              <td>{variant.stock}</td>
              <td>{variant.stockStatus}</td>
              <td>
                <button onClick={() => handleStockUpdate(variant.id, 10, 'ADJUSTMENT', 'Manual adjustment')}>
                  Adjust
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": {
    "message": "Product not found",
    "code": "NOT_FOUND",
    "requestId": "uuid"
  }
}
```

Common error codes:
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `CONFLICT`: Resource conflict (e.g., duplicate review)

---

## Testing

### Manual Testing

```bash
# Test review creation
curl -X POST http://localhost:3000/api/products/PRODUCT_ID/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "title": "Great!", "comment": "Love it"}'

# Test inventory update
curl -X POST http://localhost:3000/api/admin/inventory/VARIANT_ID/stock \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 50, "type": "RESTOCK", "reason": "Weekly restock"}'
```

### Integration Testing

1. **Product Flow**: Create product → Add variants → Add reviews → Check aggregation
2. **Inventory Flow**: Update stock → Check status → Verify logs → Test alerts
3. **User Flow**: Browse products → View reviews → Create review → Manage inventory (admin)

---

## Performance Considerations

1. **Database Indexes**: All critical queries are indexed for performance
2. **Pagination**: All list endpoints support pagination to prevent large responses
3. **Caching**: Consider implementing Redis caching for frequently accessed data
4. **Rate Limiting**: API includes rate limiting to prevent abuse

---

## Security

1. **Authentication**: JWT-based authentication for all protected endpoints
2. **Authorization**: Role-based access control (admin vs customer)
3. **Input Validation**: Zod schema validation on all inputs
4. **SQL Injection**: Prisma ORM prevents SQL injection attacks
5. **Rate Limiting**: Prevents API abuse and DoS attacks

---

## Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourfrontend.com
```

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure logging and monitoring
- [ ] Set up database backups
- [ ] Configure rate limiting for production traffic
- [ ] Set up health checks and alerts

---

## Support

For technical support or questions about the API:
1. Check this documentation first
2. Review the error response for specific error codes
3. Check server logs for detailed error information
4. Contact the development team with specific error details

**Backend Implementation Status**: ✅ COMPLETE
**Frontend Integration**: Ready for implementation
**Production Ready**: Yes, with proper environment configuration
