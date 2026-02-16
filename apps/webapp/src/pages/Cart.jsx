import { useState, forwardRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import {
  Minus, Plus, Trash2, ArrowRight, Tag, Lock, PawPrint,
  ShoppingBag, ChevronRight, Truck, RotateCcw, Headphones, X, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '@fur-co/utils';
import { toast } from 'sonner';
import { useCart as useCartContext } from '@/context/CartContext';
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks/useQueries';

// Optimized helper to get item image
const getItemImage = (item) => {
  if (item.variant?.image) return item.variant.image;
  if (item.images && item.images.length > 0) return item.images[0];
  if (item.variant?.product?.images && item.variant.product.images.length > 0) return item.variant.product.images[0];
  if (item.product?.images && item.product.images.length > 0) return item.product.images[0];
  return '/placeholder-product.jpg';
};

const CartItem = forwardRef(({ item, onUpdateQuantity, onRemove }, ref) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const name = item.name || item.product?.name || item.variant?.product?.name || 'Product';
  const variantName = item.variant?.name || item.selectedVariant;
  const isLowStock = item.variant?.stock_quantity < 5;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-2xl p-3 md:p-6 shadow-lg md:shadow-2xl shadow-black/[0.02] border border-black/5 flex flex-col sm:flex-row gap-3 md:gap-6 items-start sm:items-center relative overflow-hidden"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-furco-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Product Image */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 bg-furco-cream rounded-xl md:rounded-2xl overflow-hidden shrink-0 relative shadow-inner">
        <img
          src={getItemImage(item)}
          alt={name}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between w-full relative z-10">
        <div className="flex justify-between items-start gap-2 md:gap-4 w-full">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-xl font-medium text-black mb-1 group-hover:text-furco-yellow transition-colors cursor-pointer line-clamp-2">
              {name}
            </h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2 items-center">
              {variantName && (
                <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-widest bg-black/5 px-2 md:px-3 py-0.5 rounded-full text-black/40">
                  {variantName}
                </span>
              )}
              <div className="flex items-center gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", isLowStock ? "bg-orange-500" : "bg-green-500")} />
                <span className={cn("text-[9px] md:text-[10px] font-medium uppercase tracking-wider", isLowStock ? "text-orange-500" : "text-green-500")}>
                  {isLowStock ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg md:text-2xl font-medium text-black">
              {formatPrice(item.base_price_cents * item.quantity)}
            </p>
            <p className="text-[9px] md:text-[10px] font-medium text-black/30">
              {formatPrice(item.base_price_cents)} ea
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-3 md:mt-6 gap-2">
          {/* Quantity and Actions */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex items-center bg-black/5 rounded-lg md:rounded-2xl p-0.5 md:p-1 border border-black/5">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white text-black hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <Minus className="w-3 md:w-3.5 h-3 md:h-3.5" />
              </button>
              <span className="w-6 md:w-10 text-center font-medium text-sm md:text-lg text-black">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-furco-yellow text-black hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-3 md:w-3.5 h-3 md:h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="flex items-center gap-1 md:gap-2 text-black/30 hover:text-red-500 font-medium text-[9px] md:text-[10px] uppercase tracking-wider transition-colors"
            >
              <Trash2 className="w-3 md:w-4 h-3 md:h-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const Cart = () => {
  const { switchMode } = useTheme();
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCartContext();
  
  const { data: cartData, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const updateQuantity = async (itemId, delta) => {
    const item = cartData?.cart?.items?.find(i => i.id === itemId);
    if (!item) return;

    const currentStock = item.variant?.stock_quantity || item.variant?.stock || 999;
    const newQty = Math.max(1, item.quantity + delta);
    
    if (newQty > currentStock) {
      toast.error(`Only ${currentStock} items available in stock`);
      return;
    }
    
    if (newQty === item.quantity) return;

    try {
      await updateCartItem.mutateAsync({ itemId, quantity: newQty });
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeFromCart.mutateAsync(itemId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const removeAll = async () => {
    try {
      await clearCart.mutateAsync();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  useEffect(() => {
    switchMode('GATEWAY');
  }, [switchMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-furco-cream flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-center space-y-4"
        >
          <PawPrint className="w-12 h-12 text-furco-yellow mx-auto" />
          <p className="font-medium text-black/40 uppercase tracking-wider text-xs">Loading...</p>
        </motion.div>
      </div>
    );
  }

  const items = cartData?.cart?.items || [];
  const recommendations = cartData?.cart?.recommendedProducts || [];

  const totals = cartData?.cart?.totals || { subtotal: 0, shipping: 0, tax: 0, total: 0, itemCount: 0 };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-furco-cream pt-12 pb-20 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 3c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-16 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z' fill='%23000'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }}
        />
        <div className="text-center space-y-6 md:space-y-8 relative z-10 px-6 max-w-sm">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl relative">
            <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-black/10" />
            <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-furco-yellow rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Plus className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-peace-sans font-medium text-black">Your Cart is Empty</h2>
            <p className="text-black/50 font-light text-sm md:text-base">Add some items to get started!</p>
          </div>
          <Link to="/products">
            <Button className="h-12 md:h-16 px-8 md:px-12 rounded-full bg-black text-white font-medium hover:bg-furco-yellow hover:text-black transition-all shadow-lg">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-furco-cream pt-12 pb-20 md:pt-16 relative overflow-hidden">
      {/* Repeating Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 3c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-16 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z' fill='%23000'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }}
      />

      <div className="container mx-auto px-3 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">

          {/* Main Content: Cart Items */}
          <div className="flex-1 space-y-4 md:space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-6">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-furco-yellow rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-5 h-5 md:w-8 md:h-8 text-black" />
                </div>
                <div>
                  <h1 className="text-xl md:text-4xl font-peace-sans font-medium text-black">Your Cart</h1>
                  <p className="text-black/40 font-medium text-xs md:text-[10px] uppercase tracking-wider mt-0.5 md:mt-1">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={removeAll}
                className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider text-red-500/60 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-3 md:space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Perfect Add-ons Section */}
            {recommendations.length > 0 && (
              <div className="pt-6 md:pt-10">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/10 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Sparkles className="w-3 md:w-4 h-3 md:h-4 text-green-500" />
                  </div>
                  <h2 className="text-base md:text-2xl font-peace-sans font-medium text-black">You may also like</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                  {recommendations.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg md:shadow-xl shadow-black/[0.02] border border-black/5 flex items-center gap-3 md:gap-4 group"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-furco-cream rounded-xl overflow-hidden shrink-0">
                        <img
                          src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs md:text-sm text-black truncate">{product.name}</h4>
                        <p className="text-[9px] md:text-[10px] font-medium text-black/40 mb-1 md:mb-2 truncate hidden md:block">{product.description?.substring(0, 30)}...</p>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs md:text-sm text-black">{formatPrice(product.price)}</span>
                          <button
                            onClick={async () => {
                                try {
                                  await addToCartContext(product.id, product.variantId);
                                  toast.success("Added!");
                                } catch (e) { toast.error("Failed"); }
                            }}
                            className="bg-furco-yellow/10 hover:bg-furco-yellow text-black px-2 md:px-4 py-1 rounded-full text-[9px] md:text-[10px] font-medium transition-all"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Order Summary */}
          <div className="w-full lg:w-[380px] lg:mt-20">
            <div className="sticky top-20 space-y-4 md:space-y-6">
              <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-10 shadow-xl md:shadow-2xl shadow-black/[0.03] border border-black/[0.02] relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 bg-furco-yellow/10 rounded-full blur-2xl md:blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-center justify-between mb-4 md:mb-8">
                  <h2 className="text-lg md:text-2xl font-peace-sans font-medium text-black">Summary</h2>
                </div>

                <div className="space-y-3 md:space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-black/40 font-medium text-xs uppercase tracking-wider">Subtotal</span>
                    <span className="font-medium text-sm md:text-lg text-black">{formatPrice(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/40 font-medium text-xs uppercase tracking-wider">Shipping</span>
                    {totals.shipping === 0 ? (
                      <span className="text-green-500 font-medium text-xs uppercase tracking-wider bg-green-500/5 px-2 py-0.5 rounded-full">Free</span>
                    ) : (
                      <span className="font-medium text-sm md:text-lg text-black">{formatPrice(totals.shipping)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/40 font-medium text-xs uppercase tracking-wider">Tax</span>
                    <span className="font-medium text-sm md:text-lg text-black">{formatPrice(totals.tax)}</span>
                  </div>

                  <div className="pt-4 md:pt-8 mt-2 md:mt-4 border-t border-dashed border-black/10">
                    <div className="flex justify-between items-end">
                      <span className="font-medium text-sm md:text-xl text-black">Total</span>
                      <div className="text-right">
                        <span className="text-xl md:text-3xl font-medium text-black tracking-tight block leading-none">{formatPrice(totals.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="pt-4 md:pt-6">
                    <Button
                      onClick={() => navigate('/checkout')}
                      className="w-full h-12 md:h-16 bg-furco-yellow text-black hover:bg-black hover:text-white rounded-xl font-medium text-sm md:text-base transition-all flex items-center justify-center gap-2 md:gap-4 group"
                    >
                      <Lock className="w-4 md:w-5 h-4 md:h-5" />
                      Checkout
                      <ArrowRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust Badges - Simplified for mobile */}
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg md:shadow-xl border border-black/5">
                <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                  <div className="flex flex-col items-center gap-1 md:gap-2">
                    <Truck className="w-4 md:w-5 h-4 md:h-5 text-blue-500" />
                    <span className="text-[9px] md:text-[10px] font-medium text-black/60">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-2">
                    <RotateCcw className="w-4 md:w-5 h-4 md:h-5 text-green-500" />
                    <span className="text-[9px] md:text-[10px] font-medium text-black/60">Easy Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-2">
                    <Headphones className="w-4 md:w-5 h-4 md:h-5 text-purple-500" />
                    <span className="text-[9px] md:text-[10px] font-medium text-black/60">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;