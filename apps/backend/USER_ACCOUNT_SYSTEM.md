# User Account System - Implementation Guide

## Overview

Complete, production-ready user account system with:
- ✅ User profiles with preferences
- ✅ Shopping cart with stock validation
- ✅ Wishlist management
- ✅ Multiple address management
- ✅ Order creation and tracking
- ✅ Full backend persistence

## Database Schema Updates

### New Models

**CartItem** - Shopping cart persistence
- User-specific cart items
- Variant-level tracking
- Quantity management
- Unique constraint per user+variant

**WishlistItem** - Wishlist persistence
- Product and optional variant tracking
- User-specific wishlists
- Unique constraint per user+product+variant

**Address** - Address management
- Multiple addresses per user
- Default address support
- Type: shipping, billing, or both
- Full address fields with validation

**Order** - Enhanced order system
- Unique order numbers (ORD260116001)
- Complete pricing breakdown (subtotal, shipping, tax, discount)
- Payment method and status tracking
- Shipping and billing addresses
- Order status workflow
- Customer and admin notes

**OrderItem** - Order line items
- Product snapshot at purchase time
- Prevents data loss if products change
- Quantity and pricing per item

**User** - Enhanced user model
- Phone number support
- Preferences as JSON
- Relations to cart, wishlist, addresses, orders

## API Endpoints

### User Profile

```
GET    /api/users/me           # Get current user profile
PATCH  /api/users/me           # Update profile
GET    /api/users/me/stats     # Get user stats (orders, cart, wishlist counts)
```

### Cart

```
GET    /api/cart               # Get cart with full product details
GET    /api/cart/summary       # Get cart summary (count, total)
POST   /api/cart               # Add to cart
PATCH  /api/cart/:itemId       # Update quantity
DELETE /api/cart/:itemId       # Remove item
DELETE /api/cart               # Clear cart
```

### Wishlist

```
GET    /api/wishlist                    # Get wishlist
POST   /api/wishlist                    # Add to wishlist
GET    /api/wishlist/check/:productId   # Check if in wishlist
DELETE /api/wishlist/:itemId            # Remove from wishlist
DELETE /api/wishlist                    # Clear wishlist
```

### Addresses

```
GET    /api/addresses              # Get all addresses
GET    /api/addresses/default      # Get default address
GET    /api/addresses/:id          # Get single address
POST   /api/addresses              # Create address
PATCH  /api/addresses/:id          # Update address
DELETE /api/addresses/:id          # Delete address
POST   /api/addresses/:id/default  # Set as default
```

### Orders

```
GET    /api/orders                      # Get user's orders
GET    /api/orders/:id                  # Get single order
GET    /api/orders/number/:orderNumber  # Get order by number
POST   /api/orders                      # Create order
POST   /api/orders/:id/cancel           # Cancel order
PATCH  /api/orders/:id/status           # Update status (admin)
```

## Request/Response Examples

### Add to Cart

**Request:**
```json
POST /api/cart
{
  "variantId": "uuid",
  "quantity": 2
}
```

**Response:**
```json
{
  "data": {
    "id": "cart-item-id",
    "userId": "user-id",
    "variantId": "variant-id",
    "quantity": 2,
    "variant": {
      "id": "variant-id",
      "name": "500g",
      "price": 2999,
      "stock": 98,
      "product": {
        "id": "product-id",
        "name": "Premium Dog Food",
        "images": [{
          "url": "https://...supabase.co/storage/.../image.jpg"
        }]
      }
    }
  }
}
```

### Create Address

**Request:**
```json
POST /api/addresses
{
  "label": "Home",
  "fullName": "John Doe",
  "phone": "9876543210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "isDefault": true,
  "type": "both"
}
```

### Create Order

**Request:**
```json
POST /api/orders
{
  "items": [
    {
      "variantId": "variant-uuid",
      "quantity": 2
    }
  ],
  "shippingAddressId": "address-uuid",
  "billingAddressId": "address-uuid",
  "paymentMethod": "cod",
  "customerNotes": "Please deliver after 6 PM"
}
```

**Response:**
```json
{
  "data": {
    "id": "order-id",
    "orderNumber": "ORD260116001",
    "status": "pending",
    "subtotal": 5998,
    "shippingCost": 0,
    "tax": 1080,
    "total": 7078,
    "paymentMethod": "cod",
    "paymentStatus": "pending",
    "items": [
      {
        "productName": "Premium Dog Food",
        "variantName": "500g",
        "quantity": 2,
        "price": 2999,
        "total": 5998
      }
    ],
    "createdAt": "2026-01-16T..."
  }
}
```

