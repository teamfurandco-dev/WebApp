import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronDown, PawPrint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('GATEWAY');
  }, [switchMode]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sort, setSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          api.getProducts({ category: selectedCategory === 'All' ? null : selectedCategory, sort }),
          api.getCategories()
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, sort]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSearchParams({ category: cat === 'All' ? '' : cat });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8zm-10-10c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8zm20 0c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8z' fill='%231F1F1F' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      {/* Paw Trail Scroll Indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8 opacity-20 pointer-events-none z-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <PawPrint key={i} className="w-6 h-6 text-furco-yellow rotate-12" />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-4 md:pt-12 pb-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-72 shrink-0">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col gap-6 mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-black leading-[1.1]">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h1>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Mobile Filter Trigger */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="md:hidden flex-1 sm:flex-none h-11 gap-2 rounded-full border-black/20 font-bold bg-white shadow-sm">
                        <Filter className="h-4 w-4" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-[#FDFBF7] p-0">
                      <div className="p-6 pt-14">
                        <FilterSidebar
                          categories={categories}
                          selectedCategory={selectedCategory}
                          onCategoryChange={handleCategoryChange}
                          priceRange={priceRange}
                          onPriceChange={setPriceRange}
                          isMobile={true}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort Dropdown */}
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      className="w-full h-11 pl-4 pr-10 rounded-full border border-black/10 bg-white text-xs sm:text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-furco-yellow appearance-none cursor-pointer hover:border-black/30 transition-all"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="featured">Sort by: Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Best Rating</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {selectedCategory !== 'All' && (
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-furco-yellow text-black text-sm font-bold shadow-sm"
                  >
                    {selectedCategory}
                    <button onClick={() => handleCategoryChange('All')} className="hover:bg-black/10 rounded-full p-0.5 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                  <Button
                    variant="link"
                    className="text-muted-foreground hover:text-furco-gold h-auto p-0 text-sm"
                    onClick={() => handleCategoryChange('All')}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="relative w-24 h-24"
                >
                  <PawPrint className="w-8 h-8 text-furco-yellow absolute top-0 left-1/2 -translate-x-1/2" />
                  <PawPrint className="w-8 h-8 text-furco-yellow absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180" />
                  <PawPrint className="w-8 h-8 text-furco-yellow absolute left-0 top-1/2 -translate-y-1/2 -rotate-90" />
                  <PawPrint className="w-8 h-8 text-furco-yellow absolute right-0 top-1/2 -translate-y-1/2 rotate-90" />
                </motion.div>
                <p className="mt-6 text-lg font-serif text-black/60 animate-pulse">Sniffing out products...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                <div className="mt-16 flex justify-center gap-2">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${currentPage === page
                        ? 'bg-furco-yellow text-black shadow-md scale-110'
                        : 'bg-white border border-black/10 text-black hover:border-furco-yellow hover:text-furco-yellow'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[3rem] border border-black/5 shadow-xl text-center"
              >
                <div className="w-24 h-24 bg-furco-yellow/10 rounded-full flex items-center justify-center mb-8">
                  <PawPrint className="w-12 h-12 text-furco-yellow" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-black mb-4">No treats here!</h3>
                <p className="text-black/50 text-base md:text-lg mb-10 max-w-md">
                  We couldn't find any products matching your selection. Try adjusting your filters or search terms.
                </p>
                <Button
                  onClick={() => handleCategoryChange('All')}
                  size="lg"
                  className="bg-furco-yellow text-black hover:bg-black hover:text-white rounded-full px-12 h-12 font-bold shadow-lg transition-all duration-300"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
