import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Calendar, ShoppingBag, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUnlimitedFur } from '@/context/UnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';
import { toast } from 'sonner';
import AddressSection from '@/components/checkout/AddressSection';
import PaymentSelector from '@/components/checkout/PaymentSelector';

const BUNDLE_DISCOUNT_RATE = 0.15;
const BUNDLE_MIN_PRODUCTS = 3;

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { selectedProducts, wallet, activateMonthlyPlan, checkoutBundle, loading: contextLoading } = useUnlimitedFur();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [billingCycleDay, setBillingCycleDay] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    switchMode('CORE');
    // If no products, redirect back to shop
    if (selectedProducts.length === 0 && !contextLoading) {
      navigate(`/unlimited-fur/${mode}/shop`);
    }
  }, [switchMode, selectedProducts.length, contextLoading, navigate, mode]);

  const calculateDiscount = () => {
    if (mode === 'bundle' && selectedProducts.length >= BUNDLE_MIN_PRODUCTS) {
      return Math.floor(wallet.spent * BUNDLE_DISCOUNT_RATE);
    }
    return 0;
  };

  const discount = calculateDiscount();
  const total = wallet.spent - discount;

  const handleConfirm = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address to complete your order.');
      return;
    }

    try {
      setLoading(true);

      if (mode === 'monthly') {
        await activateMonthlyPlan(selectedAddressId, paymentMethod, billingCycleDay);
        navigate('/unlimited-fur/monthly/success');
      } else {
        await checkoutBundle(selectedAddressId, paymentMethod);
        navigate('/unlimited-fur/bundle/success');
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      toast.error(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffcc00] text-gray-900 pb-20 relative overflow-x-hidden font-sans selection:bg-black/10 selection:text-black">
      <UnlimitedBackground />

      {/* Premium Header */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10 pt-10 mb-8">
        <Link
          to={`/unlimited-fur/${mode}/shop`}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-60 transition-all mb-4"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Shop
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-black/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-peace-sans leading-none tracking-tighter mb-2 uppercase">
              Secure Checkout
            </h1>
            <p className="text-gray-700 font-bold text-sm uppercase tracking-widest opacity-60">
              Confirm your {mode === 'monthly' ? 'Unlimited Routine' : 'One-time Bundle'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#ffcc00] bg-black flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">PCI Compliant & Secure</span>
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

            {/* 2. Billing Cycle (Monthly only) */}
            {mode === 'monthly' && (
              <section className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-xl overflow-hidden">
                <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 font-peace-sans uppercase tracking-tighter">
                  <div className="p-2 bg-black rounded-lg">
                    <Calendar className="w-5 h-5 text-[#ffcc00]" />
                  </div>
                  Subscription Settings
                </h2>
                <div className="space-y-4">
                  <Label htmlFor="billingCycle" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pick Monthly Renewal Date</Label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {[1, 5, 10, 15, 20, 25, 28].map(day => (
                      <button
                        key={day}
                        onClick={() => setBillingCycleDay(day)}
                        className={cn(
                          "py-3 rounded-xl font-black transition-all border-2",
                          billingCycleDay === day
                            ? "bg-black text-[#ffcc00] border-black"
                            : "bg-white/20 border-white/60 hover:border-black/20 text-gray-600"
                        )}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 bg-black/5 p-3 rounded-xl flex items-center gap-2">
                    <HelpCircle className="w-3 h-3 text-black" />
                    Your plan will renew on day {billingCycleDay} of every month. You can pause or cancel anytime.
                  </p>
                </div>
              </section>
            )}

            {/* 3. Payment Selection */}
            <section>
              <PaymentSelector
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
              />
            </section>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit">
            <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-2xl relative overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#ffcc00]/20 blur-3xl rounded-full" />

              <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900 font-peace-sans uppercase tracking-tighter flex-shrink-0">
                <div className="p-2 bg-black rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-[#ffcc00]" />
                </div>
                Your Plan
              </h2>

              {/* Items Mini List */}
              <div className="space-y-4 mb-8 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedProducts.map(p => (
                  <div key={`${p.productId}-${p.variantId}`} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-black/5">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[10px] text-gray-900 uppercase tracking-tight line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.quantity} × ₹{(p.price / 100).toFixed(0)}</p>
                    </div>
                    <div className="font-black text-xs text-gray-900">₹{((p.price * p.quantity) / 100).toFixed(0)}</div>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4 border-t border-black/10 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Box Total</span>
                  <span className="font-black text-gray-900">₹{(wallet.spent / 100).toFixed(0)}</span>
                </div>

                {mode === 'bundle' && discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-[10px] font-black uppercase tracking-widest">Special Discount (15%)</span>
                    <span className="font-black">-₹{(discount / 100).toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping</span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-green-100 text-green-700 rounded-lg">Free</span>
                </div>

                <div className="pt-4 border-t border-black/5 flex justify-between items-end">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Grand Total</span>
                    <span className="text-4xl font-black text-gray-900 font-peace-sans leading-none">₹{(total / 100).toFixed(0)}</span>
                  </div>
                  {mode === 'monthly' && (
                    <span className="text-[10px] font-black uppercase tracking-tight text-gray-400 bg-black/5 px-2 py-1 rounded-lg">/ Month</span>
                  )}
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirm}
                disabled={loading || !selectedAddressId}
                className="w-full bg-black text-[#ffcc00] hover:bg-gray-800 h-16 rounded-3xl text-lg font-black shadow-xl active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest group"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing
                  </div>
                ) : (
                  <>
                    Confirm Order <ArrowLeft className="ml-2 w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <p className="mt-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                By confirming, you agree to our <Link to="/terms" className="text-black underline">Terms of Care</Link> and data protection policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

