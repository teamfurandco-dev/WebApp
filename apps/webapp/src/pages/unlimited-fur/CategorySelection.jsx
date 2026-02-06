import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, UtensilsCrossed, Gamepad2, Shirt, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnlimitedFur } from '@/context/UnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';
import treatImg from '@/assets/treat.png';
import collarImg from '@/assets/collar.png';
import boneImg from '@/assets/bone.png';

const CATEGORIES_LIST = [
  { id: 'food', name: 'Food & Treats', icon: <UtensilsCrossed /> },
  { id: 'toys', name: 'Toys & Entertainment', icon: <Gamepad2 /> },
  { id: 'accessories', name: 'Accessories & Care', icon: <Shirt /> },
  { id: 'grooming', name: 'Grooming', icon: <Sparkles /> },
  { id: 'health', name: 'Health', icon: <Heart /> },
];

export default function CategorySelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { setCategories, loading, categories } = useUnlimitedFur();

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
      setError('Failed to set categories.');
    }
  };

  const getCategoryImage = (category) => {
    const name = category.name.toLowerCase();
    const id = category.id.toLowerCase();

    if (name.includes('food') || name.includes('treat') || id === 'food') return treatImg;
    if (name.includes('toy') || id === 'toys') return boneImg;
    if (name.includes('access') || name.includes('collar') || id === 'accessories') return collarImg;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#ffcc00] text-gray-900 overflow-y-auto relative font-sans">
      <UnlimitedBackground />

      <div className="min-h-screen container mx-auto max-w-5xl flex flex-col items-center justify-center p-6 pb-40 md:pb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black font-peace-sans tracking-tighter text-gray-900 leading-tight mb-2">
            Personalize<br />Their Box
          </h1>
          <p className="text-gray-800 font-bold text-sm opacity-80">
            Tell us which categories you'd like to explore
          </p>
        </motion.div>

        <div className="flex justify-center w-full mb-12">
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl">
            {CATEGORIES_LIST.map((category, index) => {
              const isSelected = selectedCategories.includes(category.id);
              const imgAsset = getCategoryImage(category);

              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    'relative p-7 rounded-[2.5rem] border-2 transition-all text-center backdrop-blur-md flex flex-col items-center justify-between group min-h-[220px] w-[180px] lg:w-[210px]',
                    isSelected
                      ? 'border-black bg-white shadow-2xl shadow-black/10'
                      : 'border-white/40 bg-white/20 hover:border-black/20 hover:bg-white/30 hover:shadow-xl'
                  )}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-black text-[#ffcc00] rounded-full p-2.5 shadow-lg z-20">
                      <Check className="w-4 h-4 stroke-[4]" />
                    </div>
                  )}

                  <div className="flex-1 flex items-center justify-center mb-6 w-full">
                    {imgAsset ? (
                      <motion.img
                        src={imgAsset}
                        alt={category.name}
                        className={cn(
                          "w-24 h-24 object-contain transition-all duration-500 drop-shadow-xl",
                          isSelected ? "scale-110 rotate-3" : "grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110"
                        )}
                      />
                    ) : (
                      <div className={cn(
                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl transition-colors shadow-inner",
                        isSelected ? "bg-black text-[#ffcc00]" : "bg-white/40 text-black group-hover:bg-white"
                      )}>
                        {category.icon}
                      </div>
                    )}
                  </div>

                  <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-gray-900 font-peace-sans leading-tight mt-auto">{category.name}</h3>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4">
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              <p className="text-[10px] font-black uppercase text-gray-500 w-full text-center mb-1">Selected Focus:</p>
              {selectedCategories.map(cat => (
                <span key={cat} className="bg-black text-[#ffcc00] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                  {CATEGORIES_LIST.find(c => c.id === cat)?.name}
                </span>
              ))}
            </div>
          )}

          <Button
            onClick={handleContinue}
            disabled={selectedCategories.length === 0 || loading}
            className="w-full h-16 bg-black text-white rounded-2xl text-xl font-black uppercase tracking-tighter shadow-2xl transition-all active:scale-95 disabled:opacity-30"
          >
            {loading ? 'Processing...' : (
              <div className="flex items-center justify-center gap-3">
                Unlock Shop <ArrowRight className="w-6 h-6" />
              </div>
            )}
          </Button>

          {error && <p className="text-red-500 text-center text-[10px] font-bold uppercase tracking-widest">{error}</p>}
        </div>
      </div>
    </div>
  );
}
