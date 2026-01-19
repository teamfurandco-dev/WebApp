import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, UtensilsCrossed, Gamepad2, Shirt, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockUnlimitedFur } from '@/context/MockUnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';

const CATEGORIES = [
  { value: 'food', label: 'Food & Nutrition', icon: UtensilsCrossed, description: 'Premium meals & treats' },
  { value: 'toys', label: 'Toys & Play', icon: Gamepad2, description: 'Fun & entertainment' },
  { value: 'accessories', label: 'Accessories', icon: Shirt, description: 'Collars, leashes & more' },
  { value: 'grooming', label: 'Grooming', icon: Sparkles, description: 'Hygiene & care products' },
  { value: 'health', label: 'Health & Wellness', icon: Heart, description: 'Supplements & vitamins' },
];

export default function CategorySelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { setCategories, loading, categories } = useMockUnlimitedFur();
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    switchMode('CORE');
  }, [switchMode]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setError('');
  };

  const handleContinue = async () => {
    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    try {
      await setCategories(selectedCategories);
      navigate(`/unlimited-fur/${mode}/shopping`);
    } catch (err) {
      setError('Failed to set categories. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1B23] text-white py-20 px-8">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif font-medium mb-4">
            What does your pet need?
          </h1>
          <p className="text-white/60 text-lg">
            Select one or more categories to personalize your shopping experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {categories.map((category, index) => {
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  'relative p-8 rounded-2xl border-2 transition-all text-left',
                  isSelected
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                )}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                )}
                
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-4 text-2xl">
                  {category.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/60 text-sm">Essential items for your pet</p>
              </motion.button>
            );
          })}
        </div>

        {selectedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10"
          >
            <div className="text-sm text-white/60 mb-2">Selected Categories:</div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(cat => {
                const category = CATEGORIES.find(c => c.value === cat);
                return (
                  <span key={cat} className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-sm">
                    {category?.label}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={selectedCategories.length === 0 || loading}
          className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl py-6 text-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Processing...' : (
            <>
              Start Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
