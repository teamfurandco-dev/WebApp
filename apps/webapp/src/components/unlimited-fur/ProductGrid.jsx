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
        <h2 className="text-xl font-black text-gray-900 font-peace-sans uppercase tracking-tight">Available Products</h2>
        <p className="text-gray-600 font-bold text-xs uppercase tracking-widest">{products.length} found</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                'backdrop-blur-md rounded-2xl overflow-hidden border transition-all group shadow-sm',
                selectable
                  ? 'bg-white/40 border-white/60 hover:border-black hover:bg-white/60 hover:shadow-lg'
                  : 'bg-white/10 border-white/10 opacity-60'
              )}
            >
              <div className="aspect-square relative bg-white/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!affordable && (
                  <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full">
                    Over Budget
                  </div>
                )}
              </div>

              <div className="p-3 bg-white/30">
                <h3 className="font-black text-gray-900 mb-0.5 text-xs line-clamp-1 leading-tight font-peace-sans uppercase tracking-tighter">{product.name}</h3>
                <p className="text-[10px] text-gray-500 mb-2 line-clamp-1 font-bold uppercase tracking-tight">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xl font-black text-black">
                    ₹{(product.price / 100).toFixed(0)}
                  </div>

                  <Button
                    onClick={() => handleAddProduct(product)}
                    disabled={!selectable || addingProduct === product.id}
                    size="sm"
                    className={cn(
                      'bg-black hover:bg-gray-800 text-white font-bold text-xs px-4 py-1 h-8 rounded-full shadow-md active:scale-95 transition-all',
                      !selectable && 'opacity-50 cursor-not-allowed hover:bg-black'
                    )}
                  >
                    {addingProduct === product.id ? (
                      <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-3 h-3 mr-1" />
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
        <div className="text-center py-24 bg-white/20 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-white/40">
          <div className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">No Products Found</h3>
          <p className="text-gray-600 max-w-sm mx-auto font-medium">
            Try adjusting your pet type, categories, or budget to see more products.
          </p>
        </div>
      )}
    </div>
  );
};
