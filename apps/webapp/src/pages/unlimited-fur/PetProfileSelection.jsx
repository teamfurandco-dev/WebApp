import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockUnlimitedFur } from '@/context/MockUnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';

const PET_TYPES = [
  {
    value: 'cat',
    label: 'Cat',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    description: 'Feline essentials & treats',
  },
  {
    value: 'dog',
    label: 'Dog',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Canine care & nutrition',
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
      setError('Failed to set pet type. Please try again.');
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
            Who are we shopping for?
          </h1>
          <p className="text-white/60 text-lg">
            Select your pet type to see personalized product recommendations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {PET_TYPES.map((pet, index) => (
            <motion.button
              key={pet.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedPet(pet.value);
                setError('');
              }}
              className={cn(
                'relative rounded-3xl overflow-hidden border-4 transition-all group',
                selectedPet === pet.value
                  ? 'border-[#D4AF37]'
                  : 'border-white/10 hover:border-white/20'
              )}
            >
              <div className="aspect-square relative">
                <img
                  src={pet.image}
                  alt={pet.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {selectedPet === pet.value && (
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <Check className="w-6 h-6 text-black" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-bold mb-2">{pet.label}</h3>
                  <p className="text-white/80">{pet.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={!selectedPet || loading}
          className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl py-6 text-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Processing...' : (
            <>
              Continue to Categories
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
