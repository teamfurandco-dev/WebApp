import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnlimitedFur } from '@/context/UnlimitedFurContext';
import { useState } from 'react';

export const SelectedProductsList = () => {
  const { selectedProducts, removeProduct } = useUnlimitedFur();
  const [removing, setRemoving] = useState(null);

  const handleRemove = async (productId) => {
    try {
      setRemoving(productId);
      await removeProduct(productId);
    } catch (err) {
      alert('Failed to remove product');
    } finally {
      setRemoving(null);
    }
  };

  if (selectedProducts.length === 0) {
    return (
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/40 text-center shadow-inner">
        <ShoppingBag className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-sm font-black text-gray-900 mb-1 font-peace-sans uppercase tracking-tight">Your Cart is Empty</h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Pick some furry treats!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black text-gray-900 font-peace-sans uppercase tracking-widest">Cart Summary</h3>
        <span className="text-gray-500 font-black text-[10px] uppercase tracking-tighter">{selectedProducts.length} Items</span>
      </div>

      <AnimatePresence>
        {selectedProducts.map((item) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/40 backdrop-blur-md rounded-xl p-2.5 border border-white/60 flex items-center gap-3 shadow-sm"
          >
            <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-black text-gray-900 truncate leading-tight font-peace-sans uppercase tracking-tighter text-[10px]">{item.name}</h4>
              <p className="text-[9px] text-gray-500 line-clamp-1 font-bold uppercase tracking-tight">{item.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-black font-black text-xs">
                  ₹{(item.totalPrice / 100).toFixed(0)}
                </span>
                <span className="text-gray-400 text-[9px] font-bold">x{item.quantity}</span>
              </div>
            </div>

            <Button
              onClick={() => handleRemove(item.productId)}
              disabled={removing === item.productId}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500/50 hover:text-red-500 hover:bg-red-50"
            >
              {removing === item.productId ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
