import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, Tag, Lock, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';
import { motion } from 'framer-motion';
import { formatPrice } from '@fur-co/utils';

const getItemImage = (item) => {
  // Handle different possible image structures
  if (item.images && item.images.length > 0) return item.images[0];
  if (item.variant?.product?.images && item.variant.product.images.length > 0) return item.variant.product.images[0];
  if (item.product?.images && item.product.images.length > 0) return item.product.images[0];
  if (item.image) return item.image;
  return '/placeholder-product.jpg'; // Fallback image
};

const getItemName = (item) => {
  return item.name || item.product?.name || item.variant?.product?.name || 'Product';
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setError(null);
        const products = await api.getProducts();
        // Mock cart with first 2 products
        const mockCart = products.slice(0, 2).map((product, index) => ({
          ...product,
          quantity: index + 1,
          selectedVariant: '1kg'
        }));
        setCartItems(mockCart);
      } catch (error) {
        console.error("Failed to load cart", error);
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = (id, delta) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotalCents = cartItems.reduce((sum, item) => sum + (item.base_price_cents * item.quantity), 0);
  const shippingCents = subtotalCents > 49900 ? 0 : 5000;
  const totalCents = subtotalCents + shippingCents;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <PawPrint className="w-12 h-12 text-furco-yellow animate-bounce" />
          <p className="text-lg font-serif text-black/60">Fetching your treats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7] text-center space-y-6 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <PawPrint className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-black">Oops! Something went wrong</h2>
        <p className="text-muted-foreground text-lg max-w-md">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-furco-yellow text-black hover:bg-black hover:text-white rounded-full px-8 py-6 text-lg font-bold transition-all duration-300">
          Try Again
        </Button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7] text-center space-y-6 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <PawPrint className="w-10 h-10 text-black/20" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-black">Your cart is empty</h2>
        <p className="text-muted-foreground text-lg max-w-md">Looks like you haven't added any goodies for your furry friend yet.</p>
        <Link to="/products">
          <Button className="bg-furco-yellow text-black hover:bg-black hover:text-white rounded-full px-8 py-6 text-lg font-bold transition-all duration-300">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FBBF24' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 md:px-6 pt-32 pb-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Cart Items (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-4xl font-serif font-bold text-black">
              Your Furry Finds <span className="text-black/40 text-2xl font-sans font-normal ml-2">({cartItems.length} items)</span>
            </h1>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-black/5 flex flex-col sm:flex-row gap-6 items-center sm:items-stretch"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-40 h-40 bg-gray-50 rounded-2xl overflow-hidden shrink-0 relative">
                    <img 
                      src={getItemImage(item)} 
                      alt={getItemName(item)} 
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-serif font-bold text-xl text-black mb-1">
                          <Link to={`/product/${item.id}`} className="hover:text-furco-yellow transition-colors">
                            {getItemName(item)}
                          </Link>
                        </h3>
                        <p className="text-black/40 font-medium text-sm bg-gray-100 inline-block px-3 py-1 rounded-full">
                          {item.selectedVariant || 'Default'}
                        </p>
                      </div>
                      <p className="font-bold text-2xl text-black">{formatPrice(item.base_price_cents * item.quantity)}</p>
                    </div>

                    <div className="flex justify-between items-end mt-6">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-gray-50 rounded-full p-1 border border-black/5">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-white text-black hover:bg-furco-yellow hover:text-white flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-bold text-black">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-furco-yellow text-black hover:bg-black hover:text-white flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-2 text-red-500/60 hover:text-red-500 font-medium text-sm transition-colors group/trash"
                      >
                        <Trash2 className="w-4 h-4 group-hover/trash:scale-110 transition-transform" />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-[2.5rem] shadow-xl border-t-[8px] border-furco-yellow p-8 md:p-10 relative overflow-hidden">
              {/* Decorative Background Blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-furco-yellow/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />

              <h2 className="text-2xl font-serif font-bold text-black mb-8 relative z-10">Order Summary</h2>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-black/60 font-medium">
                  <span>Subtotal</span>
                  <span className="text-black font-bold">{formatPrice(subtotalCents)}</span>
                </div>
                <div className="flex justify-between items-center text-black/60 font-medium">
                  <span>Shipping</span>
                  {shippingCents === 0 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Free</span>
                  ) : (
                    <span className="text-black font-bold">{formatPrice(shippingCents)}</span>
                  )}
                </div>
                <div className="flex justify-between items-center text-black/60 font-medium">
                  <span>Tax (Included)</span>
                  <span className="text-black font-bold">{formatPrice(Math.round(subtotalCents * 0.18))}</span>
                </div>

                <div className="my-8 border-t border-dashed border-black/10" />

                <div className="flex justify-between items-center">
                  <span className="text-xl font-serif font-bold text-black">Total</span>
                  <span className="text-4xl font-black text-black tracking-tight">{formatPrice(totalCents)}</span>
                </div>

                {/* Promo Code */}
                <div className="mt-8 mb-8">
                  <div className="relative flex items-center">
                    <Tag className="absolute left-4 w-4 h-4 text-black/40" />
                    <Input 
                      placeholder="Promo Code" 
                      className="pl-10 h-12 rounded-xl border-black/10 bg-gray-50 focus:bg-white transition-colors"
                    />
                    <Button className="absolute right-1 top-1 bottom-1 bg-furco-yellow text-black hover:bg-black hover:text-white rounded-lg px-4 font-bold transition-colors">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" className="block">
                  <Button className="w-full h-16 rounded-full bg-furco-yellow hover:bg-furco-yellow-hover text-white text-xl font-bold shadow-[0_10px_30px_rgba(251,191,36,0.4)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] transition-all duration-300 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                      Proceed to Checkout
                      <div className="flex items-center">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <PawPrint className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </span>
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>

                {/* Security Note */}
                <div className="mt-6 flex items-center justify-center gap-2 text-black/40 text-sm font-medium">
                  <Lock className="w-3 h-3" />
                  <span>Guaranteed Secure Checkout</span>
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