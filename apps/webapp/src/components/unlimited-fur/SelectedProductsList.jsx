import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockUnlimitedFur } from '@/context/MockUnlimitedFurContext';
import { useState } from 'react';

export const SelectedProductsList = () => {
  const { selectedProducts, removeProduct } = useMockUnlimitedFur();
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
      <div className="bg-white/5 rounded-2xl p-12 border border-white/10 text-center">
        <ShoppingBag className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No products selected yet</h3>
        <p className="text-white/60">Add products from the grid to start building your plan</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Selected Products</h3>
        <span className="text-white/60">{selectedProducts.length} items</span>
      </div>

      <AnimatePresence>
        {selectedProducts.map((item) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4"
          >
            <div className="w-20 h-20 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white truncate">{item.name}</h4>
              <p className="text-sm text-white/60">{item.description}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[#D4AF37] font-bold">
                  ₹{(item.totalPrice / 100).toFixed(0)}
                </span>
                <span className="text-white/60 text-sm">Qty: {item.quantity}</span>
              </div>
            </div>

            <Button
              onClick={() => handleRemove(item.productId)}
              disabled={removing === item.productId}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg p-2"
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
