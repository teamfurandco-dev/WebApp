import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient, QUERY_KEYS, STALE_TIMES } from '@/lib/queryClient';

export const useHomeData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.home,
    queryFn: () => api.getHomeData(),
    staleTime: STALE_TIMES.home,
  });
};

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.products(params),
    queryFn: () => api.getProductsExplore(params),
    staleTime: STALE_TIMES.products,
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: QUERY_KEYS.product(slug),
    queryFn: () => api.getProductFull(slug),
    staleTime: STALE_TIMES.product,
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => api.getCategories(),
    staleTime: STALE_TIMES.products,
  });
};

export const useCart = () => {
  return useQuery({
    queryKey: QUERY_KEYS.checkoutSummary,
    queryFn: () => api.getCheckoutSummary(),
    staleTime: STALE_TIMES.cart,
  });
};

export const useWishlist = () => {
  return useQuery({
    queryKey: QUERY_KEYS.wishlistFull,
    queryFn: () => api.getWishlistFull(),
    staleTime: STALE_TIMES.wishlist,
  });
};

export const useAddresses = () => {
  return useQuery({
    queryKey: QUERY_KEYS.addresses,
    queryFn: () => api.getAddresses(),
    staleTime: STALE_TIMES.profile,
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: () => api.getOrders(),
    staleTime: STALE_TIMES.profile,
  });
};

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: QUERY_KEYS.order(orderId),
    queryFn: () => api.getOrderById(orderId),
    staleTime: STALE_TIMES.profile,
    enabled: !!orderId,
  });
};

export const useProfileDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.profileDashboard,
    queryFn: () => api.getProfileDashboard(),
    staleTime: STALE_TIMES.profile,
  });
};

export const useCheckoutSummary = () => {
  return useQuery({
    queryKey: QUERY_KEYS.checkoutSummary,
    queryFn: () => api.getCheckoutSummary(),
    staleTime: STALE_TIMES.checkout,
  });
};

export const useBlogList = (page = 1, categoryId = null) => {
  return useQuery({
    queryKey: QUERY_KEYS.blogs({ page, categoryId }),
    queryFn: () => api.getBlogPage({ page, categoryId }),
    staleTime: STALE_TIMES.blogList,
  });
};

export const useBlogPost = (slug) => {
  return useQuery({
    queryKey: QUERY_KEYS.blog(slug),
    queryFn: () => api.getBlogFull(slug),
    staleTime: STALE_TIMES.blogPost,
    enabled: !!slug,
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.blogCategories,
    queryFn: () => api.getBlogCategories(),
    staleTime: STALE_TIMES.blogList,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ variantId, quantity, productId }) => api.addToCart(productId, variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cartSummary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.checkoutSummary });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, quantity }) => api.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cartSummary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.checkoutSummary });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId) => api.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cartSummary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.checkoutSummary });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cartSummary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.checkoutSummary });
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, variantId }) => api.addToWishlist(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlistFull });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId) => api.removeFromWishlist(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlistFull });
    },
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (addressData) => api.addAddress(addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ addressId, addressData }) => api.updateAddress(addressId, addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (addressId) => api.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses });
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData) => api.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cartSummary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData) => api.updateUserProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profileDashboard });
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, data }) => api.createReview(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useAddQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, question }) => api.addQuestion(productId, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};

export const useRazorpayConfig = () => {
  return useQuery({
    queryKey: ['razorpayConfig'],
    queryFn: () => api.getRazorpayConfig(),
    staleTime: STALE_TIMES.products,
  });
};

export const useCreateRazorpayOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (amount) => api.razorpay.createOrder(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cartSummary });
    },
  });
};

export const useVerifyRazorpayPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentData) => api.razorpay.verify(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cartSummary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });
};
