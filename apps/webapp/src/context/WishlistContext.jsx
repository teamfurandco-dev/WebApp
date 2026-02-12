import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '@/services/api';
import { toast } from 'sonner';

const WishlistContext = createContext({});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist on user change
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const wishlistData = await api.getWishlist();
      setWishlist(wishlistData.map(item => ({
        id: item.id,
        productId: item.product_id,
        variantId: item.variant_id
      })));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Don't show toast here as it might triggered on page load unexpectedly
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  const toggleWishlist = async (productId, variantId = null) => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }

    try {
      setLoading(true);

      const existingItem = wishlist.find(item => item.productId === productId);

      if (existingItem) {
        await api.removeFromWishlist(existingItem.id);
        setWishlist(prev => prev.filter(item => item.id !== existingItem.id));
        toast.success('Removed from wishlist');
      } else {
        const newItem = await api.addToWishlist(productId, variantId);
        setWishlist(prev => [...prev, {
          id: newItem.id,
          productId: newItem.product_id,
          variantId: newItem.variant_id
        }]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId, variantId = null) => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }

    if (isInWishlist(productId)) {
      toast.info('Already in wishlist');
      return;
    }

    try {
      setLoading(true);
      const newItem = await api.addToWishlist(productId, variantId);
      setWishlist(prev => [...prev, {
        id: newItem.id,
        productId: newItem.product_id,
        variantId: newItem.variant_id
      }]);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    const existingItem = wishlist.find(item => item.productId === productId);
    if (!existingItem) return;

    try {
      setLoading(true);
      await api.removeFromWishlist(existingItem.id);
      setWishlist(prev => prev.filter(item => item.id !== existingItem.id));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist: wishlist.map(item => item.productId), // Keep exposure of product IDs for legacy components if any
      items: wishlist, // Expose full items for newer logic
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      loading,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};