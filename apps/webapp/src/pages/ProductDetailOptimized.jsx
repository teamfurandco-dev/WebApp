import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Star, Heart, Minus, Plus, Share2, Truck, RotateCcw, Play, PawPrint, Check, Shield, Baby, Wrench, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '@fur-co/utils';
import { getCategoryType } from '@fur-co/utils';
import { useWishlist } from '@/context/WishlistContext';
import { useTheme } from '@/context/ThemeContext';
import ProductQA from '@/components/product/ProductQA';
import FoodSpecs from '@/components/product/FoodSpecs';
import ToySpecs from '@/components/product/ToySpecs';
import AccessorySpecs from '@/components/product/AccessorySpecs';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeSection, setActiveSection] = useState('description');

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('GATEWAY');
  }, [switchMode]);

  // Determine category type for dynamic specs rendering
  const categoryType = product ? getCategoryType(product.category) : 'Accessories';

  // Get current pricing and stock info based on selected variant
  const currentPrice = selectedVariant ? selectedVariant.price_cents : product?.base_price_cents;
  const currentComparePrice = selectedVariant ? selectedVariant.compare_at_price_cents : product?.compare_at_price_cents;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product?.stock_quantity || 0;
  const currentSku = selectedVariant ? selectedVariant.sku : product?.sku;

  // Section refs for scroll navigation
  const descriptionRef = useRef(null);
  const ingredientsRef = useRef(null);
  const reviewsRef = useRef(null);
  const qaRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [productData, reviewsData, variantsData] = await Promise.all([
          api.getProductById(id),
          api.getReviews(id),
          api.getProductVariants(id)
        ]);

        setProduct(productData);
        setReviews(reviewsData);
        setProductVariants(variantsData);

        // Set default variant selection - prioritize actual variants over legacy variants
        if (variantsData?.length > 0) {
          setSelectedVariant(variantsData[0]);
        } else {
          // No variants available, use base product data
          setSelectedVariant(null);
        }

        // Fetch related products from same category
        if (productData?.category) {
          const related = await api.getProducts({
            category: productData.category,
            sort: 'rating'
          });
          setRelatedProducts(related.filter(p => p.id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'description', ref: descriptionRef },
        { id: 'ingredients', ref: ingredientsRef },
        { id: 'reviews', ref: reviewsRef },
        { id: 'qa', ref: qaRef }
      ];

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const refs = {
      description: descriptionRef,
      ingredients: ingredientsRef,
      reviews: reviewsRef,
      qa: qaRef
    };

    const targetRef = refs[sectionId];
    if (targetRef.current) {
      const offsetTop = targetRef.current.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const handleAddToCart = () => {
    const variantInfo = selectedVariant ? ` (${Object.values(selectedVariant.attributes || {}).join(' - ')})` : '';
    toast.success(`Added ${quantity} ${product.name}${variantInfo} to cart`);
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

  const discountPercentage = currentComparePrice && currentPrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] relative">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FBBF24' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-4 md:px-6 pt-20 pb-24 relative z-10">
        {/* PRODUCT HERO SECTION */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-16 items-start">

          {/* Left Column: Visual Showcase */}
          <div className="space-y-8 sticky top-20">
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
                      <Star key={i} className={cn("h-5 w-5", i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300")} />
                    ))}
                  </div>
                  <span className="font-bold text-lg ml-2">{product.rating || 0}</span>
                </div>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className="text-sm font-medium underline decoration-furco-yellow decoration-2 underline-offset-4 hover:text-furco-yellow transition-colors"
                >
                  Read {product.reviewsCount || 0} Reviews
                </button>
              </div>
            </motion.div>

            <Separator className="bg-black/5" />

            {/* Price Block */}
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-furco-yellow">
                {formatPrice(currentPrice)}
              </span>
              {currentComparePrice > currentPrice && (
                <span className="text-2xl text-black/40 line-through mb-2">{formatPrice(currentComparePrice)}</span>
              )}
              {discountPercentage > 0 && (
                <Badge className="mb-2 bg-[#1F1F1F] text-white hover:bg-black px-3 py-1 text-sm rounded-full shadow-lg">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Stock and SKU Info */}
            <div className="flex items-center gap-6 text-sm text-black/60">
              <div>
                <span className="font-medium">Stock: </span>
                <span className={cn(
                  "font-bold",
                  currentStock > 10 ? "text-green-600" : currentStock > 0 ? "text-orange-600" : "text-red-600"
                )}>
                  {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                </span>
              </div>
              {currentSku && (
                <div>
                  <span className="font-medium">SKU: </span>
                  <span className="font-mono text-xs">{currentSku}</span>
                </div>
              )}
            </div>

            {/* Variant Selection */}
            <div className="space-y-4">
              {productVariants.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Select Variant</span>
                    <span className="text-sm text-furco-yellow font-medium cursor-pointer hover:underline">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {productVariants.map((variant) => (
                      <motion.button
                        key={variant.sku}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border-2 flex flex-col items-center relative",
                          selectedVariant?.sku === variant.sku
                            ? "bg-furco-yellow border-furco-yellow text-black shadow-lg scale-105"
                            : "bg-white border-black/5 text-black/60 hover:border-furco-yellow/50"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{Object.values(variant.attributes || {}).join(' - ')}</span>
                        <span className="text-xs opacity-70">
                          {formatPrice(variant.price_cents)}
                        </span>
                        {variant.stock_quantity <= 5 && variant.stock_quantity > 0 && (
                          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            Low Stock
                          </span>
                        )}
                        {variant.stock_quantity === 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : product.variants?.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Select {product.variants[0]?.type || 'Option'}</span>
                    <span className="text-sm text-furco-yellow font-medium cursor-pointer hover:underline">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.variants[0].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedVariant({ variant_name: option })}
                        className={cn(
                          "px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 border-2",
                          selectedVariant?.variant_name === option
                            ? "bg-furco-yellow border-furco-yellow text-black shadow-lg scale-105"
                            : "bg-white border-black/5 text-black/60 hover:border-furco-yellow/50"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            {/* Add to Cart Block */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
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
                className="flex-1 h-14 rounded-full bg-furco-yellow hover:bg-furco-yellow-hover text-black text-lg font-bold shadow-[0_10px_20px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_30px_rgba(251,191,36,0.4)] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={currentStock === 0}
              >
                <span className="flex items-center gap-2">
                  {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  {currentStock > 0 && (
                    <PawPrint className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  )}
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

        {/* KEY HIGHLIGHTS SECTION */}
        <section className="mb-16">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {product.suitable_for?.slice(0, 5).map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-center">
                <div className="w-12 h-12 bg-furco-yellow/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-furco-brown" />
                </div>
                <span className="font-medium text-black/80">{feature}</span>
              </div>
            )) || [
              { icon: Shield, text: "Safe for puppies" },
              { icon: Baby, text: "Non-toxic material" },
              { icon: Wrench, text: "Heavy-duty build" },
              { icon: Sparkles, text: "Dental benefits" },
              { icon: Check, text: "Easy to clean" }
            ].map((highlight, i) => (
              <div key={i} className="flex items-center gap-3 text-center">
                <div className="w-12 h-12 bg-furco-yellow/20 rounded-full flex items-center justify-center">
                  <highlight.icon className="w-6 h-6 text-furco-brown" />
                </div>
                <span className="font-medium text-black/80">{highlight.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* STICKY SCROLL NAVIGATION */}
        <div className="sticky top-20 z-40 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-black/5 mb-12">
          <div className="flex gap-8 py-4 overflow-x-auto hide-scrollbar">
            {[
              { id: 'description', label: 'Description' },
              {
                id: 'ingredients',
                label: categoryType === 'Food' ? 'Nutrition' : 'Specifications'
              },
              { id: 'reviews', label: 'Reviews' },
              { id: 'qa', label: 'Questions & Answers' }
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => scrollToSection(nav.id)}
                className={cn(
                  "relative whitespace-nowrap px-4 py-2 font-serif font-bold text-lg transition-colors",
                  activeSection === nav.id
                    ? "text-black"
                    : "text-black/40 hover:text-black/70"
                )}
              >
                {nav.label}
                {activeSection === nav.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-furco-yellow rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT DESCRIPTION SECTION */}
        <section ref={descriptionRef} className="mb-24 scroll-mt-24">
          <h2 className="text-3xl font-serif font-bold mb-8">About the Product</h2>
          <div className="max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                {product.description}
              </p>

              {product.usage_instructions && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 mb-8">
                  <h3 className="font-bold text-xl mb-3">How to Use</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.usage_instructions}</p>
                </div>
              )}

              {product.ingredients && product.ingredients.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                    <div className="w-12 h-12 bg-furco-yellow/20 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-6 h-6 text-furco-brown" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Premium Ingredients</h4>
                    <p className="text-muted-foreground text-sm">Made with {product.ingredients.slice(0, 3).join(', ')} and more quality ingredients.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                    <div className="w-12 h-12 bg-furco-yellow/20 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-6 h-6 text-furco-brown" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Quality Assured</h4>
                    <p className="text-muted-foreground text-sm">Carefully formulated for optimal nutrition and health benefits.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                    <div className="w-12 h-12 bg-furco-yellow/20 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-6 h-6 text-furco-brown" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Trusted Brand</h4>
                    <p className="text-muted-foreground text-sm">From Fur & Co, your trusted partner in pet care and nutrition.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* INGREDIENTS/SPECIFICATIONS SECTION */}
        <section ref={ingredientsRef} className="mb-24 scroll-mt-24">
          <h2 className="text-3xl font-serif font-bold mb-8">
            {categoryType === 'Food' ? 'Nutritional Analysis' : 'Product Specifications'}
          </h2>

          {/* Dynamic specs component based on category type */}
          {categoryType === 'Food' && <FoodSpecs product={product} />}
          {categoryType === 'Toys' && <ToySpecs product={product} />}
          {categoryType === 'Accessories' && <AccessorySpecs product={product} />}
        </section>

        {/* USAGE & SUITABILITY SECTION */}
        <section className="mb-24">
          <h2 className="text-3xl font-serif font-bold mb-8">Usage & Suitability</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {product.suitable_for && product.suitable_for.length > 0 && (
                <div>
                  <h3 className="font-bold text-xl mb-3">Perfect for</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {product.suitable_for.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.usage_instructions && (
                <div>
                  <h3 className="font-bold text-xl mb-3">How to use</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.usage_instructions}
                  </p>
                </div>
              )}
            </div>
            <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-furco-yellow" />
                Safety Notes
              </h3>
              {product.safety_notes && product.safety_notes.length > 0 ? (
                <ul className="space-y-3 text-muted-foreground">
                  {product.safety_notes.map((note, i) => (
                    <li key={i}>• {note}</li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Follow usage instructions carefully</li>
                  <li>• Store in appropriate conditions</li>
                  <li>• Keep away from children if applicable</li>
                  <li>• Consult professionals if needed</li>
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS SECTION */}
        <section ref={reviewsRef} className="mb-24 scroll-mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold">Customer Reviews</h2>
            <Button variant="outline" className="rounded-full">Write a Review</Button>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-furco-yellow mb-1">{product.rating || 0}</div>
                <div className="flex text-furco-yellow justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300")} />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">{reviews.length} reviews</div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-2">
                  Based on {reviews.length} customer reviews
                </div>
                {/* Rating breakdown */}
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2 mb-1">
                      <span className="text-sm w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-furco-yellow h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Real reviews from database */}
          <div className="grid md:grid-cols-2 gap-8">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-500">
                      {review.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex text-furco-yellow mb-1">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={cn(
                            "h-4 w-4",
                            j < review.rating ? "fill-current" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <h4 className="font-bold text-lg">By {review.user_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Verified Purchase • {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "{review.comment}"
                </p>
                {review.images?.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Review"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-furco-yellow transition-colors">
                    👍 Helpful ({review.helpful_votes})
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </section>

        {/* QUESTIONS & ANSWERS SECTION */}
        <section ref={qaRef} className="mb-24 scroll-mt-24">
          <h2 className="text-3xl font-serif font-bold mb-8">Questions & Answers</h2>
          <ProductQA productId={id} />
        </section>

        {/* RELATED PRODUCTS SECTION */}
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
