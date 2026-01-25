import { createContext, useContext, useState } from 'react';

const MockUnlimitedFurContext = createContext(null);

export const useMockUnlimitedFur = () => {
  const context = useContext(MockUnlimitedFurContext);
  if (!context) throw new Error('useMockUnlimitedFur must be used within MockUnlimitedFurProvider');
  return context;
};

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Dog Food - Chicken & Rice',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300',
    category: 'food',
    petTypes: ['dog'],
    description: 'High-quality nutrition for adult dogs'
  },
  {
    id: '2', 
    name: 'Interactive Puzzle Toy',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300',
    category: 'toys',
    petTypes: ['dog', 'cat'],
    description: 'Mental stimulation for smart pets'
  },
  {
    id: '3',
    name: 'Cozy Pet Bed - Large',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300',
    category: 'accessories',
    petTypes: ['dog', 'cat'],
    description: 'Ultra-comfortable sleeping solution'
  },
  {
    id: '4',
    name: 'Cat Treats - Salmon Flavor',
    price: 899,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=300',
    category: 'food',
    petTypes: ['cat'],
    description: 'Healthy and delicious cat treats'
  },
  {
    id: '5',
    name: 'Rope Chew Toy',
    price: 699,
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=300',
    category: 'toys',
    petTypes: ['dog'],
    description: 'Durable rope toy for heavy chewers'
  },
  {
    id: '6',
    name: 'Stainless Steel Food Bowl',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=300',
    category: 'accessories',
    petTypes: ['dog', 'cat'],
    description: 'Non-slip, easy to clean feeding bowl'
  },
  {
    id: '7',
    name: 'Catnip Mouse Toy Set',
    price: 599,
    image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300',
    category: 'toys',
    petTypes: ['cat'],
    description: 'Set of 3 catnip-filled mouse toys'
  },
  {
    id: '8',
    name: 'Adjustable Dog Collar',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300',
    category: 'accessories',
    petTypes: ['dog'],
    description: 'Comfortable, adjustable nylon collar'
  }
];

const CATEGORIES = [
  { id: 'food', name: 'Food & Treats', icon: '🍖' },
  { id: 'toys', name: 'Toys & Entertainment', icon: '🎾' },
  { id: 'accessories', name: 'Accessories & Care', icon: '🦴' }
];

export const MockUnlimitedFurProvider = ({ children }) => {
  const [mode, setMode] = useState(null); // 'monthly' | 'bundle'
  const [budget, setBudget] = useState(0);
  const [petType, setPetType] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calculate wallet state
  const wallet = {
    monthlyBudget: budget,
    spent: selectedProducts.reduce((total, item) => {
      const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0),
    get remaining() {
      return this.monthlyBudget - this.spent;
    },
    get canAddMore() {
      return this.remaining > 0;
    }
  };

  const startMonthlyPlan = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    setMode('monthly');
    setLoading(false);
    return 'mock-draft-id';
  };

  const startBundle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMode('bundle');
    setLoading(false);
    return 'mock-bundle-id';
  };

  const setBudgetAmount = async (newBudget) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setBudget(newBudget);
    setLoading(false);
  };

  const setPetTypeSelection = async (newPetType) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setPetType(newPetType);
    setLoading(false);
  };

  const setCategoriesSelection = async (categories) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setSelectedCategories(categories);
    setLoading(false);
  };

  const addProduct = async (productId, quantity = 1) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) {
      setLoading(false);
      throw new Error('Product not found');
    }

    // Check if adding this product would exceed budget
    const newCost = product.price * quantity;
    if (wallet.remaining < newCost) {
      setLoading(false);
      throw new Error('Not enough budget remaining');
    }

    // Check if product already exists, update quantity or add new
    const existingIndex = selectedProducts.findIndex(p => p.productId === productId);
    if (existingIndex >= 0) {
      const updated = [...selectedProducts];
      updated[existingIndex].quantity += quantity;
      setSelectedProducts(updated);
    } else {
      setSelectedProducts(prev => [...prev, { productId, quantity }]);
    }
    
    setLoading(false);
  };

  const removeProduct = async (productId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
    setLoading(false);
  };

  const getFilteredProducts = () => {
    return MOCK_PRODUCTS.filter(product => {
      // Filter by pet type
      if (petType && !product.petTypes.includes(petType)) return false;
      
      // Filter by selected categories
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      
      // Filter by budget (only show products user can afford)
      if (budget > 0 && product.price > wallet.remaining) return false;
      
      return true;
    });
  };

  const getSelectedProductsWithDetails = () => {
    return selectedProducts.map(item => {
      const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
      return {
        ...item,
        ...product,
        totalPrice: product.price * item.quantity
      };
    });
  };

  const reset = () => {
    setMode(null);
    setBudget(0);
    setPetType('');
    setSelectedCategories([]);
    setSelectedProducts([]);
  };

  const value = {
    mode,
    budget,
    petType,
    selectedCategories,
    selectedProducts: getSelectedProductsWithDetails(),
    wallet,
    loading,
    categories: CATEGORIES,
    products: getFilteredProducts(),
    startMonthlyPlan,
    startBundle,
    setBudget: setBudgetAmount,
    setPetType: setPetTypeSelection,
    setCategories: setCategoriesSelection,
    addProduct,
    removeProduct,
    reset,
  };

  return (
    <MockUnlimitedFurContext.Provider value={value}>
      {children}
    </MockUnlimitedFurContext.Provider>
  );
};
