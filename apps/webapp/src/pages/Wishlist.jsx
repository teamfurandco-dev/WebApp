import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Heart, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@fur-co/utils';
import { toast } from 'sonner';
import { useWishlist, useAddToCart, useRemoveFromWishlist } from '@/hooks/useQueries';

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
            <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white px-2 py-0.5 md:py-1 text-[9px] md:text-xs font-medium rounded-lg">
              SALE
            </div>
          )}
        </div>

        <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
          <div className="space-y-1">
            <p className="text-[9px] md:text-[10px] text-black/40 font-medium uppercase tracking-wider">
              {product.category}
            </p>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-medium text-sm md:text-base leading-tight text-black hover:text-furco-yellow transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {hasDiscount && (
              <span className="text-xs md:text-sm text-black/30 line-through">
                {formatPrice(product.compare_at_price_cents)}
              </span>
            )}
            <span className="text-base md:text-xl font-medium text-black">
              {formatPrice(product.base_price_cents)}
            </span>
          </div>

          <div className="flex gap-2 pt-1 md:pt-2">
            <Button
              onClick={() => onAddToCart(product)}
              disabled={isAddingToCart}
              className="flex-1 bg-black text-white hover:bg-furco-yellow hover:text-black transition-colors rounded-xl h-9 md:h-10 text-xs md:text-sm"
            >
              {isAddingToCart ? (
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </Button>

            <Button
              onClick={() => onRemove(product.id)}
              disabled={isRemoving}
              variant="outline"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl"
            >
              {isRemoving ? (
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
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
    className="text-center py-12 md:py-16 bg-white rounded-2xl border border-black/5"
  >
    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-red-50/80 rounded-full flex items-center justify-center text-red-400">
      <Heart className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
    </div>
    <h2 className="text-xl md:text-2xl font-medium mb-2 md:mb-3 text-black">Your Wishlist is Empty</h2>
    <p className="text-black/50 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
      Save items you love to find them easily later.
    </p>
    <Button asChild className="bg-black text-white hover:bg-furco-yellow hover:text-black rounded-xl h-10 md:h-12 px-6 md:px-8">
      <Link to="/products">
        <ShoppingBag className="w-4 h-4 mr-2" />
        Browse Products
      </Link>
    </Button>
  </motion.div>
);

const Wishlist = () => {
  const { switchMode } = useTheme();
  const { data: wishlistData, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const products = wishlistData?.map(item => ({
    ...item.product,
    wishlistItemId: item.id,
    selectedVariant: item.variant
  })) || [];

  useEffect(() => {
    switchMode('GATEWAY');
  }, [switchMode]);

  const handleRemoveFromWishlist = async (productId) => {
    const item = wishlistData?.find(w => w.product?.id === productId);
    if (!item) return;
    
    try {
      await removeFromWishlist.mutateAsync(item.id);
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const defaultVariant = product.selectedVariant || product.variants?.[0];
      if (!defaultVariant) {
        toast.error("Product variant not available");
        return;
      }
      await addToCartMutation.mutateAsync({ 
        productId: product.id, 
        variantId: defaultVariant.id, 
        quantity: 1 
      });
      toast.success("Added to cart");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-furco-yellow mx-auto mb-3 md:mb-4" />
          <p className="text-black/50 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-3 md:px-6 py-8 md:py-12 min-h-screen bg-[#FDFBF7]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8"
      >
        <div className="p-2 md:p-3 bg-red-50/80 rounded-full text-red-400">
          <Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-peace-sans font-medium text-black">My Wishlist</h1>
          {products.length > 0 && (
            <p className="text-black/50 text-sm mt-0.5">
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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6"
        >
          {products.map((product) => (
            <WishlistItem
              key={product.id}
              product={product}
              onRemove={handleRemoveFromWishlist}
              onAddToCart={handleAddToCart}
              isRemoving={removeFromWishlist.isPending}
              isAddingToCart={addToCartMutation.isPending}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;