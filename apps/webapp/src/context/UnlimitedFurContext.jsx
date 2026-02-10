import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';

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
  const [serverWallet, setServerWallet] = useState(null);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);

  const wallet = useMemo(() => {
    // We calculate locally to ensure optimistic updates (like quantity changes) 
    // are reflected IMMEDIATELY. Since selectedProducts is synced with the server response
    // after every action, this remains accurate.
    const safeBudget = Number(budget) || 0;
    const spent = selectedProducts.reduce((sum, p) => {
      const price = Number(p.price) || 0;
      const qty = Number(p.quantity) || 0;
      return sum + (price * qty);
    }, 0);

    return {
      budget: safeBudget,
      spent,
      remaining: safeBudget - spent,
      canAddMore: spent < safeBudget
    };
  }, [budget, selectedProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.map(product => {
      // Check if product is in cart
      const cartItem = selectedProducts.find(p => p.productId === product.id);
      const inCart = !!cartItem;

      // For each variant, check if we can afford to add ONE MORE
      // This accounts for items already in the cart
      const affordableVariants = product.variants.filter(v => {
        if (v.stock <= 0) return false;

        // If this exact variant is already in cart, check if we can add one more
        if (cartItem && cartItem.variantId === v.id) {
          return v.price <= wallet.remaining;
        }

        // If not in cart, check if we can afford the first one
        return v.price <= wallet.remaining;
      });

      return {
        ...product,
        isAffordable: affordableVariants.length > 0,
        affordableVariants,
        inCart
      };
    });
  }, [allProducts, wallet.remaining, selectedProducts]);

  const initializeShop = useCallback(async (budgetValue, petTypeValue, modeValue) => {
    try {
      setLoading(true);
      const parsedBudget = Number(budgetValue) || 0;
      setBudget(parsedBudget);
      setPetType(petTypeValue);
      setMode(modeValue);

      const data = await api.unlimited.initShop(parsedBudget, petTypeValue);
      setAllProducts(data.products);
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to initialize shop:', error);
      toast.error('Failed to load shop. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productId, variantId, quantity = 1) => {
    const product = allProducts.find(p => p.id === productId);
    const variant = product.variants.find(v => v.id === variantId);

    if (!product || !variant) return;

    // Budget Guard: Check if we can afford the addition
    const addedCost = variant.price * quantity;
    if (quantity > 0 && wallet.remaining < addedCost) {
      toast.error("Not enough budget remaining!");
      return;
    }

    // Optimistic Update
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
      let response;
      if (!draftId) {
        // Create new draft
        response = await api.unlimited.createDraft({
          mode,
          budget,
          petType,
          products: [{ productId, variantId, quantity, price: variant.price }]
        });
        setDraftId(response.draftId);
      } else {
        // Update existing draft
        response = await api.unlimited.updateDraftProducts(draftId, {
          action: 'add',
          productId,
          variantId,
          quantity
        });
      }

      // Sync with server response
      if (response.wallet) setServerWallet(response.wallet);
      if (response.products) setSelectedProducts(response.products);

      toast.success('Added to box');
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('Failed to add product');
      // On error, we should ideally refetch the draft
    }
  }, [allProducts, budget, petType, mode, draftId]);

  const removeProduct = useCallback(async (productId, variantId) => {
    // Optimistic Remove
    setSelectedProducts(prev => prev.filter(p => !(p.productId === productId && p.variantId === variantId)));

    if (draftId) {
      try {
        const response = await api.unlimited.updateDraftProducts(draftId, {
          action: 'remove',
          productId,
          variantId,
          quantity: 0
        });

        // Sync with server response
        if (response.wallet) setServerWallet(response.wallet);
        if (response.products) setSelectedProducts(response.products);

        toast.success('Removed from box');
      } catch (error) {
        console.error('Failed to remove product:', error);
        toast.error('Failed to remove product');
      }
    }
  }, [draftId]);

  const activateMonthlyPlan = useCallback(async (addressId, paymentMethod, billingCycleDay) => {
    if (!draftId) throw new Error("No active plan to activate");

    try {
      setLoading(true);
      await api.unlimited.activateMonthlyPlan(draftId, {
        addressId,
        paymentMethod,
        billingCycleDay
      });
      toast.success('Monthly plan activated successfully!');
    } catch (error) {
      console.error('Failed to activate plan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [draftId]);

  const checkoutBundle = useCallback(async (addressId, paymentMethod) => {
    if (!draftId) throw new Error("No active bundle to checkout");

    try {
      setLoading(true);
      await api.unlimited.checkoutBundle(draftId, {
        addressId,
        paymentMethod
      });
      toast.success('Bundle ordered successfully!');
    } catch (error) {
      console.error('Failed to checkout bundle:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [draftId]);

  const syncDraft = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.unlimited.getDraft(id);

      // Update all state from the draft
      if (data.draft) {
        setDraftId(data.draft.id);
        setBudget(data.draft.budget);
        setPetType(data.draft.petType);
        setMode(data.draft.mode);
      }
      if (data.products) setSelectedProducts(data.products);
      if (data.wallet) setServerWallet(data.wallet);

      // Ensure shop catalog is initialized
      if (allProducts.length === 0 && data.draft) {
        const shopData = await api.unlimited.initShop(data.draft.budget, data.draft.petType);
        setAllProducts(shopData.products);
        setCategories(shopData.categories);
      }

    } catch (error) {
      console.error('Failed to sync draft:', error);
      toast.error('Failed to restore your box');
    } finally {
      setLoading(false);
    }
  }, [allProducts.length]);

  const reset = useCallback(() => {
    setAllProducts([]);
    setCategories([]);
    setBudget(0);
    setPetType('');
    setSelectedProducts([]);
    setDraftId(null);
    setMode(null);
    setServerWallet(null);
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
      activateMonthlyPlan,
      checkoutBundle,
      syncDraft,
      reset
    }}>
      {children}
    </UnlimitedFurContext.Provider>
  );
};
