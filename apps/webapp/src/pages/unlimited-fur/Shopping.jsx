import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockUnlimitedFur } from '@/context/MockUnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { WalletDisplay } from '@/components/unlimited-fur/WalletDisplay';
import { ProductGrid } from '@/components/unlimited-fur/ProductGrid';
import { SelectedProductsList } from '@/components/unlimited-fur/SelectedProductsList';

export default function Shopping() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { selectedProducts, wallet } = useMockUnlimitedFur();

  useEffect(() => {
    switchMode('CORE');
  }, [switchMode]);

  const handleCheckout = () => {
    navigate(`/unlimited-fur/${mode}/checkout`);
  };

  return (
    <div className="min-h-screen bg-[#1A1B23] text-white py-20 px-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif font-medium mb-4">
            {mode === 'monthly' ? 'Build Your Monthly Essentials' : 'Build Your Bundle'}
          </h1>
          <p className="text-white/60 text-lg">
            {mode === 'monthly' 
              ? 'Select products within your budget. These will be delivered every month.'
              : 'Select 3+ products to get 15% off automatically at checkout.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <ProductGrid />
          </div>

          <div className="space-y-6">
            <WalletDisplay wallet={wallet} />
            <SelectedProductsList />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="sticky bottom-8 bg-[#1A1B23]/95 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-sm text-white/60 mb-1">
                {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected
              </div>
              <div className="text-2xl font-bold text-white">
                Total: <span className="text-[#D4AF37]">₹{(wallet.spent / 100).toFixed(2)}</span>
              </div>
              {mode === 'bundle' && selectedProducts.length >= 3 && (
                <div className="text-sm text-green-400 mt-1">
                  ✓ 15% discount will be applied at checkout
                </div>
              )}
            </div>

            <Button
              onClick={handleCheckout}
              disabled={selectedProducts.length === 0}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl px-8 py-4 text-lg font-bold disabled:opacity-50"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
