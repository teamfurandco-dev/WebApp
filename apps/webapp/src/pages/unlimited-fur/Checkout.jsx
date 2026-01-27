import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnlimitedFur } from '@/context/UnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';
import { api } from '@/services/api';

const BUNDLE_DISCOUNT_RATE = 0.15;
const BUNDLE_MIN_PRODUCTS = 3;

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { selectedProducts, wallet, reset } = useUnlimitedFur();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [billingCycleDay, setBillingCycleDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    switchMode('CORE');
    fetchAddresses();
  }, [switchMode]);

  const fetchAddresses = async () => {
    try {
      const data = await api.get('/addresses');
      setAddresses(data);
      const defaultAddr = data.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

  const calculateDiscount = () => {
    if (mode === 'bundle' && selectedProducts.length >= BUNDLE_MIN_PRODUCTS) {
      return Math.floor(wallet.spent * BUNDLE_DISCOUNT_RATE);
    }
    return 0;
  };

  const discount = calculateDiscount();
  const total = wallet.spent - discount;

  const handleConfirm = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (mode === 'monthly') {
        reset();
        navigate('/unlimited-fur/monthly/success');
      } else {
        reset();
        navigate('/unlimited-fur/bundle/success');
      }
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDC520] text-gray-900 py-20 px-8 relative overflow-hidden font-sans selection:bg-black/10 selection:text-black">
      <UnlimitedBackground />
      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="text-4xl font-serif font-black mb-4 text-gray-900 text-center font-peace-sans">Checkout</h1>
        <p className="text-gray-700 text-lg text-center font-medium">Review and confirm your order</p>

        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-xl">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 font-peace-sans">
              <div className="p-2 bg-black rounded-lg">
                <Check className="w-5 h-5 text-[#EDC520]" />
              </div>
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Products ({selectedProducts.length})</span>
                <span className="font-black text-gray-900">₹{(wallet.spent / 100).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Bundle Discount (15%)</span>
                  <span>-₹{(discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-black/5 pt-4 flex justify-between text-2xl">
                <span className="font-black text-gray-900 uppercase tracking-tight">Total</span>
                <span className="font-black text-black">₹{(total / 100).toFixed(2)}</span>
              </div>
              {mode === 'monthly' && (
                <div className="bg-black text-[#EDC520] font-black rounded-xl p-4 text-xs uppercase tracking-wider text-center">
                  This amount will be charged monthly on day {billingCycleDay} of each month
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-xl">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 font-peace-sans">
              <div className="p-2 bg-black rounded-lg">
                <MapPin className="w-5 h-5 text-[#EDC520]" />
              </div>
              Delivery Address
            </h2>
            {addresses.length === 0 ? (
              <p className="text-white/60">No addresses found. Please add one.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={cn(
                      'w-full text-left p-4 rounded-lg border-2 transition-all',
                      selectedAddress === addr.id
                        ? 'border-black bg-white shadow-lg scale-[1.02]'
                        : 'border-white/60 bg-white/20 hover:border-black/20 hover:bg-white/30'
                    )}
                  >
                    <div className="font-black text-gray-900 mb-1">{addr.fullName}</div>
                    <div className="text-sm text-gray-600 font-medium">
                      {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Billing Cycle (Monthly only) */}
          {mode === 'monthly' && (
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 font-peace-sans">
                <div className="p-2 bg-black rounded-lg">
                  <Calendar className="w-5 h-5 text-[#EDC520]" />
                </div>
                Billing Cycle Day
              </h2>
              <select
                value={billingCycleDay}
                onChange={(e) => setBillingCycleDay(parseInt(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-900 font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm transition-all"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>Day {day} of each month</option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-xl">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900">
              <div className="p-2 bg-black rounded-lg">
                <CreditCard className="w-5 h-5 text-[#EDC520]" />
              </div>
              Payment Method
            </h2>
            <div className="space-y-3">
              {['cod', 'card', 'upi'].map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border-2 transition-all',
                    paymentMethod === method
                      ? 'border-black bg-white shadow-lg scale-[1.02]'
                      : 'border-white/60 bg-white/20 hover:border-black/20 hover:bg-white/30'
                  )}
                >
                  {method === 'cod' && 'Cash on Delivery'}
                  {method === 'card' && 'Credit/Debit Card'}
                  {method === 'upi' && 'UPI'}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          <Button
            onClick={handleConfirm}
            disabled={loading || !selectedAddress}
            className="w-full bg-black hover:bg-gray-800 text-white rounded-2xl py-7 text-xl font-black shadow-2xl transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? 'Processing...' : `Confirm ${mode === 'monthly' ? 'Monthly Plan' : 'Order'}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
