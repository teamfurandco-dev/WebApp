import { useState, useEffect, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import {
  Minus, Plus, Trash2, ArrowRight, Tag, Lock, PawPrint,
  ShoppingBag, ChevronRight, Truck, RotateCcw, Headphones, X, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '@fur-co/utils';
import { toast } from 'sonner';

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
      className="group bg-white rounded-2xl p-6 shadow-2xl shadow-black/[0.02] border border-black/5 flex flex-col sm:flex-row gap-6 items-center sm:items-stretch relative overflow-hidden"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-furco-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Product Image */}
      <div className="w-full sm:w-44 h-44 bg-furco-cream rounded-2xl overflow-hidden shrink-0 relative shadow-inner">
        <img
          src={getItemImage(item)}
          alt={name}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between w-full relative z-10">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-medium text-black mb-1 group-hover:text-furco-yellow transition-colors cursor-pointer">
              {name}
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
              {variantName && (
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/5 px-3 py-1 rounded-full text-black/40">
                  {variantName}
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isLowStock ? "bg-orange-500" : "bg-green-500")} />
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", isLowStock ? "text-orange-500" : "text-green-500")}>
                  {isLowStock ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-black">
              {formatPrice(item.base_price_cents * item.quantity)}
            </p>
            <p className="text-[10px] font-bold text-black/20 uppercase tracking-tighter">
              {formatPrice(item.base_price_cents)} ea
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-8">
          {/* Quantity and Actions */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center bg-black/5 rounded-2xl p-1 border border-black/5">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-10 h-10 rounded-xl bg-white text-black hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center font-bold text-lg text-black">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-10 h-10 rounded-xl bg-furco-yellow text-black hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onRemove(item.id)}
                className="flex items-center gap-2 text-black/30 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest transition-colors group/trash"
              >
                <Trash2 className="w-4 h-4 group-hover/trash:scale-110 transition-transform" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { switchMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    switchMode('GATEWAY');
    fetchCart();
  }, [switchMode]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await api.getCartSummaryOptimized();
      setCartData(data);
    } catch (error) {
      console.error("Failed to load cart", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, delta) => {
    const item = cartData.items.find(i => i.id === itemId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    if (newQty === item.quantity) return;

    // Optimistic Update
    setCartData(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === itemId ? { ...i, quantity: newQty } : i)
    }));

    try {
      await api.updateCartItem(itemId, newQty);
      // Re-fetch to get accurate totals
      const refreshed = await api.getCartSummaryOptimized();
      setCartData(refreshed);
    } catch (error) {
      toast.error("Failed to update quantity");
      fetchCart(); // Revert
    }
  };

  const removeItem = async (itemId) => {
    // Optimistic Update
    setCartData(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId)
    }));

    try {
      await api.removeFromCart(itemId);
      const refreshed = await api.getCartSummaryOptimized();
      setCartData(refreshed);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
      fetchCart(); // Revert
    }
  };

  const removeAll = async () => {
    try {
      await api.clearCart();
      setCartData({ items: [], totals: { subtotal: 0, shipping: 0, tax: 0, total: 0 } });
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-furco-cream flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-center space-y-4"
        >
          <PawPrint className="w-16 h-16 text-furco-yellow mx-auto" />
          <p className="font-bold text-black/40 uppercase tracking-widest text-xs">Barking up your cart...</p>
        </motion.div>
      </div>
    );
  }

  const items = cartData?.items || [];
  const recommendations = cartData?.recommendedProducts || [];

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => acc + (item.base_price_cents * item.quantity), 0);
    const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 500; // Free over $50
    const tax = Math.round(subtotal * 0.08); // 8% estimate
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const localTotals = calculateTotals();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-furco-cream pt-16 pb-20 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 3c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-16 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z' fill='%23000'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }}
        />
        <div className="text-center space-y-8 relative z-10 px-6">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl relative">
            <ShoppingBag className="w-12 h-12 text-black/10" />
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-furco-yellow rounded-full flex items-center justify-center animate-bounce">
              <Plus className="w-6 h-6 text-black" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-peace-sans text-black">Your Cart is Empty</h2>
            <p className="text-black/40 font-medium">Looks like your furry friend is waiting for some treats!</p>
          </div>
          <Link to="/shop">
            <Button className="h-16 px-10 rounded-full bg-black text-white font-black uppercase tracking-[0.1em] hover:bg-furco-yellow hover:text-black transition-all shadow-xl">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-furco-cream pt-16 pb-20 relative overflow-hidden">
      {/* Repeating Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 3c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-16 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z' fill='%23000'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Main Content: Cart Items */}
          <div className="flex-1 space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-furco-yellow rounded-3xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-peace-sans text-black">Your Cart</h1>
                  <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">
                    Cart Items <span className="text-black">({items.length})</span>
                  </p>
                </div>
              </div>
              <button
                onClick={removeAll}
                className="text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
              >
                Remove all
              </button>
            </div>

            <div className="space-y-6">
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
              <div className="pt-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-peace-sans text-black">Perfect Add-ons</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl p-4 shadow-xl shadow-black/[0.02] border border-black/5 flex items-center gap-4 group"
                    >
                      <div className="w-24 h-24 bg-furco-cream rounded-2xl overflow-hidden shrink-0">
                        <img
                          src={product.images?.[0] || product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-black truncate">{product.name}</h4>
                        <p className="text-[10px] font-medium text-black/40 mb-2 truncate">{product.description?.substring(0, 40)}...</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-black">{formatPrice(product.price)}</span>
                          <button
                            onClick={async () => {
                              try {
                                await api.addToCart(product.id, product.variantId);
                                fetchCart();
                                toast.success("Added add-on to cart!");
                              } catch (e) { toast.error("Failed to add"); }
                            }}
                            className="bg-furco-yellow/10 hover:bg-furco-yellow text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Add +
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
          <div className="w-full lg:w-[420px]">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white rounded-2xl p-10 shadow-2xl shadow-black/[0.03] border border-black/[0.02] relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-furco-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-peace-sans text-black">Order Summary</h2>
                  <Link to="/shop">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors group">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rotate-180" />
                      Back to Shop
                    </button>
                  </Link>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-black/40 font-bold text-xs uppercase tracking-widest">Subtotal</span>
                    <span className="font-bold text-lg text-black">{formatPrice(localTotals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/40 font-bold text-xs uppercase tracking-widest">Shipping estimate</span>
                    {localTotals.shipping === 0 ? (
                      <span className="text-green-500 font-black text-xs uppercase tracking-[0.2em] bg-green-500/5 px-3 py-1 rounded-full">Free</span>
                    ) : (
                      <span className="font-bold text-lg text-black">{formatPrice(localTotals.shipping)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/40 font-bold text-xs uppercase tracking-widest">Tax estimate</span>
                    <span className="font-bold text-lg text-black">{formatPrice(localTotals.tax)}</span>
                  </div>

                  <div className="pt-8 mt-4 border-t border-dashed border-black/10">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-xl text-black">Total</span>
                      <div className="text-right">
                        <span className="text-3xl font-black text-black tracking-tighter block leading-none">{formatPrice(localTotals.total)}</span>
                        <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest mt-2">{formatPrice(localTotals.total / 100)} / Month available</p>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="pt-10">
                    <div className="relative group">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 group-focus-within:text-furco-yellow transition-colors" />
                      <input
                        placeholder="PROMO CODE"
                        className="w-full h-14 bg-black/5 rounded-2xl pl-12 pr-24 font-bold text-black uppercase tracking-[0.2em] text-xs outline-none focus:bg-white border-2 border-transparent focus:border-furco-yellow transition-all"
                      />
                      <button className="absolute right-2 top-2 bottom-2 bg-black text-white hover:bg-furco-yellow hover:text-black px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/10">
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="pt-6">
                    <Button
                      onClick={() => navigate('/checkout')}
                      className="w-full h-20 bg-furco-yellow text-black hover:bg-black hover:text-white rounded-xl font-bold text-xl uppercase tracking-[0.1em] shadow-xl shadow-furco-yellow/20 hover:shadow-black/20 transition-all flex items-center justify-center gap-4 group"
                    >
                      <Lock className="w-5 h-5" />
                      Secure Checkout
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </Button>
                    <div className="flex items-center justify-center gap-3 mt-6 opacity-30">
                      <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">SSL Encrypted Payment</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl p-8 shadow-xl shadow-black/[0.02] border border-black/5 divide-y divide-black/5">
                <div className="flex items-center gap-5 pb-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-black">Free Shipping</h4>
                    <p className="text-[10px] font-medium text-black/40 italic">On all orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 py-6">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-black">Easy Returns</h4>
                    <p className="text-[10px] font-medium text-black/40 italic">30-day money back guarantee</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 pt-6">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-black">24/7 Support</h4>
                    <p className="text-[10px] font-medium text-black/40 italic">Expert pet advice anytime</p>
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