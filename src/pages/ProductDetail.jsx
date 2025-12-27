import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Star, Heart, Minus, Plus, Share2, Truck, RotateCcw, Play, PawPrint, Check } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import ProductQA from '@/components/product/ProductQA';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        setProduct(data);
        if (data && data.variants.length > 0) {
          setSelectedVariant(data.variants[0].options[0]);
        }
        
        const allProducts = await api.getProducts({ category: data?.category });
        setRelatedProducts(allProducts.filter(p => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] container py-12 space-y-8">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] w-full rounded-[2rem]" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container py-12 text-center">Product not found</div>;
  }

  // Mocking specific data for the "Wholesome Kibble" feel if missing
  const discountPercentage = product.compare_at_price_cents 
    ? Math.round(((product.compare_at_price_cents - product.base_price_cents) / product.compare_at_price_cents) * 100)
    : 0;

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] relative">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FBBF24' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-4 md:px-6 pt-32 pb-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-24 items-start">
          
          {/* Left Column: Visual Showcase */}
          <div className="space-y-8 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square rounded-[2.5rem] bg-white shadow-2xl overflow-hidden group"
            >
               <img 
                 src={product.images?.[activeImage] || product.image} 
                 alt={product.name} 
                 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               {/* 3D Lift Effect Shadow */}
               <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none rounded-[2.5rem]" />
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-4 justify-center">
              {(product.images || [product.image]).map((img, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-md",
                    activeImage === index 
                      ? "border-furco-yellow scale-110 ring-4 ring-furco-yellow/20" 
                      : "border-white hover:border-furco-yellow/50"
                  )}
                >
                  <img src={img} alt={`View ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
              {/* Video Button Mock */}
              <button className="relative w-20 h-20 rounded-full overflow-hidden bg-[#1F1F1F] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 group">
                <Play className="w-8 h-8 fill-current group-hover:text-furco-yellow transition-colors" />
              </button>
            </div>
          </div>

          {/* Right Column: Product Details & CTA */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm font-bold tracking-[0.2em] text-black/60 uppercase mb-2 block">Fur & Co</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1F1F1F] leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <div className="flex text-furco-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("h-5 w-5", i < Math.floor(product.rating) ? "fill-current" : "text-gray-300")} />
                    ))}
                  </div>
                  <span className="font-bold text-lg ml-2">{product.rating}</span>
                </div>
                <a href="#reviews" className="text-sm font-medium underline decoration-furco-yellow decoration-2 underline-offset-4 hover:text-furco-yellow transition-colors">
                  Read {product.reviewsCount} Reviews
                </a>
              </div>
            </motion.div>

            <Separator className="bg-black/5" />

            {/* Price Block */}
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-furco-yellow">{formatPrice(product.base_price_cents)}</span>
              {product.compare_at_price_cents > product.base_price_cents && (
                <span className="text-2xl text-black/40 line-through mb-2">{formatPrice(product.compare_at_price_cents)}</span>
              )}
              {discountPercentage > 0 && (
                <Badge className="mb-2 bg-[#1F1F1F] text-white hover:bg-black px-3 py-1 text-sm rounded-full shadow-lg">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Select Size</span>
                <span className="text-sm text-furco-yellow font-medium cursor-pointer hover:underline">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {['1.5kg', '3kg', '7kg', '12kg'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedVariant(size)}
                    className={cn(
                      "px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 border-2",
                      selectedVariant === size
                        ? "bg-furco-yellow border-furco-yellow text-black shadow-lg scale-105"
                        : "bg-white border-black/5 text-black/60 hover:border-furco-yellow/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Block */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {/* Custom Quantity Input */}
              <div className="flex items-center bg-[#1F1F1F] rounded-full p-1.5 shadow-xl w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-transparent text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly 
                  className="w-12 bg-transparent text-center text-white font-bold text-lg focus:outline-none"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-transparent text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button 
                size="lg" 
                className="flex-1 h-14 rounded-full bg-furco-yellow hover:bg-furco-yellow-hover text-black text-lg font-bold shadow-[0_10px_20px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_30px_rgba(251,191,36,0.4)] transition-all duration-300 group" 
                onClick={handleAddToCart}
              >
                <span className="flex items-center gap-2">
                  Add to Cart
                  <PawPrint className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </span>
              </Button>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "h-14 w-14 rounded-full border-2 transition-colors",
                  isWishlisted 
                    ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-600" 
                    : "border-black/10 hover:border-furco-yellow hover:text-furco-yellow hover:bg-white"
                )}
              >
                <Heart className={cn("h-6 w-6", isWishlisted && "fill-current")} />
              </Button>
            </div>

            {/* Trust & Delivery */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
                <div className="p-2 bg-furco-yellow/10 rounded-full text-furco-yellow">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">Free Delivery</span>
                  <span className="text-xs text-muted-foreground">Orders over ₹499</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
                <div className="p-2 bg-furco-yellow/10 rounded-full text-furco-yellow">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">Easy Returns</span>
                  <span className="text-xs text-muted-foreground">30-Day Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs */}
        <div className="max-w-5xl mx-auto mb-24">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-black/10 bg-transparent p-0 h-auto gap-8 overflow-x-auto hide-scrollbar">
              {['Description', 'Ingredients', 'Reviews', 'Q&A'].map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab.toLowerCase().replace('&', '')} 
                  className="relative rounded-none border-none bg-transparent px-0 py-4 text-lg font-serif font-bold text-black/40 data-[state=active]:text-black data-[state=active]:shadow-none transition-colors whitespace-nowrap"
                >
                  {tab === 'Reviews' ? `Customer Reviews (${product.reviewsCount})` : tab === 'Q&A' ? 'Questions & Answers' : `Product ${tab}`}
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-furco-yellow scale-x-0 transition-transform duration-300 data-[state=active]:scale-x-100 origin-left" />
                  {/* Active Indicator Hack for Radix UI Tabs Trigger to animate custom underline */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-furco-yellow scale-x-0 transition-transform duration-300 origin-left [.data-[state=active]_&]:scale-x-100" />
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-12 min-h-[300px]">
              <TabsContent value="description" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="prose prose-lg max-w-none">
                  <h3 className="font-serif font-bold text-2xl mb-4">Give your dog the nutrition they deserve.</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {product.description} Our Wholesome Kibble is crafted with love and science to provide a balanced diet for your adult dog. 
                    Packed with high-quality proteins and essential nutrients, it supports muscle maintenance, shiny coats, and boundless energy.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {[
                      { title: "Muscle Health", desc: "High-quality protein sources to support lean muscle mass." },
                      { title: "Digestive Care", desc: "Prebiotics and fiber for optimal gut health and digestion." },
                      { title: "Shiny Coat", desc: "Omega-3 and Omega-6 fatty acids for healthy skin and fur." }
                    ].map((benefit, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                        <div className="w-12 h-12 bg-furco-yellow/20 rounded-full flex items-center justify-center mb-4">
                          <Check className="w-6 h-6 text-furco-brown" />
                        </div>
                        <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                        <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm">
                  <h3 className="font-serif font-bold text-2xl mb-6">Nutritional Analysis</h3>
                  <div className="overflow-hidden rounded-xl border border-black/10">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-4 font-bold text-sm uppercase tracking-wider text-black/60">Nutrient</th>
                          <th className="p-4 font-bold text-sm uppercase tracking-wider text-black/60">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {[
                          { name: "Crude Protein", amount: "26.0% min" },
                          { name: "Crude Fat", amount: "15.0% min" },
                          { name: "Crude Fiber", amount: "4.0% max" },
                          { name: "Moisture", amount: "10.0% max" },
                          { name: "Omega-6 Fatty Acids", amount: "2.5% min" },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 font-medium">{row.name}</td>
                            <td className="p-4 text-muted-foreground">{row.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                          <img src={`https://source.unsplash.com/random/100x100?dog&sig=${i}`} alt="User Dog" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex text-furco-yellow mb-1">
                            {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                          </div>
                          <h4 className="font-bold text-lg">My dog loves it!</h4>
                          <p className="text-sm text-muted-foreground">Verified Purchase • 2 days ago</p>
                        </div>
                      </div>
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        "Absolutely amazing quality. My Golden Retriever has been eating this for a month and his energy levels are through the roof!"
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="qa" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <ProductQA productId={id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Frequently Bought Together */}
        {relatedProducts.length >= 2 && (
          <section className="mb-24">
            <h2 className="text-3xl font-serif font-bold mb-8">Frequently Bought Together</h2>
            <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-sm">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Bundle Items */}
                <div className="flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                  {/* Main Product */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-gray-50 border border-black/5 p-2">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold line-clamp-1">{product.name}</h4>
                      <span className="text-furco-yellow font-bold">{formatPrice(product.base_price_cents)}</span>
                    </div>
                  </div>

                  <Plus className="w-6 h-6 text-black/20 shrink-0" />

                  {/* Related Item 1 */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-gray-50 border border-black/5 p-2">
                      <img src={relatedProducts[0].images[0]} alt={relatedProducts[0].name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold line-clamp-1">{relatedProducts[0].name}</h4>
                      <span className="text-black/60 font-bold">{formatPrice(relatedProducts[0].base_price_cents)}</span>
                    </div>
                  </div>

                  <Plus className="w-6 h-6 text-black/20 shrink-0" />

                  {/* Related Item 2 */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-gray-50 border border-black/5 p-2">
                      <img src={relatedProducts[1].images[0]} alt={relatedProducts[1].name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold line-clamp-1">{relatedProducts[1].name}</h4>
                      <span className="text-black/60 font-bold">{formatPrice(relatedProducts[1].base_price_cents)}</span>
                    </div>
                  </div>
                </div>

                {/* Total & CTA */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-center gap-6 lg:border-l lg:pl-12 border-black/10">
                  <div className="text-center lg:text-right">
                    <p className="text-muted-foreground mb-1">Total Price:</p>
                    <div className="flex items-baseline justify-center lg:justify-end gap-2">
                      <span className="text-3xl font-bold text-black">
                        {formatPrice(product.base_price_cents + relatedProducts[0].base_price_cents + relatedProducts[1].base_price_cents)}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full sm:w-auto bg-black text-white hover:bg-furco-brown rounded-full px-8 py-6 text-lg font-bold shadow-lg">
                    Add All 3 to Cart
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold">You May Also Like</h2>
              <Link to="/products" className="text-furco-yellow font-bold hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
