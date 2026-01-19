import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockUnlimitedFur } from '@/context/MockUnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';

const BUDGET_TIERS = [
  { value: 100000, label: '₹1,000', description: '2-3 essential items' },
  { value: 200000, label: '₹2,000', description: '4-6 quality products' },
  { value: 300000, label: '₹3,000', description: '6-8 premium items' },
  { value: 500000, label: '₹5,000', description: '10+ complete care' },
];

const MIN_BUDGET = 50000;

export default function BudgetSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { startMonthlyPlan, startBundle, setBudget, loading } = useMockUnlimitedFur();
  
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [customBudget, setCustomBudget] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    switchMode('CORE');
  }, [switchMode]);

  const handleContinue = async () => {
    const budgetValue = showCustom ? parseInt(customBudget) * 100 : selectedBudget;
    
    if (!budgetValue || budgetValue < MIN_BUDGET) {
      setError(`Minimum budget is ₹${MIN_BUDGET / 100}`);
      return;
    }

    try {
      // Initialize draft
      if (mode === 'monthly') {
        await startMonthlyPlan();
      } else {
        await startBundle();
      }
      
      // Set budget
      await setBudget(budgetValue);
      
      // Navigate to pet profile
      navigate(`/unlimited-fur/${mode}/pet-profile`);
    } catch (err) {
      setError('Failed to set budget. Please try again.');
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
          <h1 className="text-4xl font-serif font-medium mb-4">
            {mode === 'monthly' ? 'Set Your Monthly Budget' : 'Set Your Bundle Budget'}
          </h1>
          <p className="text-white/60 text-lg">
            {mode === 'monthly' 
              ? 'Choose how much you want to spend each month on pet essentials'
              : 'Choose your one-time bundle budget (minimum 3 products for 15% off)'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {BUDGET_TIERS.map((tier, index) => (
            <motion.button
              key={tier.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedBudget(tier.value);
                setShowCustom(false);
                setError('');
              }}
              className={cn(
                'relative p-8 rounded-2xl border-2 transition-all text-left',
                selectedBudget === tier.value && !showCustom
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              )}
            >
              {selectedBudget === tier.value && !showCustom && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
              <div className="text-3xl font-bold mb-2">{tier.label}</div>
              <div className="text-white/60">{tier.description}</div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => {
              setShowCustom(true);
              setSelectedBudget(null);
              setError('');
            }}
            className={cn(
              'w-full p-6 rounded-2xl border-2 transition-all text-left mb-8',
              showCustom
                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            )}
          >
            <div className="text-xl font-bold mb-2">Custom Budget</div>
            <div className="text-white/60 mb-4">Set your own budget amount</div>
            
            {showCustom && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">₹</span>
                <input
                  type="number"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-xl focus:outline-none focus:border-[#D4AF37]"
                  min={MIN_BUDGET / 100}
                />
              </div>
            )}
          </button>
        </motion.div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={(!selectedBudget && !customBudget) || loading}
          className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl py-6 text-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Processing...' : (
            <>
              Continue to Pet Profile
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
