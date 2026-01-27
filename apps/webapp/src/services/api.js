import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get auth token from current session
 */
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  const result = await response.json();

  // Handle standardized response format
  if (result && typeof result === 'object' && 'success' in result) {
    if (result.success) return result.data;
    const errorMsg = result.error?.message || 'API Error';
    const error = new Error(errorMsg);
    error.code = result.error?.code;
    error.requestId = result.requestId;
    throw error;
  }

  return result;
};

/**
 * Fur & Co API Service
 * 
 * This service provides all API endpoints for the Fur & Co frontend.
 * All functions return properly formatted data for UI consumption.
 * 
 * Database Schema:
 * - products: Main product catalog with category_id (UUID reference)
 * - categories: Product categories with name field
 * - product_variants: Product size/color variants with pricing
 * - reviews: Customer reviews with ratings and comments
 * - product_questions: Customer questions about products
 * - product_answers: Staff/customer answers to questions
 * - orders: Customer orders with JSONB items_data
 * - profiles: User profiles and preferences
 * - addresses: User shipping addresses
 */

export const api = {
  // Generic HTTP methods
  get: async (endpoint) => {
    return await apiRequest(endpoint);
  },

  post: async (endpoint, data) => {
    return await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: async (endpoint, data) => {
    return await apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (endpoint) => {
    return await apiRequest(endpoint, {
      method: 'DELETE',
    });
  },

  // ===== CART API =====
  /**
   * GET /api/cart
   * Fetch user's cart items
   */
  getCart: async () => {
    try {
      return await apiRequest('/api/cart');
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { items: [], total: 0 };
    }
  },

  /**
   * POST /api/cart
   * Add item to cart
   */
  addToCart: async (productId, variantId, quantity = 1) => {
    try {
      return await apiRequest('/api/cart', {
        method: 'POST',
        body: { productId, variantId, quantity }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  /**
   * PATCH /api/cart
   * Update cart item quantity
   */
  updateCartItem: async (itemId, quantity) => {
    try {
      return await apiRequest('/api/cart', {
        method: 'PATCH',
        body: { itemId, quantity }
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  /**
   * DELETE /api/cart
   * Remove item from cart
   */
  removeFromCart: async (itemId) => {
    try {
      return await apiRequest('/api/cart', {
        method: 'DELETE',
        body: { itemId }
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  /**
   * GET /api/cart/summary
   * Get cart summary (count, total)
   */
  getCartSummary: async () => {
    try {
      return await apiRequest('/api/cart/summary');
    } catch (error) {
      console.error('Error fetching cart summary:', error);
      return { count: 0, total: 0 };
    }
  },

  // ===== WISHLIST API =====
  /**
   * GET /api/wishlist
   * Fetch user's wishlist
   */
  getWishlist: async () => {
    try {
      return await apiRequest('/api/wishlist');
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },

  /**
   * POST /api/wishlist
   * Add item to wishlist
   */
  addToWishlist: async (productId) => {
    try {
      return await apiRequest('/api/wishlist', {
        method: 'POST',
        body: { productId }
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  /**
   * DELETE /api/wishlist
   * Remove item from wishlist
   */
  removeFromWishlist: async (productId) => {
    try {
      return await apiRequest('/api/wishlist', {
        method: 'DELETE',
        body: { productId }
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  /**
   * GET /api/wishlist/check/:productId
   * Check if product is in wishlist
   */
  checkWishlist: async (productId) => {
    try {
      const result = await apiRequest(`/api/wishlist/check/${productId}`);
      return result.inWishlist;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },

  // ===== ADDRESSES API =====
  /**
   * GET /api/addresses
   * Fetch user's addresses
   */
  getAddresses: async () => {
    try {
      return await apiRequest('/api/addresses');
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
  },

  /**
   * POST /api/addresses
   * Add new address
   */
  addAddress: async (addressData) => {
    try {
      return await apiRequest('/api/addresses', {
        method: 'POST',
        body: addressData
      });
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },

  /**
   * PATCH /api/addresses
   * Update address
   */
  updateAddress: async (addressId, addressData) => {
    try {
      return await apiRequest('/api/addresses', {
        method: 'PATCH',
        body: { addressId, ...addressData }
      });
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  /**
   * DELETE /api/addresses
   * Delete address
   */
  deleteAddress: async (addressId) => {
    try {
      return await apiRequest('/api/addresses', {
        method: 'DELETE',
        body: { addressId }
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  /**
   * GET /api/addresses/default
   * Get default address
   */
  getDefaultAddress: async () => {
    try {
      return await apiRequest('/api/addresses/default');
    } catch (error) {
      console.error('Error fetching default address:', error);
      return null;
    }
  },

  /**
   * POST /api/addresses/:id/default
   * Set address as default
   */
  setDefaultAddress: async (addressId) => {
    try {
      return await apiRequest(`/api/addresses/${addressId}/default`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  },

  // ===== ORDERS API =====
  /**
   * GET /api/orders
   * Fetch user's orders
   */
  getOrders: async () => {
    try {
      return await apiRequest('/api/orders');
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  /**
   * POST /api/orders
   * Create new order
   */
  createOrder: async (orderData) => {
    try {
      return await apiRequest('/api/orders', {
        method: 'POST',
        body: orderData
      });
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * GET /api/orders/:id
   * Get order details
   */
  getOrderById: async (orderId) => {
    try {
      return await apiRequest(`/api/orders/${orderId}`);
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  /**
   * POST /api/orders/:id/cancel
   * Cancel order
   */
  cancelOrder: async (orderId) => {
    try {
      return await apiRequest(`/api/orders/${orderId}/cancel`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  // ===== USERS API =====
  /**
   * GET /api/users/me
   * Get current user profile
   */
  getUserProfile: async () => {
    try {
      return await apiRequest('/api/users/me');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  /**
   * PATCH /api/users/me
   * Update user profile
   */
  updateUserProfile: async (profileData) => {
    try {
      return await apiRequest('/api/users/me', {
        method: 'PATCH',
        body: profileData
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * GET /api/users/me/stats
   * Get user statistics
   */
  getUserStats: async () => {
    try {
      return await apiRequest('/api/users/me/stats');
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { totalOrders: 0, totalSpent: 0, wishlistCount: 0 };
    }
  },

  // ===== LEGACY SUPABASE ENDPOINTS (for products, categories, etc.) =====
  /**
   * GET /api/products
   * Fetch products with filtering, sorting, and search
   * 
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by category name (e.g., "Dog Food")
   * @param {string} params.sort - Sort order: "price-low", "price-high", "rating", "featured"
   * @param {string} params.search - Search term for name/description
   * @returns {Array} Array of product objects with category names
   * 
   * Response Format:
   * [
   *   {
   *     id: "uuid",
   *     name: "Product Name",
   *     description: "Product description",
   *     base_price_cents: 299900,
   *     compare_at_price_cents: 349900,
   *     images: ["url1", "url2"],
   *     category: "Dog Food", // Joined from categories table
   *     average_rating: 4.5,
   *     reviews_count: 127,
   *     is_featured: true,
   *     variants: [{ type: "size", options: ["1.5kg", "3kg"] }]
   *   }
   * ]
   */
  getProducts: async ({ category, sort, search } = {}) => {
    try {
      let endpoint = '/api/products?';
      const params = new URLSearchParams();

      if (category && category !== 'All') {
        // Find category ID by name
        const categories = await api.getCategories();
        const categoryObj = categories.find(cat => cat.name === category);
        if (categoryObj) {
          params.append('categoryId', categoryObj.id);
        }
      }

      if (search) {
        params.append('search', search);
      }

      endpoint += params.toString();

      const result = await apiRequest(endpoint);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  /**
   * GET /api/products/:slug (Updated to use direct queries instead of RPC)
   * CRITICAL: Frontend expects this exact data structure
   */
  getProductBySlug: async (slug) => {
    try {
      // Get product base data with category
      const { data: product, error: productError } = await supabase
        .from('products')
        .select(`
          id, name, slug, description, images, attributes,
          average_rating, reviews_count, is_featured, category_id,
          categories!inner(name)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (productError || !product) {
        console.error('Error fetching product by slug:', productError);
        return null;
      }

      // Get product variants
      const { data: variants, error: variantsError } = await supabase
        .from('product_variants')
        .select('id, sku, price_cents, stock_quantity, attributes')
        .eq('product_id', product.id);

      if (variantsError) {
        console.error('Error fetching variants:', variantsError);
      }

      // Get related products from same category
      const { data: relatedProducts, error: relatedError } = await supabase
        .from('products')
        .select('id, name, slug, images, average_rating')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .eq('is_active', true)
        .limit(4);

      if (relatedError) {
        console.error('Error fetching related products:', relatedError);
      }

      // Determine category type from attributes or category name
      const categoryType = product.attributes?.category_type ||
        (product.categories.name.toLowerCase().includes('food') ? 'Food' :
          product.categories.name.toLowerCase().includes('toy') ? 'Toys' : 'Accessories');

      // Transform variants to match expected structure
      const productVariants = (variants || []).map(variant => ({
        id: variant.id,
        variant_name: variant.attributes?.variant_name || 'Default',
        price_cents: variant.price_cents,
        compare_at_price_cents: variant.attributes?.compare_at_price_cents || null,
        sku: variant.sku,
        stock_quantity: variant.stock_quantity,
        attributes: variant.attributes
      }));

      // Transform related products to match expected structure
      const relatedProductsFormatted = (relatedProducts || []).map(rp => ({
        id: rp.id,
        name: rp.name,
        slug: rp.slug,
        images: rp.images,
        average_rating: rp.average_rating,
        min_price: null // We'd need to query variants for this, but it's optional
      }));

      // Build final result matching RPC structure
      const result = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        images: product.images,
        brand: product.attributes?.brand || 'Unknown Brand',
        category_name: product.categories.name,
        category_type: categoryType,
        attributes: product.attributes,
        average_rating: product.average_rating,
        reviews_count: product.reviews_count,
        is_featured: product.is_featured,
        productVariants: productVariants,
        relatedProducts: relatedProductsFormatted
      };

      // Transform for frontend consumption
      return {
        ...result,
        category: result.category_name,
        rating: result.average_rating || 0,
        reviewsCount: result.reviews_count || 0,
        // Extract rich specifications from attributes based on category
        specifications: extractSpecifications(result.attributes, result.category_type)
      };

    } catch (error) {
      console.error('Error in getProductBySlug:', error);
      return null;
    }
  },

  /**
   * Legacy support - redirect to slug-based lookup
   */
  getProductById: async (id) => {
    // First get the slug from ID
    const { data: product } = await supabase
      .from('products')
      .select('slug')
      .eq('id', id)
      .single();

    if (!product) return null;

    return api.getProductBySlug(product.slug);
  },

  /**
   * GET /api/categories
   * Fetch all product categories
   * 
   * @returns {Array} Array of category objects
   * 
   * Response Format:
   * [
   *   { id: "uuid", name: "Dog Food" },
   *   { id: "uuid", name: "Cat Food" }
   * ]
   */
  getCategories: async () => {
    try {
      const result = await apiRequest('/api/categories');
      return result.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  /**
   * GET /api/products/:id/reviews
   * Fetch reviews for a specific product
   * 
   * @param {string} productId - Product UUID
   * @returns {Array} Array of reviews with user information
   */
  getReviews: async (productId) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return (data || []).map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      images: review.images || [],
      user_name: 'Anonymous', // Simplified since profiles relationship is broken
      helpful_votes: review.helpful_votes || 0,
      created_at: review.created_at
    }));
  },

  /**
   * GET /api/products/:id/questions
   * Fetch Q&A for a specific product
   */
  getQuestions: async (productId) => {
    const { data, error } = await supabase
      .from('product_questions')
      .select(`
        *,
        profiles (full_name),
        product_answers (
          *,
          profiles (full_name)
        )
      `)
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }

    return (data || []).map(q => ({
      id: q.id,
      question: q.question,
      user_name: q.profiles?.full_name || 'Anonymous',
      created_at: q.created_at,
      answers: (q.product_answers || []).map(a => ({
        id: a.id,
        answer: a.answer,
        user_name: a.profiles?.full_name || 'Fur&Co Support',
        is_staff_reply: a.is_staff_reply || false,
        created_at: a.created_at
      }))
    }));
  },

  /**
   * POST /api/products/:id/questions
   * Add a new question for a product
   * 
   * @param {string} productId - Product UUID
   * @param {string} content - Question content
   * @param {string} userId - User UUID
   * @returns {Object|null} Created question object or null on error
   */
  addQuestion: async (productId, content, userId) => {
    if (!userId) {
      console.error('User must be logged in to ask a question');
      return null;
    }

    const { data, error } = await supabase
      .from('product_questions')
      .insert({
        product_id: productId,
        user_id: userId,
        question: content,
        is_approved: false // Requires moderation
      })
      .select(`
        *,
        profiles (full_name)
      `)
      .single();

    if (error) {
      console.error('Error adding question:', error);
      return null;
    }

    return {
      id: data.id,
      question: data.question,
      user_name: data.profiles?.full_name || 'You',
      created_at: data.created_at,
      answers: []
    };
  },

  /**
   * GET /api/orders (user-specific)
   * Fetch user's order history
   * 
   * @param {string} userId - User UUID
   * @returns {Array} Array of orders with embedded items
   */
  getOrders: async (userId) => {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return (data || []).map(order => ({
      ...order,
      items: order.items_data || [], // JSONB field with order items
      events: generateOrderEvents(order)
    }));
  },

  /**
   * GET /api/orders/:id
   * Fetch single order details
   */
  getOrderById: async (orderId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return {
      ...data,
      items: data.items_data || [],
      events: generateOrderEvents(data)
    };
  },

  // Additional endpoints for user management, referrals, etc.
  getUserProfile: async (userId) => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  getAddresses: async (userId) => {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
    return data;
  },

  getFeaturedProducts: async () => {
    try {
      const result = await apiRequest('/api/products?isFeatured=true&limit=6');
      return result.data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  getTrendingProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name)
      `)
      .eq('is_active', true)
      .order('reviews_count', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching trending products:', error);
      return [];
    }

    return (data || []).map(product => ({
      ...product,
      category: product.categories?.name || 'Uncategorized',
      rating: product.average_rating || 4.5,
      reviewsCount: product.reviews_count || 50
    }));
  },

  /**
   * GET /api/products/:id/variants
   * Fetch product variants for a specific product
   * 
   * @param {string} productId - Product UUID
   * @returns {Array} Array of product variants
   */
  getProductVariants: async (productId) => {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching product variants:', error);
      return [];
    }

    return (data || []).map(variant => ({
      id: variant.id,
      variant_name: variant.attributes?.variant_name || 'Default',
      price_cents: variant.price_cents,
      compare_at_price_cents: variant.attributes?.compare_at_price_cents || null,
      sku: variant.sku,
      stock_quantity: variant.stock_quantity,
      attributes: variant.attributes
    }));
  }
};

/**
 * Helper function to extract category-specific specifications
 * CRITICAL: Frontend expects these exact field names for each category
 */
function extractSpecifications(attributes, categoryType) {
  if (!attributes) return {};

  switch (categoryType) {
    case 'Food':
      return {
        ingredients: attributes.ingredients || [],
        nutritional_info: attributes.nutritional_info || [],
        usage_instructions: attributes.usage_instructions || '',
        safety_notes: attributes.safety_notes || [],
        suitable_for: attributes.suitable_for || []
      };

    case 'Toys':
      return {
        material: attributes.material || '',
        durability_level: attributes.durability_level || '',
        age_range: attributes.age_range || '',
        safety_notes: attributes.safety_notes || [],
        care_instructions: attributes.care_instructions || ''
      };

    case 'Accessories':
      return {
        material: attributes.material || '',
        color_variants: attributes.color_variants || [],
        size_guide: attributes.size_guide || '',
        care_instructions: attributes.care_instructions || '',
        warranty: attributes.warranty || ''
      };

    default:
      return attributes;
  }
}

/**
 * Helper function to generate order tracking events
 * Transforms order status into timeline events for UI
 */
function generateOrderEvents(order) {
  const status = order.status;

  return [
    {
      status: 'Order Placed',
      date: order.created_at,
      completed: true,
      description: 'Your order has been placed.'
    },
    {
      status: 'Processing',
      date: order.updated_at,
      completed: ['processing', 'shipped', 'in_transit', 'delivered'].includes(status),
      description: 'We are preparing your package.'
    },
    {
      status: 'Shipped',
      date: order.shipped_at || null,
      completed: ['shipped', 'in_transit', 'delivered'].includes(status),
      description: order.tracking_number ? `Tracking: ${order.tracking_number}` : 'Package is on the way.'
    },
    {
      status: 'Out for Delivery',
      date: null,
      completed: status === 'delivered',
      description: 'Agent is out for delivery.'
    },
    {
      status: 'Delivered',
      date: order.delivered_at || null,
      completed: status === 'delivered',
      description: 'Package delivered.'
    }
  ];
}
