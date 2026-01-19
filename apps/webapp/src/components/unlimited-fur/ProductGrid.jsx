import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockUnlimitedFur } from '@/context/MockUnlimitedFurContext';
import { cn } from '@fur-co/utils';

export const ProductGrid = () => {
  const { wallet, addProduct, products, loading } = useMockUnlimitedFur();
  const [error, setError] = useState('');
  const [addingProduct, setAddingProduct] = useState(null);

  const handleAddProduct = async (product) => {
    try {
      setAddingProduct(product.id);
      await addProduct(product.id, 1);
    } catch (err) {
      alert(err.message || 'Failed to add product');
    } finally {
      setAddingProduct(null);
    }
  };

  const isAffordable = (price) => price <= wallet.remaining;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Available Products</h2>
        <p className="text-white/60">{products.length} products found</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const affordable = isAffordable(product.price);
          const selectable = affordable;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'bg-white/5 rounded-2xl overflow-hidden border transition-all',
                selectable ? 'border-white/10 hover:border-[#D4AF37]/50' : 'border-white/5 opacity-60'
              )}
            >
              <div className="aspect-square relative bg-white/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!affordable && (
                  <div className="absolute top-3 right-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full">
                    Over Budget
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-white mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-white/60 mb-3">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-[#D4AF37]">
                    ₹{(product.price / 100).toFixed(0)}
                  </div>
                  
                  <Button
                    onClick={() => handleAddProduct(product)}
                    disabled={!selectable || addingProduct === product.id}
                    size="sm"
                    className={cn(
                      'bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium',
                      !selectable && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {addingProduct === product.id ? (
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
          <p className="text-white/60">
            Try adjusting your pet type, categories, or budget to see more products.
          </p>
        </div>
      )}
    </div>
  );
};
