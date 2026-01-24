import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Dog, Cat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockUnlimitedFur } from '@/context/MockUnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';
import catImage from '@/assets/cat.jpeg';
import dogImage from '@/assets/dog.jpeg';

const PET_TYPES = [
  {
    value: 'cat',
    label: 'Cat',
    icon: Cat,
    image: catImage,
    description: 'Feline care',
  },
  {
    value: 'dog',
    label: 'Dog',
    icon: Dog,
    image: dogImage,
    description: 'Canine care',
  },
];

export default function PetProfileSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { setPetType, loading } = useMockUnlimitedFur();

  const [selectedPet, setSelectedPet] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    switchMode('CORE');
  }, [switchMode]);

  const handleContinue = async () => {
    if (!selectedPet) {
      setError('Please select your pet type');
      return;
    }
    try {
      await setPetType(selectedPet);
      navigate(`/unlimited-fur/${mode}/categories`);
    } catch (err) {
      setError('Failed to set pet type.');
    }
  };

  return (
    <div className="h-screen bg-[#EDC520] text-gray-900 overflow-hidden relative font-sans">
      <UnlimitedBackground />

      <div className="h-full container mx-auto max-w-4xl flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black font-peace-sans tracking-tighter text-gray-900 leading-tight mb-3">
            Who are we<br />shopping for?
          </h1>
          <p className="text-gray-800 font-bold text-sm opacity-80">
            Tell us about your furry friend
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl mb-10">
          {PET_TYPES.map((pet, idx) => {
            const Icon = pet.icon;
            return (
              <motion.button
                key={pet.value}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedPet(pet.value); setError(''); }}
                className={cn(
                  'flex-1 relative rounded-[2.5rem] overflow-hidden border-2 transition-all p-1 group h-64',
                  selectedPet === pet.value
                    ? 'border-black ring-4 ring-black/10'
                    : 'border-white/40 hover:border-black/30'
                )}
              >
                <div className="h-full w-full relative rounded-[2.2rem] overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />


                  {selectedPet === pet.value && (
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black text-[#EDC520] flex items-center justify-center shadow-xl border-2 border-[#EDC520]/20 z-20">
                      <Check className="w-6 h-6" />
                    </div>
                  )}

                  {/* No text overlay */}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="w-full max-w-sm space-y-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedPet || loading}
            className="w-full h-16 bg-black text-white rounded-2xl text-xl font-black uppercase tracking-tighter shadow-2xl transition-all active:scale-95 disabled:opacity-30 hover:bg-gray-800"
          >
            {loading ? 'Processing...' : (
              <div className="flex items-center justify-center gap-3">
                Continue to categories <ArrowRight className="w-6 h-6" />
              </div>
            )}
          </Button>

          {error && <p className="text-red-500 text-center text-xs font-bold">{error}</p>}
        </div>
      </div>
    </div>
  );
}
