import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnlimitedFur } from '@/context/UnlimitedFurContext';
import { useTheme } from '@/context/ThemeContext';
import { WalletDisplay } from '@/components/unlimited-fur/WalletDisplay';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';
import { cn } from '@fur-co/utils';

export default function Shopping() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const budget = parseInt(searchParams.get('budget'));
  const petType = searchParams.get('petType');

  const { switchMode } = useTheme();
  const {
    filteredProducts,
    categories,
    wallet,
    selectedProducts,
    loading,
    initializeShop,
    addProduct,
    removeProduct
  } = useUnlimitedFur();

  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    switchMode('CORE');
    if (budget && petType) {
      initializeShop(budget, petType, mode);
    }
  }, []);

  const displayProducts = useMemo(() => {
    if (activeCategory === 'all') return filteredProducts;
    return filteredProducts.filter(p => p.category.slug === activeCategory);
  }, [filteredProducts, activeCategory]);

  const handleAddProduct = async (productId, variantId) => {
    try {
      await addProduct(productId, variantId, 1);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleCheckout = () => {
    navigate(`/unlimited-fur/${mode}/checkout`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffcc00] flex items-center justify-center">
        <div className="text-2xl font-bold">Loading shop...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffcc00] text-gray-900 relative overflow-x-hidden">
      <UnlimitedBackground />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-6 lg:py-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-peace-sans leading-none tracking-tighter mb-2">
              Unlimited Shop
            </h1>
            <p className="text-gray-800 font-bold text-sm">
              Curate your pet's routine within <span className="bg-black text-[#ffcc00] px-1.5 py-0.5 rounded ml-1 uppercase text-xs">₹{(wallet.budget / 100).toFixed(0)}</span>
            </p>
          </motion.div>

          <WalletDisplay wallet={wallet} />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              "px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap",
              activeCategory === 'all' ? 'bg-black text-[#ffcc00]' : 'bg-white text-black hover:bg-gray-100'
            )}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap",
                activeCategory === cat.slug ? 'bg-black text-[#ffcc00]' : 'bg-white text-black hover:bg-gray-100'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {displayProducts.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-white rounded-2xl p-4 shadow-lg transition-all",
                !product.isAffordable && "opacity-40 grayscale pointer-events-none"
              )}
            >
              <img 
                src={product.images[0]?.url || '/placeholder.jpg'} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{product.category.name}</p>
              <p className="font-black text-xl mb-4">₹{(product.minPrice / 100).toFixed(0)}</p>
              
              {product.isAffordable && !product.inCart && (
                <select 
                  onChange={(e) => e.target.value && handleAddProduct(product.id, e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  defaultValue=""
                >
                  <option value="">Select variant</option>
                  {product.affordableVariants.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} - ₹{(v.price / 100).toFixed(0)}
                    </option>
                  ))}
                </select>
              )}
              
              {product.inCart && (
                <div className="bg-green-100 text-green-800 p-2 rounded-lg text-center font-bold">
                  ✓ Added to Cart
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50">
          <h3 className="text-2xl font-black mb-4">Cart ({selectedProducts.length})</h3>
          
          <div className="space-y-4 mb-6">
            {selectedProducts.map(p => (
              <div key={`${p.productId}-${p.variantId}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-xs text-gray-600">{p.variantName}</p>
                  <p className="font-bold">₹{(p.price / 100).toFixed(0)}</p>
                </div>
                <button 
                  onClick={() => removeProduct(p.productId, p.variantId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleCheckout}
            className="w-full bg-black text-[#ffcc00] hover:bg-gray-800 font-bold py-6 rounded-full"
          >
            Checkout <ArrowRight className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
