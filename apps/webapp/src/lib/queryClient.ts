import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const QUERY_KEYS = {
  home: ['home'],
  products: (filters) => ['products', filters],
  product: (slug) => ['product', slug],
  categories: ['categories'],
  cart: ['cart'],
  cartSummary: ['cart', 'summary'],
  wishlist: ['wishlist'],
  wishlistFull: ['wishlist', 'full'],
  addresses: ['addresses'],
  orders: ['orders'],
  order: (id) => ['order', id],
  profile: ['profile'],
  profileDashboard: ['profile', 'dashboard'],
  checkoutSummary: ['checkout', 'summary'],
  blogs: (page) => ['blogs', page],
  blog: (slug) => ['blog', slug],
  blogCategories: ['blogCategories'],
  reviews: (productId) => ['reviews', productId],
  questions: (productId) => ['questions', productId],
  productVariants: (productId) => ['productVariants', productId],
  unlimitedProducts: ['unlimitedProducts'],
  unlimitedActivePlan: ['unlimitedActivePlan'],
};

export const STALE_TIMES = {
  home: 5 * 60 * 1000,
  products: 3 * 60 * 1000,
  product: 2 * 60 * 1000,
  cart: 30 * 1000,
  wishlist: 2 * 60 * 1000,
  blogList: 10 * 60 * 1000,
  blogPost: 10 * 60 * 1000,
  profile: 1 * 60 * 1000,
  checkout: 30 * 1000,
};
