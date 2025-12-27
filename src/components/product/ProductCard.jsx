import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Bone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { formatPrice, cn } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] rounded-tr-[4rem] bg-white relative">
        
        {/* Badges - Speech Bubble Style */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.isNew && (
            <div className="bg-furco-yellow text-black px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md rounded-xl rounded-bl-none">
              New
            </div>
          )}
          {product.isBestSeller && !product.isNew && (
            <div className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md rounded-xl rounded-bl-none">
              Bestseller
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
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
        <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-[#FDFBF7] block">
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
        <CardContent className="flex-1 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{product.category}</span>
            <div className="flex items-center gap-1">
              <Bone className="h-3.5 w-3.5 fill-furco-yellow text-furco-yellow rotate-45" />
              <span className="text-sm font-bold text-black">{product.rating}</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="mb-2 block">
            <h3 className="font-serif font-bold text-xl leading-tight text-black group-hover:text-furco-gold transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="mt-auto pt-4 flex items-end justify-between gap-4">
            <div className="flex flex-col">
              {product.compare_at_price_cents > product.base_price_cents && (
                <span className="text-sm text-muted-foreground line-through decoration-black/30 font-medium">
                  {formatPrice(product.compare_at_price_cents)}
                </span>
              )}
              <span className="text-2xl font-bold text-furco-yellow">
                {formatPrice(product.base_price_cents)}
              </span>
            </div>

            {/* Add to Cart Button */}
            <Button 
              className="rounded-full w-12 h-12 p-0 bg-black text-white hover:bg-furco-yellow hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Add to Cart</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