## Features

### Cart Management

**Stock Validation:**
- Real-time stock checking
- Prevents over-ordering
- Clear error messages

**Persistence:**
- Saved per user in database
- Restored on login
- Works across devices

**Auto-merge:**
- If item exists, quantity is added
- Unique constraint prevents duplicates

**Auto-clear:**
- Cart items removed after order creation
- Only ordered items are cleared

### Wishlist

**Flexible Tracking:**
- Can save product only
- Or product + specific variant
- Unique per combination

**Cross-device:**
- Fully persisted in database
- Syncs across all sessions

### Address Management

**Multiple Addresses:**
- Save unlimited addresses
- Label them (Home, Office, etc.)
- Set default for quick checkout

**Type Support:**
- Shipping only
- Billing only
- Both (default)

**Auto-default:**
- Setting new default unsets others
- Always one default address

### Order System

**Order Numbers:**
- Human-readable format: ORD260116001
- Date-based with sequence
- Unique and trackable

**Stock Management:**
- Stock reduced on order creation
- Stock restored on cancellation
- Prevents overselling

**Price Snapshot:**
- Product details saved at purchase time
- Immune to future price changes
- Complete order history

**Status Workflow:**
```
pending → confirmed → processing → shipped → delivered
                                  ↓
                              cancelled
```

**Pricing Breakdown:**
- Subtotal (sum of items)
- Shipping cost (free over ₹500)
- Tax (18% GST)
- Discount (future feature)
- Total

## Authentication

All endpoints require authentication via JWT token:

```
Authorization: Bearer <token>
```

The `authenticate` middleware:
1. Validates JWT token
2. Extracts user ID
3. Attaches to `request.user`

## Error Handling

All services throw descriptive errors:

```javascript
// Stock validation
throw new Error('Only 5 items available in stock');

// Not found
throw new Error('Product variant not found');

// Business logic
throw new Error('Cannot cancel delivered order');
```

Errors are caught by global error handler and returned as:

```json
{
  "error": "Error message",
  "statusCode": 400
}
```

## Setup Instructions

### 1. Run Migration

```bash
cd apps/backend
pnpm prisma:push
pnpm prisma:generate
```

### 2. Test Endpoints

```bash
# Start backend
pnpm dev

# Test cart (requires auth token)
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/cart

# Test addresses
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/addresses
```

## Frontend Integration

### Cart Example

```javascript
// Add to cart
async function addToCart(variantId, quantity = 1) {
  const response = await fetch(`${API_URL}/api/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ variantId, quantity })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return response.json();
}

// Get cart
async function getCart() {
  const response = await fetch(`${API_URL}/api/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const { data } = await response.json();
  return data;
}
```

### Address Example

```javascript
// Create address
async function createAddress(addressData) {
  const response = await fetch(`${API_URL}/api/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(addressData)
  });
  
  const { data } = await response.json();
  return data;
}

// Get addresses
async function getAddresses() {
  const response = await fetch(`${API_URL}/api/addresses`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const { data } = await response.json();
  return data;
}
```

### Order Example

```javascript
// Create order from cart
async function createOrder(shippingAddressId, paymentMethod) {
  // Get cart items
  const cart = await getCart();
  
  const orderData = {
    items: cart.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity
    })),
    shippingAddressId,
    paymentMethod,
    customerNotes: 'Handle with care'
  };
  
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  
  const { data } = await response.json();
  return data;
}
```

## Next Steps

1. **Update Frontend API Service** - Integrate all new endpoints
2. **Update Account Page** - Replace dummy data with real API calls
3. **Add Loading States** - Show spinners during API calls
4. **Add Error Handling** - Display user-friendly error messages
5. **Add Success Feedback** - Toast notifications for actions
6. **Test Flows** - Test complete user journeys

## Benefits

✅ **Full Persistence** - All data saved in database
✅ **Cross-device** - Works across all user sessions
✅ **Stock Safe** - Real-time validation prevents overselling
✅ **Order Tracking** - Complete order history with status
✅ **Scalable** - Ready for production load
✅ **Type-safe** - Zod validation throughout
✅ **Well-structured** - Clean separation of concerns
