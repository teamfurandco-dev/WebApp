import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, ShoppingBag, ShieldCheck, Loader2, Truck, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart as useCartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatPrice } from '@fur-co/utils';
import AddressSection from '@/components/checkout/AddressSection';
import { useCheckoutSummary } from '@/hooks/useQueries';
import useRazorpayCheckout from '@/hooks/useRazorpayCheckout';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: checkoutData, isLoading: checkoutLoading } = useCheckoutSummary();
  const { checkout: initiateRazorpay } = useRazorpayCheckout();
  const { addToCart: addToCartContext, ...cartContext } = useCartContext();
  
  const [loading, setLoading] = useState(false);
  const { switchMode } = useTheme();

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const cart = checkoutData?.cart || { items: [], totals: {} };
  const addresses = checkoutData?.addresses?.shipping || [];
  const totals = cart.totals || {};

  useEffect(() => {
    switchMode('GATEWAY');
  }, [switchMode]);

  useEffect(() => {
    if (!checkoutLoading && (!cart.items || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart.items, checkoutLoading, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    const amount = totals.total || 0;

    if (amount <= 0) {
      toast.error("Invalid order amount");
      return;
    }

    try {
      setLoading(true);

      await initiateRazorpay({
        amount,
        userEmail: user?.email,
        userPhone: user?.phone,
        shippingAddressId: selectedAddressId,
        customerNotes: localStorage.getItem('orderNotes') || undefined,
        onSuccess: (orderData) => {
          toast.success("Payment successful! Order placed.");
          cartContext.setCart({ items: [] });
          navigate('/order-success', { state: { order: orderData.order } });
        },
        onFailure: (error) => {
          toast.error(error || "Payment failed. Please try again.");
        }
      });
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getItemImage = (item) => {
    if (item.image) return item.image;
    if (item.variant?.image) return item.variant.image;
    if (item.product?.image) return item.product.image;
    return '/placeholder-product.jpg';
  };

  const getItemName = (item) => {
    return item.name || item.product?.name || item.variant?.product?.name || 'Product';
  };

  const getVariantName = (item) => {
    return item.variant?.name || item.selectedVariant || '';
  };

  if (checkoutLoading) {
    return (
      <div className="min-h-screen bg-furco-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-furco-yellow mx-auto mb-4" />
          <p className="text-black/40 font-medium text-sm uppercase tracking-wider">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-furco-cream pb-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 3c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-16 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z' fill='%23000'/%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-black/5 sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/cart"
              className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Back to Cart</span>
            </Link>
            <h1 className="text-xl font-peace-sans font-medium text-black">Checkout</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <section className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
              <h2 className="text-lg font-peace-sans font-medium text-black mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-furco-yellow" />
                Delivery Address
              </h2>
              <AddressSection
                selectedAddressId={selectedAddressId}
                onSelect={setSelectedAddressId}
              />
            </section>

            {/* Order Items */}
            <section className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
              <h2 className="text-lg font-peace-sans font-medium text-black mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-furco-yellow" />
                Order Items ({cart.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {cart.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-black/5 rounded-xl">
                    <div className="w-20 h-20 bg-furco-cream rounded-lg overflow-hidden shrink-0">
                      <img
                        src={getItemImage(item)}
                        alt={getItemName(item)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black truncate">{getItemName(item)}</h3>
                      <p className="text-sm text-black/40">{getVariantName(item)}</p>
                      <p className="text-xs text-black/40">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">{formatPrice(item.price_cents * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5 sticky top-24">
              <h2 className="text-lg font-peace-sans font-medium text-black mb-6">Order Summary</h2>

              {/* Cost Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black/60">Subtotal</span>
                  <span className="font-medium text-black">{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black/60">Shipping</span>
                  <span className="font-medium text-green-600">
                    {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black/60">Tax</span>
                  <span className="font-medium text-black">{formatPrice(totals.tax)}</span>
                </div>
                <div className="pt-3 border-t border-dashed border-black/10 flex justify-between items-center">
                  <span className="font-medium text-black">Total</span>
                  <span className="text-2xl font-peace-sans font-medium text-black">{formatPrice(totals.total)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddressId || checkoutLoading}
                className="w-full bg-furco-yellow text-black hover:bg-black hover:text-white h-14 rounded-xl font-medium shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </div>
                ) : (
                  `Pay ${formatPrice(totals.total)}`
                )}
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-black/5">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="text-[10px] font-medium text-black/60">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <RotateCcw className="w-5 h-5 text-green-500" />
                  <span className="text-[10px] font-medium text-black/60">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <ShieldCheck className="w-5 h-5 text-purple-500" />
                  <span className="text-[10px] font-medium text-black/60">Secure Pay</span>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-black/40">
                Payments secured by Razorpay
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
