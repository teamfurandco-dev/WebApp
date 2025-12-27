import { supabase } from '@/lib/supabase';

export const api = {
  // --- PRODUCTS ---
  getProducts: async ({ category, sort, search } = {}) => {
    let query = supabase.from('products').select('*').eq('is_active', true);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (sort) {
      if (sort === 'price-low') {
        query = query.order('base_price_cents', { ascending: true });
      } else if (sort === 'price-high') {
        query = query.order('base_price_cents', { ascending: false });
      } else if (sort === 'rating') {
        query = query.order('average_rating', { ascending: false });
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data;
  },

  getProductById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    return data;
  },

  // --- CATEGORIES ---
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data;
  },

  // --- ORDERS ---
  getOrders: async (userId) => {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_cents_at_purchase,
          products (id, name, images)
        ),
        shipments (id, status, tracking_number, carrier, shipped_at, delivered_at)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    // Transform to include tracking events
    return data.map(order => ({
      ...order,
      items: order.order_items.map(item => ({
        ...item,
        name: item.products?.name,
        image: item.products?.images?.[0]
      })),
      events: generateOrderEvents(order)
    }));
  },

  getOrderById: async (orderId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_cents_at_purchase,
          products (id, name, images)
        ),
        shipments (id, status, tracking_number, carrier, shipped_at, delivered_at)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return {
      ...data,
      items: data.order_items.map(item => ({
        ...item,
        name: item.products?.name,
        image: item.products?.images?.[0]
      })),
      events: generateOrderEvents(data)
    };
  },

  // --- PRODUCT Q&A ---
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }

    return data.map(q => ({
      ...q,
      full_name: q.profiles?.full_name || 'Anonymous',
      answers: (q.product_answers || []).map(a => ({
        ...a,
        full_name: a.profiles?.full_name || 'Fur&Co Support'
      }))
    }));
  },

  addQuestion: async (productId, content, userId) => {
    if (!userId) {
      console.error('User must be logged in to ask a question');
      return null;
    }

    const { data, error } = await supabase
      .from('product_questions')
      .insert({ product_id: productId, user_id: userId, content })
      .select()
      .single();

    if (error) {
      console.error('Error adding question:', error);
      return null;
    }
    return { ...data, full_name: 'You', answers: [] };
  },

  // --- REFERRALS ---
  getReferralStats: async (userId) => {
    if (!userId) return null;

    // Get user's referral code from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', userId)
      .single();

    // Get referrals made by this user
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    if (error) {
      console.error('Error fetching referrals:', error);
      return null;
    }

    const completedReferrals = referrals.filter(r => r.status === 'completed');
    const totalEarnings = completedReferrals.reduce((sum, r) => sum + (r.reward_cents || 0), 0);

    return {
      referral_code: profile?.referral_code || `FURCO_${userId.slice(0, 6).toUpperCase()}`,
      total_referrals: referrals.length,
      total_earnings: totalEarnings,
      referrals: referrals.map(r => ({
        id: r.id,
        user: r.referred_email || 'User',
        status: r.status === 'completed' ? 'Completed' : 'Pending',
        date: r.created_at,
        reward: r.reward_cents || 0
      }))
    };
  },

  // --- USER PROFILE ---
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

  // --- ADDRESSES ---
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

  // --- BLOG POSTS ---
  getBlogs: async ({ limit } = {}) => {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
    return data;
  },

  getBlogById: async (id) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
    return data;
  },

  // --- FEATURED/TRENDING PRODUCTS ---
  getFeaturedProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(6);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    return data;
  },

  getTrendingProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('reviews_count', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching trending products:', error);
      return [];
    }
    return data;
  }
};

// Helper function to generate order tracking events
function generateOrderEvents(order) {
  const shipment = order.shipments?.[0];
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
      date: shipment?.shipped_at || null, 
      completed: ['shipped', 'in_transit', 'delivered'].includes(status), 
      description: shipment?.tracking_number ? `Tracking: ${shipment.tracking_number}` : 'Package is on the way.' 
    },
    { 
      status: 'Out for Delivery', 
      date: null, 
      completed: status === 'delivered', 
      description: 'Agent is out for delivery.' 
    },
    { 
      status: 'Delivered', 
      date: shipment?.delivered_at || null, 
      completed: status === 'delivered', 
      description: 'Package delivered.' 
    }
  ];
}
