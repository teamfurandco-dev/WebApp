import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import usersData from '../data/users.json';
import ordersData from '../data/orders.json';

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  getProducts: async ({ category, sort, search } = {}) => {
    await delay(500);
    let filtered = [...productsData];

    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((p) => 
        p.name.toLowerCase().includes(lowerSearch) || 
        p.description.toLowerCase().includes(lowerSearch)
      );
    }

    if (sort) {
      if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }
    }

    return filtered;
  },

  getProductById: async (id) => {
    await delay(300);
    return productsData.find((p) => p.id === id);
  },

  getCategories: async () => {
    await delay(300);
    return categoriesData;
  },

  getUserProfile: async (userId = 'user_123') => {
    await delay(300);
    return usersData.find((u) => u.id === userId);
  },

  getOrders: async (userId = 'user_123') => {
    await delay(500);
    return ordersData.filter((o) => o.userId === userId);
  },

  login: async (email, password) => {
    await delay(800);
    // Mock login - accept any email/password for now, return the first user
    return usersData[0];
  }
};
