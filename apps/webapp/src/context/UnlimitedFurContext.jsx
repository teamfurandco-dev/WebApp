import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

const UnlimitedFurContext = createContext(null);

export const useUnlimitedFur = () => {
  const context = useContext(UnlimitedFurContext);
  if (!context) throw new Error('useUnlimitedFur must be used within UnlimitedFurProvider');
  return context;
};

export const UnlimitedFurProvider = ({ children }) => {
  const [mode, setMode] = useState(null); // 'monthly' | 'bundle'
  const [draftId, setDraftId] = useState(null);
  const [budget, setBudgetState] = useState(0);
  const [petType, setPetTypeState] = useState('');
  const [selectedCategories, setSelectedCategoriesState] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [wallet, setWallet] = useState({ monthlyBudget: 0, spent: 0, remaining: 0, canAddMore: true });
  const [loading, setLoading] = useState(false);

  const startMonthlyPlan = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/unlimited-fur/monthly-plan/draft', {});
      setDraftId(response.id);
      setMode('monthly');
      return response.id;
    } catch (error) {
      console.error('Failed to start monthly plan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const startBundle = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/unlimited-fur/bundle/draft', {});
      setDraftId(response.id);
      setMode('bundle');
      return response.id;
    } catch (error) {
      console.error('Failed to start bundle:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setBudget = async (newBudget) => {
    if (!draftId) throw new Error('No draft ID');
    try {
      setLoading(true);
      const endpoint = mode === 'monthly' 
        ? `/api/unlimited-fur/monthly-plan/${draftId}/budget`
        : `/api/unlimited-fur/bundle/${draftId}/budget`;
      await api.put(endpoint, { monthlyBudget: newBudget });
      setBudgetState(newBudget);
      await getWallet();
    } catch (error) {
      console.error('Failed to set budget:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setPetType = async (newPetType) => {
    if (!draftId) throw new Error('No draft ID');
    try {
      setLoading(true);
      const endpoint = mode === 'monthly'
        ? `/api/unlimited-fur/monthly-plan/${draftId}/pet-profile`
        : `/api/unlimited-fur/bundle/${draftId}/pet-profile`;
      await api.put(endpoint, { petType: newPetType });
      setPetTypeState(newPetType);
    } catch (error) {
      console.error('Failed to set pet type:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setCategories = async (categories) => {
    if (!draftId) throw new Error('No draft ID');
    try {
      setLoading(true);
      const endpoint = mode === 'monthly'
        ? `/api/unlimited-fur/monthly-plan/${draftId}/categories`
        : `/api/unlimited-fur/bundle/${draftId}/categories`;
      await api.put(endpoint, { selectedCategories: categories });
      setSelectedCategoriesState(categories);
    } catch (error) {
      console.error('Failed to set categories:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productId, variantId, quantity = 1) => {
    if (!draftId) throw new Error('No draft ID');
    try {
      setLoading(true);
      const endpoint = mode === 'monthly'
        ? `/api/unlimited-fur/monthly-plan/${draftId}/products`
        : `/api/unlimited-fur/bundle/${draftId}/products`;
      await api.post(endpoint, { productId, variantId, quantity });
      await getWallet();
      // Refresh selected products list
      setSelectedProducts(prev => [...prev, { productId, variantId, quantity }]);
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId) => {
    if (!draftId) throw new Error('No draft ID');
    try {
      setLoading(true);
      const endpoint = mode === 'monthly'
        ? `/api/unlimited-fur/monthly-plan/${draftId}/products/${productId}`
        : `/api/unlimited-fur/bundle/${draftId}/products/${productId}`;
      await api.delete(endpoint);
      await getWallet();
      setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
    } catch (error) {
      console.error('Failed to remove product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getWallet = async () => {
    if (!draftId) return;
    try {
      const endpoint = mode === 'monthly'
        ? `/api/unlimited-fur/monthly-plan/${draftId}/wallet`
        : `/api/unlimited-fur/bundle/${draftId}/wallet`;
      const response = await api.get(endpoint);
      setWallet(response);
      return response;
    } catch (error) {
      console.error('Failed to get wallet:', error);
      throw error;
    }
  };

  const reset = () => {
    setMode(null);
    setDraftId(null);
    setBudgetState(0);
    setPetTypeState('');
    setSelectedCategoriesState([]);
    setSelectedProducts([]);
    setWallet({ monthlyBudget: 0, spent: 0, remaining: 0, canAddMore: true });
  };

  const value = {
    mode,
    draftId,
    budget,
    petType,
    selectedCategories,
    selectedProducts,
    wallet,
    loading,
    startMonthlyPlan,
    startBundle,
    setBudget,
    setPetType,
    setCategories,
    addProduct,
    removeProduct,
    getWallet,
    reset,
  };

  return (
    <UnlimitedFurContext.Provider value={value}>
      {children}
    </UnlimitedFurContext.Provider>
  );
};
