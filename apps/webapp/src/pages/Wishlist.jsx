import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Heart, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@fur-co/utils';
import { toast } from 'sonner';

const WishlistItem = ({ product, onRemove, onAddToCart, isRemoving, isAddingToCart }) => {
  const primaryImage = product.images?.[0] || product.image;
  const hasDiscount = product.compare_at_price_cents > product.base_price_cents;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl bg-white">
        <div className="relative aspect-square overflow-hidden bg-[#FDFBF7]">
          <Link to={`/product/${product.id}`}>
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-lg">
              SALE
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {product.category}
            </p>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-serif font-semibold text-lg leading-tight text-black hover:text-furco-yellow transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_at_price_cents)}
              </span>
            )}
            <span className="text-xl font-bold text-furco-yellow">
              {formatPrice(product.base_price_cents)}
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onAddToCart(product)}
              disabled={isAddingToCart}
              className="flex-1 bg-black text-white hover:bg-furco-yellow hover:text-black transition-colors rounded-xl"
            >
              {isAddingToCart ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>

            <Button
              onClick={() => onRemove(product.id)}
              disabled={isRemoving}
              variant="outline"
              size="icon"
              className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl"
            >
              {isRemoving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyWishlist = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16 bg-white rounded-2xl border border-black/5"
  >
    <div className="w-20 h-20 mx-auto mb-6 bg-red-50/80 rounded-full flex items-center justify-center text-red-400">
      <Heart className="w-10 h-10" strokeWidth={2.5} />
    </div>
    <h2 className="text-2xl font-serif font-bold mb-3 text-black">Your wishlist is empty</h2>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      Save items you love to find them easily later. Start browsing and add your favorites!
    </p>
    <Button asChild className="bg-black text-white hover:bg-furco-yellow hover:text-black rounded-xl">
      <Link to="/products">
        <ShoppingBag className="w-4 h-4 mr-2" />
        Start Shopping
      </Link>
    </Button>
  </motion.div>
);

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(new Set());
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('GATEWAY');
  }, [switchMode]);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistLoading) return;

      setLoading(true);
      setError(null);

      try {
        const wishlistData = await api.getWishlistFull();
        const wishlistProducts = wishlistData.map(item => ({
          ...item.product,
          wishlistItemId: item.id,
          selectedVariant: item.variant
        }));
        setProducts(wishlistProducts);
      } catch (err) {
        console.error("Failed to fetch wishlist products:", err);
        setError("Failed to load wishlist items. Please try again.");
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistLoading]);

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingItems(prev => new Set(prev).add(productId));

    try {
      await removeFromWishlist(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      toast.error("Failed to remove item");
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(prev => new Set(prev).add(product.id));

    try {
      // Get product variants to find default variant
      const variants = await api.getProductVariants(product.id);
      const defaultVariant = variants[0]; // Use first variant as default

      if (!defaultVariant) {
        toast.error("Product variant not available");
        return;
      }

      await addToCart(product.id, defaultVariant.id, 1);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  if (loading || wishlistLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-furco-yellow mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 min-h-screen bg-[#FDFBF7]">
        <div className="text-center py-16 bg-white rounded-2xl border border-red-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50/80 rounded-full flex items-center justify-center text-red-400">
            <Heart className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="rounded-xl"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 min-h-screen bg-[#FDFBF7]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="p-3 md:p-4 bg-red-50/80 rounded-full text-red-400">
          <Heart className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-4xl font-serif font-bold text-black">My Wishlist</h1>
          {products.length > 0 && (
            <p className="text-muted-foreground mt-1">
              {products.length} {products.length === 1 ? 'item' : 'items'} saved
            </p>
          )}
        </div>
      </motion.div>

      {products.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <WishlistItem
              key={product.id}
              product={product}
              onRemove={handleRemoveFromWishlist}
              onAddToCart={handleAddToCart}
              isRemoving={removingItems.has(product.id)}
              isAddingToCart={addingToCart.has(product.id)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;