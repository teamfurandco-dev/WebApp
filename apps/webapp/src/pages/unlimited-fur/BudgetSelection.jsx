import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnlimitedFur } from '@/context/UnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';

const BUDGET_TIERS = [
  { value: 100000, label: '₹1,000', description: 'Basic Essentials' },
  { value: 200000, label: '₹2,000', description: 'Standard Care' },
  { value: 300000, label: '₹3,000', description: 'Premium Health' },
  { value: 500000, label: '₹5,000', description: 'The Works' },
];

export default function BudgetSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { startMonthlyPlan, startBundle, setBudget, loading } = useUnlimitedFur();

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [customBudget, setCustomBudget] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    switchMode('CORE');
  }, [switchMode]);

  const handleContinue = async () => {
    const budgetValue = showCustom ? parseInt(customBudget) * 100 : selectedBudget;
    if (!budgetValue || budgetValue < 50000) {
      setError('Minimum budget is ₹500');
      return;
    }
    try {
      if (mode === 'monthly') await startMonthlyPlan();
      else await startBundle();
      await setBudget(budgetValue);
      navigate(`/unlimited-fur/${mode}/pet-profile`);
    } catch (err) {
      setError('Failed to set budget.');
    }
  };

  return (
    <div className="min-h-screen bg-[#EDC520] text-gray-900 overflow-y-auto relative font-sans">
      <UnlimitedBackground />

      <div className="min-h-screen container mx-auto max-w-5xl flex flex-col items-center justify-center p-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black font-peace-sans tracking-tighter text-gray-900 leading-tight mb-2">
            {mode === 'monthly' ? 'Select Monthly Budget' : 'Select Bundle Value'}
          </h1>
          <p className="text-gray-800 font-bold text-sm opacity-80">
            Control your spending with curated premium plans
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-6">
          {BUDGET_TIERS.map((tier, idx) => (
            <motion.button
              key={tier.value}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => { setSelectedBudget(tier.value); setShowCustom(false); setError(''); }}
              className={cn(
                'relative p-5 rounded-3xl border-2 transition-all text-center backdrop-blur-md h-36 flex flex-col justify-center items-center',
                selectedBudget === tier.value && !showCustom
                  ? 'border-black bg-white shadow-xl shadow-black/10'
                  : 'border-white/40 bg-white/20 hover:border-black/20 hover:bg-white/30'
              )}
            >
              <div className="text-sm font-black text-gray-500 uppercase tracking-widest mb-1">{tier.description}</div>
              <div className="text-2xl font-black text-gray-900 font-peace-sans">{tier.label}</div>
              {selectedBudget === tier.value && !showCustom && (
                <div className="absolute -bottom-2 -translate-x-1/2 left-1/2 bg-black text-[#EDC520] rounded-full p-1 shadow-lg">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="w-full max-w-md space-y-4">
          <button
            onClick={() => { setShowCustom(true); setSelectedBudget(null); }}
            className={cn(
              "w-full py-4 rounded-2xl border-2 transition-all font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-md",
              showCustom ? "bg-white border-black" : "bg-white/10 border-white/40 hover:bg-white/30 text-gray-700"
            )}
          >
            Custom Amount {showCustom && <span className="text-[#EDC520] bg-black px-2 py-0.5 rounded ml-2">₹</span>}
          </button>

          {showCustom && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <input
                type="number"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                placeholder="Enter budget amount"
                className="w-full bg-white border-2 border-black rounded-2xl px-6 py-4 text-center font-black text-xl leading-none focus:outline-none focus:ring-0 shadow-xl"
              />
            </motion.div>
          )}

          <Button
            onClick={handleContinue}
            disabled={(!selectedBudget && !customBudget) || loading}
            className="w-full h-16 bg-black text-white rounded-2xl text-xl font-black uppercase tracking-tighter shadow-2xl transition-all active:scale-95 disabled:opacity-30 hover:bg-gray-800"
          >
            {loading ? 'Processing...' : (
              <div className="flex items-center justify-center gap-3">
                Continue to Pet Profile <ArrowRight className="w-6 h-6" />
              </div>
            )}
          </Button>

          {error && <p className="text-red-600 text-center text-xs font-bold bg-red-50 py-2 rounded-lg">{error}</p>}
        </div>

        <div className="mt-8 flex items-center gap-2 text-gray-600 font-bold text-[10px] uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Secure Budget Lock
        </div>
      </div>
    </div>
  );
}
