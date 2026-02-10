import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Heart, Bone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { formatPrice, cn } from '@fur-co/utils';
import { useWishlist } from '@/context/WishlistContext';
import { api } from '@/services/api';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const [isAdding, setIsAdding] = useState(false);
  const [searchParams] = useSearchParams();
  const unlimitedSource = searchParams.get('source');

  const productUrl = unlimitedSource === 'unlimited'
    ? `/product/${product.id}?${searchParams.toString()}`
    : `/product/${product.id}`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    try {
      // For quick-add, we assume the first variant if multiple exist
      const variantId = product.variants?.[0]?.id;

      if (!variantId) {
        toast.error('Product options not found');
        return;
      }

      await api.addToCart(product.id, variantId, 1);
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
      <Card className="h-full flex flex-col overflow-hidden group border border-black/[0.03] shadow-none hover:shadow-2xl transition-all duration-700 rounded-[2.5rem] bg-white relative">

        {/* Optional: Subtle Label instead of speech bubble */}
        <div className="absolute top-6 left-6 z-20">
          {(product.isNew || product.is_featured) && (
            <div className="bg-furco-yellow text-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] rounded-full shadow-sm">
              {product.isNew ? 'New' : 'Featured'}
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={cn(
            "absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-colors duration-300 transform translate-y-2 group-hover:translate-y-0",
            isWishlisted ? "text-red-500 opacity-100" : "opacity-0 group-hover:opacity-100 hover:bg-furco-yellow text-black"
          )}
        >
          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
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
        <CardContent className="flex-1 p-6 flex flex-col space-y-1">
          <span className="text-[10px] text-black/40 font-semibold uppercase tracking-widest">{product.category || 'Pet Care'}</span>

          <Link to={productUrl} className="mb-2 block">
            <h3 className="font-medium text-lg leading-tight text-black group-hover:text-furco-gold transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex flex-col">
            {product.compare_at_price_cents > product.base_price_cents && (
              <span className="text-sm text-black/20 line-through font-semibold">
                {formatPrice(product.compare_at_price_cents)}
              </span>
            )}
            <span className="text-lg font-bold text-black">
              {formatPrice(product.base_price_cents)}
            </span>
          </div>

          {/* Add to Cart - Minimal Icon */}
          {unlimitedSource !== 'unlimited' && (
            <button
              disabled={isAdding}
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-furco-yellow text-black disabled:opacity-50"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
