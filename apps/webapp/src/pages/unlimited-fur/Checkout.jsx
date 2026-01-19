import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockUnlimitedFur } from '@/context/MockUnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';

const BUNDLE_DISCOUNT_RATE = 0.15;
const BUNDLE_MIN_PRODUCTS = 3;

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { selectedProducts, wallet, reset } = useMockUnlimitedFur();

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
    <div className="min-h-screen bg-[#1A1B23] text-white py-20 px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif font-medium mb-4">Checkout</h1>
          <p className="text-white/60 text-lg">Review and confirm your order</p>
        </motion.div>

        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-[#D4AF37]" />
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Products ({selectedProducts.length})</span>
                <span className="font-bold">₹{(wallet.spent / 100).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Bundle Discount (15%)</span>
                  <span>-₹{(discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3 flex justify-between text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-[#D4AF37]">₹{(total / 100).toFixed(2)}</span>
              </div>
              {mode === 'monthly' && (
                <div className="bg-[#D4AF37]/10 rounded-lg p-3 text-sm text-[#D4AF37]">
                  This amount will be charged monthly on day {billingCycleDay} of each month
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
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
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <div className="font-bold mb-1">{addr.fullName}</div>
                    <div className="text-sm text-white/60">
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
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                Billing Cycle Day
              </h2>
              <select
                value={billingCycleDay}
                onChange={(e) => setBillingCycleDay(parseInt(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>Day {day} of each month</option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" />
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
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-white/10 hover:border-white/20'
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
            className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl py-6 text-lg font-bold disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Confirm ${mode === 'monthly' ? 'Monthly Plan' : 'Order'}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
