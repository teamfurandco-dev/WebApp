import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { formatPrice, cn } from '@fur-co/utils';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const unlimitedSource = searchParams.get('source');

  const productUrl = unlimitedSource === 'unlimited'
    ? `/product/${product.id}?${searchParams.toString()}`
    : `/product/${product.id}`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    try {
      const variantId = product.variants?.[0]?.id;

      if (!variantId) {
        toast.error('Product options not found');
        return;
      }

      await addToCart(product.id, variantId, 1);
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden group border border-black/[0.03] shadow-none hover:shadow-xl transition-all duration-700 rounded-2xl md:rounded-[2.5rem] bg-white relative">

        {/* Optional: Subtle Label instead of speech bubble */}
        <div className="absolute top-3 left-3 md:top-6 md:left-6 z-20">
          {(product.isNew || product.is_featured) && (
            <div className="bg-furco-yellow text-black px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.1em] rounded-full shadow-sm">
              {product.isNew ? 'New' : 'Featured'}
            </div>
          )}
        </div>

        {/* Wishlist Button - Always visible on mobile */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const variantId = product.variants?.[0]?.id;
            toggleWishlist(product.id, variantId);
          }}
          className={cn(
            "absolute top-2 right-2 md:top-4 md:right-4 z-20 p-1.5 md:p-2.5 rounded-full bg-white/90 backdrop-blur-md transition-all duration-300 shadow-sm",
            isWishlisted
              ? "text-red-500 opacity-100 scale-110 shadow-md"
              : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 group-hover:translate-y-0 hover:bg-furco-yellow text-black"
          )}
          style={{ mixBlendMode: 'normal' }}
        >
          <Heart className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform duration-300", isWishlisted && "fill-current scale-110")} />
        </button>

        {/* Image Container with "Second Look" Effect */}
        <Link to={productUrl} className="relative aspect-square overflow-hidden bg-[#FDFBF7] block">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Optional: Second image overlay for hover if available */}
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>

        {/* Content */}
        <CardContent className="flex-1 p-3 md:p-6 flex flex-col space-y-1">
          <span className="text-[9px] md:text-[10px] text-black/40 font-medium uppercase tracking-widest">{product.category || 'Pet Care'}</span>

          <Link to={productUrl} className="mb-1 md:mb-2 block">
            <h3 className="font-normal text-sm md:text-base leading-tight text-black group-hover:text-furco-gold transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex flex-col">
            {product.compare_at_price_cents > product.base_price_cents && (
              <span className="text-xs md:text-sm text-black/30 line-through font-normal">
                {formatPrice(product.compare_at_price_cents)}
              </span>
            )}
            <span className="text-base md:text-lg font-medium text-black">
              {formatPrice(product.base_price_cents)}
            </span>
          </div>

          {/* Add to Cart - Always visible on mobile */}
          {unlimitedSource !== 'unlimited' && (
            <button
              disabled={isAdding}
              onClick={handleAddToCart}
              className="w-full md:w-10 md:absolute md:bottom-3 md:right-3 h-9 md:h-10 rounded-full bg-black/5 flex items-center justify-center md:justify-center gap-2 md:gap-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-furco-yellow text-black disabled:opacity-50 mt-1 md:mt-0 px-3 md:px-0"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 md:hidden" />
                  <span className="text-xs font-medium md:hidden">Add to Cart</span>
                  <ShoppingCart className="w-4 h-4 hidden md:block" />
                </>
              )}
            </button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
