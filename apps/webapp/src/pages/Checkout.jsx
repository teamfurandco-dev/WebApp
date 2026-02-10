import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, ShoppingBag, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@fur-co/utils';
import AddressSection from '@/components/checkout/AddressSection';
import PaymentSelector from '@/components/checkout/PaymentSelector';
import { api } from '@/services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const { switchMode, currentMode } = useTheme();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    switchMode('GATEWAY');
    if (!cartLoading && (!cart.items || cart.items.length === 0)) {
      navigate('/shop');
    }
  }, [switchMode, cart, cartLoading, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cart.items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        })),
        shippingAddressId: selectedAddressId,
        paymentMethod: paymentMethod
      };

      await api.createOrder(orderData);

      toast.success("Order placed successfully!");
      navigate('/account/orders');
    } catch (err) {
      console.error('Order placement failed:', err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isUnlimitedMode = currentMode === 'CORE';

  return (
    <div className={cn(
      "min-h-screen pb-20 relative overflow-x-hidden font-sans selection:bg-black/10 selection:text-black",
      isUnlimitedMode ? "bg-[#ffcc00]" : "bg-white"
    )}>

      {/* Premium Header */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10 pt-10 mb-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-60 transition-all mb-4"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Shop
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-peace-sans leading-none tracking-tighter mb-2 uppercase">
              Checkout
            </h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest opacity-60">
              Finalize your pet's premium haul
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-black flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 text-gray-400">Secure 256-bit SSL</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Checkout Flow */}
          <div className="lg:col-span-8 space-y-10">

            {/* 1. Delivery Address */}
            <section>
              <AddressSection
                selectedAddressId={selectedAddressId}
                onSelect={setSelectedAddressId}
              />
            </section>

            {/* 2. Payment Selection */}
            <section>
              <PaymentSelector
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
              />
            </section>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl relative overflow-hidden">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900 font-peace-sans uppercase tracking-tighter flex-shrink-0">
                <div className="p-2 bg-black rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-[#ffcc00]" />
                </div>
                Order Summary
              </h2>

              {/* Items Mini List */}
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items?.map(item => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                      <img
                        src={item.variant?.product?.images?.[0]?.url || '/placeholder-product.png'}
                        alt={item.variant?.product?.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[10px] text-gray-900 uppercase tracking-tight line-clamp-1">{item.variant?.product?.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.quantity} × {item.variant?.name}</p>
                    </div>
                    <div className="font-black text-sm text-gray-900">₹{(item.variant?.price * item.quantity / 100).toFixed(0)}</div>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4 border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{(cart.total / 100).toFixed(0)}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Grand Total</span>
                    <span className="text-4xl font-black text-gray-900 font-peace-sans leading-none tracking-tighter">₹{(cart.total / 100).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddressId || cartLoading}
                className="w-full bg-black text-[#ffcc00] hover:bg-gray-800 h-16 rounded-3xl text-lg font-black shadow-xl active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest group"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing
                  </div>
                ) : (
                  <>
                    Place Order <ArrowLeft className="ml-2 w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 leading-relaxed">
                By placing this order, you agree to Fur & Co's <Link to="/terms" className="text-black underline">Terms of Service</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
