import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnlimitedFur } from '@/context/UnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { WalletDisplay } from '@/components/unlimited-fur/WalletDisplay';
import { ProductGrid } from '@/components/unlimited-fur/ProductGrid';
import { SelectedProductsList } from '@/components/unlimited-fur/SelectedProductsList';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';
import { cn } from '@fur-co/utils';

export default function Shopping() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const { switchMode } = useTheme();
  const { selectedProducts, wallet } = useUnlimitedFur();

  useEffect(() => {
    switchMode('CORE');
    window.scrollTo(0, 0);
  }, [switchMode]);

  const handleCheckout = () => {
    navigate(`/unlimited-fur/${mode}/checkout`);
  };

  return (
    <div className="min-h-screen bg-[#EDC520] text-gray-900 relative overflow-x-hidden font-sans selection:bg-black/10 selection:text-black">
      <UnlimitedBackground />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-6 lg:py-10 relative z-10">

        {/* Medium Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-peace-sans leading-none tracking-tighter mb-2">
              Unlimited Shop
            </h1>
            <p className="text-gray-800 font-bold text-sm">
              Curate your pet's routine within <span className="bg-black text-[#EDC520] px-1.5 py-0.5 rounded ml-1 uppercase text-xs">₹{((wallet.monthlyBudget || 0) / 100).toFixed(0)}</span>
            </p>
          </motion.div>

          {/* Search Integration - Smaller */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs relative group"
          >
            <div className="flex items-center w-full h-12 rounded-2xl border border-white/50 bg-white/30 backdrop-blur-md px-4 focus-within:bg-white focus-within:border-black transition-all">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search essentials..."
                className="bg-transparent border-none w-full px-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 font-bold text-sm"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Content: Categories and Products (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Category Bar - Smaller */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-1.5 border border-white/40 inline-flex shadow-sm overflow-x-auto no-scrollbar max-w-full">
                {['All', 'Food', 'Toys', 'Grooming', 'Health'].map((category, idx) => (
                  <button
                    key={category}
                    className={cn(
                      "px-6 py-2.5 rounded-xl transition-all text-xs font-black uppercase tracking-wider",
                      idx === 0 ? "bg-black text-[#EDC520] shadow-md" : "text-gray-700 hover:bg-white/30"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <ProductGrid />
            </motion.div>
          </div>

          {/* Sticky Sidebar (4 Columns) - Checkout at top for maximum visibility */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 space-y-6">

            {/* Persistant CTA / Total Panel (Top of Sidebar) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group border border-white/10"
            >
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[#EDC520] text-[10px] font-black uppercase tracking-widest opacity-80">Total Value</p>
                    <h2 className="text-3xl font-black font-peace-sans text-white leading-none tracking-tighter">
                      ₹{(wallet.spent / 100).toFixed(0)}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-[10px] font-black uppercase">{selectedProducts.length} Items</p>
                    {mode === 'bundle' && selectedProducts.length >= 3 && (
                      <span className="text-[#EDC520] text-[9px] font-black uppercase tracking-tighter">15% Discount Active</span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={selectedProducts.length === 0}
                  className="w-full bg-[#EDC520] hover:bg-white text-gray-900 h-14 rounded-xl text-lg font-black shadow-lg transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
                >
                  Complete Selection <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#EDC520]/5 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Wallet Panel */}
            <WalletDisplay wallet={wallet} />

            {/* Selected items Area - Compact */}
            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-5 border border-white/50 shadow-sm max-h-[350px] overflow-y-auto custom-scrollbar">
              <SelectedProductsList />
            </div>

          </aside>
        </div>

        {/* Mobile Floating Cart - Persistent */}
        <AnimatePresence>
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="lg:hidden fixed bottom-20 left-4 right-4 z-[60]"
            >
              <Button
                onClick={handleCheckout}
                className="w-full bg-black text-[#EDC520] h-16 rounded-2xl text-base font-black shadow-2xl flex justify-between px-6 border border-white/10 active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="absolute -top-2 -right-2 bg-[#EDC520] text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center border font-black">{selectedProducts.length}</span>
                  </div>
                  <span className="font-peace-sans uppercase tracking-tight">Checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-xl">₹{(wallet.spent / 100).toFixed(0)}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
