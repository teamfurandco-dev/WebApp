import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { api } from '@/services/api';

const UnlimitedFurContext = createContext(null);

export const useUnlimitedFur = () => {
  const context = useContext(UnlimitedFurContext);
  if (!context) throw new Error('useUnlimitedFur must be used within UnlimitedFurProvider');
  return context;
};

export const UnlimitedFurProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(0);
  const [petType, setPetType] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [draftId, setDraftId] = useState(null);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);

  const wallet = useMemo(() => {
    const spent = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    return {
      budget,
      spent,
      remaining: budget - spent,
      canAddMore: spent < budget
    };
  }, [budget, selectedProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.map(product => {
      const inCart = selectedProducts.some(p => p.productId === product.id);
      const affordableVariants = product.variants.filter(v => 
        v.price <= wallet.remaining && v.stock > 0
      );

      return {
        ...product,
        isAffordable: affordableVariants.length > 0 || inCart,
        affordableVariants,
        inCart
      };
    });
  }, [allProducts, wallet.remaining, selectedProducts]);

  const initializeShop = useCallback(async (budgetValue, petTypeValue, modeValue) => {
    try {
      setLoading(true);
      setBudget(budgetValue);
      setPetType(petTypeValue);
      setMode(modeValue);

      const data = await api.get(`/api/unlimited-fur/shop/init?budget=${budgetValue}&petType=${petTypeValue}`);
      setAllProducts(data.products);
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to initialize shop:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productId, variantId, quantity = 1) => {
    const product = allProducts.find(p => p.id === productId);
    const variant = product.variants.find(v => v.id === variantId);

    setSelectedProducts(prev => {
      const existing = prev.find(p => p.productId === productId && p.variantId === variantId);
      if (existing) {
        return prev.map(p =>
          p.productId === productId && p.variantId === variantId
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prev, { 
        productId, 
        variantId, 
        quantity, 
        price: variant.price, 
        name: product.name, 
        variantName: variant.name,
        image: product.images[0]?.url
      }];
    });

    try {
      if (!draftId) {
        const draft = await api.post('/api/unlimited-fur/draft/create', {
          mode,
          budget,
          petType,
          products: [{ productId, variantId, quantity, price: variant.price }]
        });
        setDraftId(draft.draftId);
      } else {
        await api.patch(`/api/unlimited-fur/draft/${draftId}/products`, {
          action: 'add',
          productId,
          variantId,
          quantity
        });
      }
    } catch (error) {
      setSelectedProducts(prev => prev.filter(p => !(p.productId === productId && p.variantId === variantId)));
      throw error;
    }
  }, [allProducts, budget, petType, mode, draftId]);

  const removeProduct = useCallback(async (productId, variantId) => {
    setSelectedProducts(prev => prev.filter(p => !(p.productId === productId && p.variantId === variantId)));

    if (draftId) {
      try {
        await api.patch(`/api/unlimited-fur/draft/${draftId}/products`, {
          action: 'remove',
          productId,
          variantId,
          quantity: 0
        });
      } catch (error) {
        console.error('Failed to sync removal:', error);
      }
    }
  }, [draftId]);

  const reset = useCallback(() => {
    setAllProducts([]);
    setCategories([]);
    setBudget(0);
    setPetType('');
    setSelectedProducts([]);
    setDraftId(null);
    setMode(null);
  }, []);

  return (
    <UnlimitedFurContext.Provider value={{
      allProducts,
      filteredProducts,
      categories,
      wallet,
      selectedProducts,
      budget,
      petType,
      mode,
      draftId,
      loading,
      initializeShop,
      addProduct,
      removeProduct,
      reset
    }}>
      {children}
    </UnlimitedFurContext.Provider>
  );
};
