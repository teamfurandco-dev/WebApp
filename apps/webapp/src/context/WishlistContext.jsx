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
      setWishlist(wishlistData.map(item => item.productId || item.product_id));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }

    try {
      setLoading(true);
      
      if (isInWishlist(productId)) {
        await api.removeFromWishlist(productId);
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success('Removed from wishlist');
      } else {
        await api.addToWishlist(productId);
        setWishlist(prev => [...prev, productId]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
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
      await api.addToWishlist(productId);
      setWishlist(prev => [...prev, productId]);
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

    try {
      setLoading(true);
      await api.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(id => id !== productId));
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
      wishlist, 
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