import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, AlertCircle, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnlimitedFur } from '@/context/UnlimitedFurContext';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { WalletDisplay } from '@/components/unlimited-fur/WalletDisplay';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';
import { cn } from '@fur-co/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Shopping() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'monthly';
  const budget = parseInt(searchParams.get('budget'));
  const petType = searchParams.get('petType');
  const planId = searchParams.get('planId');

  const draftParam = searchParams.get('draftId');

  const { switchMode } = useTheme();
  const {
    filteredProducts,
    categories,
    wallet,
    selectedProducts,
    loading,
    initializeShop,
    addProduct,
    removeProduct,
    syncDraft,
    draftId
  } = useUnlimitedFur();

  const [activeCategory, setActiveCategory] = useState('all');
  const [addingId, setAddingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    switchMode('CORE');
    const parsedBudget = Number(budget);

    if (draftParam && draftParam !== draftId) {
      syncDraft(draftParam);
    } else if (!isNaN(parsedBudget) && petType && !draftId) {
      initializeShop(parsedBudget, petType, mode);
    }
  }, [budget, petType, mode, draftParam, draftId, syncDraft, initializeShop, switchMode]);

  const displayProducts = useMemo(() => {
    if (activeCategory === 'all') return filteredProducts;
    return filteredProducts.filter(p => p.category.slug === activeCategory);
  }, [filteredProducts, activeCategory]);

  const handleProductClick = (productId) => {
    const params = new URLSearchParams({
      source: 'unlimited',
      mode,
      budget,
      petType,
    });
    if (draftId) params.append('draftId', draftId);
    navigate(`/product/${productId}?${params.toString()}`);
  };

  const handleAddProduct = async (product, variantId, qty = 1) => {
    try {
      setAddingId(product.id);
      await addProduct(product.id, variantId, qty);
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveProduct = async (productId, variantId) => {
    try {
      setRemovingId(`${productId}-${variantId}`);
      await removeProduct(productId, variantId);
    } catch (error) {
      console.error('Failed to remove product:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = async () => {
    if (mode === 'edit' && planId && draftId) {
      try {
        setUpdateLoading(true);
        await api.unlimited.updatePlanFromDraft(planId, draftId);
        toast.success('Plan updated successfully!');
        navigate('/account/subscriptions');
      } catch (error) {
        console.error(error);
        toast.error('Failed to update plan');
      } finally {
        setUpdateLoading(false);
      }
    } else {
      navigate(`/unlimited-fur/${mode}/checkout`);
    }
  };

  if (loading && filteredProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#ffcc00] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffcc00] text-gray-900 relative overflow-x-hidden font-sans selection:bg-black/10 selection:text-black">
      <UnlimitedBackground />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-6 lg:py-10 relative z-10 flex flex-col md:flex-row gap-8 pb-32">

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-peace-sans leading-none tracking-tighter mb-2">
                Unlimited Shop
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-gray-800 font-bold text-sm opacity-80">
                  Curate your pet's routine within <span className="bg-black text-[#ffcc00] px-1.5 py-0.5 rounded ml-1 uppercase text-xs font-black">₹{(wallet.budget / 100).toFixed(0)}</span>
                </p>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-70 transition-all border-b-2 border-black pb-0.5"
                  >
                    Go to Checkout <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Wallet Display Mobile Only (Desktop is mostly hidden or integrated differently if sidebar is always visible) */}
            <div className="md:hidden">
              <WalletDisplay wallet={wallet} />
            </div>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                "px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border-2",
                activeCategory === 'all'
                  ? 'bg-black text-[#ffcc00] border-black shadow-lg'
                  : 'bg-white/40 border-white/60 text-gray-700 hover:bg-white/60 hover:border-black/20'
              )}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border-2",
                  activeCategory === cat.slug
                    ? 'bg-black text-[#ffcc00] border-black shadow-lg'
                    : 'bg-white/40 border-white/60 text-gray-700 hover:bg-white/60 hover:border-black/20'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {displayProducts.length === 0 && !loading ? (
            <div className="text-center py-24 bg-white/20 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-white/40">
              <div className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 max-w-sm mx-auto font-medium text-sm">
                Try adjusting your pet type, categories, or budget to see more products.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {displayProducts.map((product, index) => {
                const price = product.minPrice || product.variants?.[0]?.price || 0;
                const isAffordableAndStocked = product.isAffordable;
                const inCart = product.inCart;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => isAffordableAndStocked && handleProductClick(product.id)}
                    className={cn(
                      "backdrop-blur-md rounded-[2rem] p-4 shadow-sm border-2 transition-all flex flex-col h-full group relative overflow-hidden",
                      isAffordableAndStocked
                        ? "bg-white/40 border-white/60 hover:border-black hover:bg-white/80 hover:shadow-xl cursor-pointer"
                        : "bg-white/10 border-white/10 opacity-50 grayscale cursor-not-allowed"
                    )}
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white/20 relative group-hover:scale-[1.02] transition-transform duration-500">
                      <img
                        src={product.images[0]?.url || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {inCart && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-full shadow-lg">
                          Added
                        </div>
                      )}
                      {!isAffordableAndStocked && (
                        <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] font-black uppercase px-2 py-1 rounded-full shadow-lg">
                          Over Budget
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h3 className="font-black text-lg mb-1 leading-tight text-gray-900 line-clamp-2 min-h-[3rem] font-peace-sans">{product.name}</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-3">{product.category.name}</p>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-black/5">
                        <p className="font-black text-2xl text-gray-900">₹{(price / 100).toFixed(0)}</p>

                        {isAffordableAndStocked ? (
                          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                            {product.variants.length > 1 ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    disabled={addingId === product.id}
                                    size="sm"
                                    className="bg-black hover:bg-gray-900 text-[#ffcc00] font-black text-xs px-4 h-9 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wide flex items-center gap-1"
                                  >
                                    {addingId === product.id ? (
                                      <div className="w-4 h-4 border-2 border-[#ffcc00]/30 border-t-[#ffcc00] rounded-full animate-spin" />
                                    ) : (
                                      <>Add <Plus className="w-3 h-3 ml-1" /></>
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white border border-gray-200 rounded-xl shadow-xl p-1 min-w-[140px] z-[100]">
                                  {product.affordableVariants.map(v => (
                                    <DropdownMenuItem
                                      key={v.id}
                                      onClick={() => handleAddProduct(product, v.id)}
                                      className="text-xs font-bold text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 rounded-lg cursor-pointer py-2.5 px-3 uppercase tracking-wide transition-colors"
                                    >
                                      {v.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <Button
                                onClick={() => handleAddProduct(product, product.variants[0].id)}
                                disabled={addingId === product.id}
                                size="sm"
                                className="bg-black hover:bg-gray-900 text-[#ffcc00] font-black text-xs px-4 h-9 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wide"
                              >
                                {addingId === product.id ? (
                                  <div className="w-4 h-4 border-2 border-[#ffcc00]/30 border-t-[#ffcc00] rounded-full animate-spin" />
                                ) : (
                                  <>Add <Plus className="w-3 h-3 ml-1" /></>
                                )}
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Cart - Desktop & Mobile Drawer logic could be added, currently fixed on Desktop, overlay on Mobile? Keeping it simple: separate column on desktop */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 relative z-[100]">
          <div className="sticky top-6 space-y-4 h-fit flex flex-col">

            {/* Wallet Display Always Visible on Desktop */}
            <div className="hidden md:block">
              <WalletDisplay wallet={wallet} />
            </div>

            {/* Cart Box */}
            <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-5 border border-white/60 shadow-xl flex flex-col h-[600px] max-h-[calc(100vh-180px)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
                <h3 className="text-xl font-black text-gray-900 font-peace-sans flex items-center gap-2 uppercase tracking-tighter">
                  Your Box
                  <span className="bg-black text-[#ffcc00] text-xs px-2 py-0.5 rounded-full h-6 flex items-center justify-center">{selectedProducts.length}</span>
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(156, 163, 175, 0.5) rgba(243, 244, 246, 0.3)'
                }}
              >
                <style dangerouslySetInnerHTML={{
                  __html: `
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(243, 244, 246, 0.3);
                    border-radius: 10px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 10px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(107, 114, 128, 0.7);
                  }
                ` }} />
                <AnimatePresence mode="popLayout">
                  {selectedProducts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center py-10 opacity-60"
                    >
                      <ShoppingBag className="w-12 h-12 mb-3 text-gray-400" />
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Box is empty</p>
                      <p className="text-xs text-gray-400 max-w-[150px]">Add essentials to build your plan</p>
                    </motion.div>
                  ) : (
                    selectedProducts.map(p => (
                      <motion.div
                        key={`${p.productId}-${p.variantId}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        className="flex items-start gap-3 p-3 bg-white/60 rounded-2xl border border-white/40 shadow-sm group hover:bg-white hover:shadow-md transition-all"
                      >
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-xs text-gray-900 line-clamp-1 uppercase tracking-tight">{p.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-1">{p.variantName}</p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (p.quantity > 1) {
                                  handleAddProduct({ id: p.productId, variants: [{ id: p.variantId, price: p.price }] }, p.variantId, -1);
                                }
                              }}
                              disabled={p.quantity <= 1 || addingId === p.productId}
                              className="w-5 h-5 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black text-gray-900 min-w-[20px] text-center">{p.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Check if we have enough budget for one more
                                if (wallet.remaining >= p.price) {
                                  handleAddProduct({ id: p.productId, variants: [{ id: p.variantId, price: p.price }] }, p.variantId, 1);
                                }
                              }}
                              disabled={addingId === p.productId || wallet.remaining < p.price}
                              className="w-5 h-5 flex items-center justify-center rounded bg-black hover:bg-gray-800 text-[#ffcc00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="font-black text-sm">₹{((p.price * p.quantity) / 100).toFixed(0)}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveProduct(p.productId, p.variantId)}
                          disabled={removingId === `${p.productId}-${p.variantId}`}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 flex-shrink-0"
                        >
                          {removingId === `${p.productId}-${p.variantId}` ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-3 border-t border-black/10 mt-auto flex-shrink-0">
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-xl font-black text-gray-900">₹{(wallet.spent / 100).toFixed(0)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={selectedProducts.length === 0 || updateLoading}
                  className="w-full bg-black text-[#ffcc00] hover:bg-gray-800 font-black py-5 rounded-2xl text-base shadow-xl active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                  {mode === 'edit' ? (
                    updateLoading ? 'Updating...' : 'Update Plan'
                  ) : (
                    <>Checkout <ArrowRight className="ml-2 w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-6 right-6 z-[100] md:hidden"
            >
              <Button
                onClick={handleCheckout}
                className="w-full bg-black text-[#ffcc00] hover:bg-gray-900 h-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between px-8 border border-white/10 backdrop-blur-xl transition-transform active:scale-95"
              >
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{selectedProducts.length} Items Selected</span>
                  <span className="text-lg font-black font-peace-sans uppercase tracking-tighter">
                    {mode === 'edit' ? (
                      updateLoading ? 'Updating...' : 'Update Plan'
                    ) : (
                      'Checkout Plan'
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black">₹{(wallet.spent / 100).toFixed(0)}</span>
                  <div className="bg-[#ffcc00] text-black rounded-full p-1.5 self-center">
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </div>
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

