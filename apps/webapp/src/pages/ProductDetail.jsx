import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Star, Heart, Minus, Plus, Share2, Truck, RotateCcw, Play, PawPrint, Check,
  Shield, Baby, Wrench, Sparkles, ChevronRight, ChevronLeft, Info, ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { cn, formatPrice, getCategoryType } from '@fur-co/utils';
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



  useEffect(() => {
    const fetchProduct = async () => {
      console.log('Fetching full product details for ID:', id);
      setLoading(true);
      try {
        const data = await api.getProductFull(id);
        console.log('Received product data:', data);

        if (data) {
          setProduct(data.product);
          setReviews(data.topReviews || []);
          setProductVariants(data.variants || []);
          setRelatedProducts(data.relatedProducts || []);

          // Set default variant selection
          if (data.variants?.length > 0) {
            setSelectedVariant(data.variants[0]);
          } else {
            setSelectedVariant(null);
          }
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
    const variantInfo = selectedVariant ? ` (${selectedVariant.name || Object.values(selectedVariant.attributes || {}).join(' - ')})` : '';
    toast.success(`Added ${quantity} ${product.name}${variantInfo} to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-furco-yellow border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-black/60 font-medium">Loading premium care...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl font-serif">Product not found</p>
          <Link to="/shop" className="text-furco-yellow font-bold underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const discountPercentage = currentComparePrice && currentPrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  return (
    <div className="w-full min-h-screen bg-white">
      {/* PIXEL PERFECT PRODUCT PAGE: Inspired by HUFT */}
      <div className="container px-4 md:px-8 pt-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[85vh] lg:min-h-0">

          {/* LEFT: GALLERY (Sticky) */}
          <div className="w-full lg:w-1/2">
            <div className="lg:sticky lg:top-28 space-y-6">
              <motion.div
                layoutId="product-image"
                className="relative aspect-square rounded-[2rem] bg-[#F9F9F9] overflow-hidden border border-black/[0.03]"
              >
                <img
                  src={product.images?.[activeImage] || product.image || '/placeholder-product.png'}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 transition-transform duration-700 hover:scale-105"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-6 left-6 bg-[#E11D48] text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-tight shadow-lg">
                    {discountPercentage}% OFF
                  </div>
                )}
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {(product.images?.length > 0 ? product.images : [product.image]).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "w-20 h-20 shrink-0 rounded-2xl border-2 transition-all p-2 bg-[#F9F9F9]",
                      activeImage === index ? "border-furco-yellow shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: BUY BLOCK & INFO */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#E1182A] uppercase">
                <Shield className="w-4 h-4" />
                <span>Certified Premium Care</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-bold text-black leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-furco-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating || 0) ? "fill-current" : "text-black/10")} />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{product.rating || '5.0'}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-black/10" />
                <span className="text-sm font-medium text-black/60">
                  {product.reviewsCount || reviews.length || 0} Reviews
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-bold text-black">
                  {formatPrice(currentPrice)}
                </span>
                {currentComparePrice > currentPrice && (
                  <span className="text-xl text-black/30 line-through font-medium">
                    {formatPrice(currentComparePrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">Inclusive of all taxes</p>
            </div>

            <Separator className="bg-black/[0.05]" />

            {/* SELECTION & ACTIONS */}
            <div className="space-y-6">
              {productVariants.length > 0 && (
                <div className="space-y-3">
                  <span className="text-sm font-bold text-black/80">Select Option</span>
                  <div className="flex flex-wrap gap-2">
                    {productVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all",
                          selectedVariant?.id === variant.id
                            ? "bg-black border-black text-white shadow-xl scale-[1.02]"
                            : "bg-white border-black/5 text-black/60 hover:border-black/20"
                        )}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center w-32 border-2 border-black/5 rounded-full p-1 justify-between bg-[#F9F9F9]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-black/40 hover:text-black"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-black/40 hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className="flex-1 h-14 rounded-2xl bg-furco-yellow text-black hover:bg-black hover:text-white transition-all font-bold text-lg shadow-lg shadow-furco-yellow/20"
                >
                  {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => toggleWishlist(product.id)}
                  className={cn(
                    "h-14 w-14 rounded-2xl border-2 transition-colors",
                    isWishlisted ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-black/5"
                  )}
                >
                  <Heart className={cn("h-6 w-6", isWishlisted && "fill-current")} />
                </Button>
              </div>

              {/* TRUST INDICATORS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FFF5F1] border border-[#FFD8CC]">
                  <Truck className="w-5 h-5 text-[#E1182A]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">Delivery</span>
                    <span className="text-xs font-bold text-black/80">3-5 Business Days</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7]">
                  <RotateCcw className="w-5 h-5 text-[#16A34A]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">Returns</span>
                    <span className="text-xs font-bold text-black/80">7 Days Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC INFORMATION ACCORDIONS (PIXEL PERFECT) */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full" defaultValue="description">

            {/* 1. Description */}
            <AccordionItem value="description" className="border-t border-black/[0.06]">
              <AccordionTrigger className="text-lg font-bold hover:no-underline py-5 text-black/80">
                Product Description
              </AccordionTrigger>
              <AccordionContent className="pb-8 prose prose-neutral max-w-none">
                <div className="text-black/70 leading-relaxed text-base">
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div>
                {product.descriptionSections && Array.isArray(product.descriptionSections) && product.descriptionSections.map((section, idx) => (
                  <div key={idx} className="mt-6 space-y-2">
                    <h4 className="font-bold text-black">{section.title}</h4>
                    <div className="text-black/60 text-sm">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* 2. Specifications / Additional Info */}
            {(product.specifications || product.usage_instructions) && (
              <AccordionItem value="specifications" className="border-t border-black/[0.06]">
                <AccordionTrigger className="text-lg font-bold hover:no-underline py-5 text-black/80">
                  General Information
                </AccordionTrigger>
                <AccordionContent className="pb-8 space-y-6">
                  {product.specifications && (
                    <div className="prose prose-neutral max-w-none prose-sm text-black/70">
                      <ReactMarkdown>{product.specifications}</ReactMarkdown>
                    </div>
                  )}
                  {product.usage_instructions && (
                    <div className="bg-[#F9F9F9] p-5 rounded-2xl border border-black/[0.03]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/30 block mb-2">Feeding / Usage Guide</span>
                      <div className="text-black/60 text-sm leading-relaxed">
                        <ReactMarkdown>{product.usage_instructions}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* 3. Ingredients & Safety */}
            {(product.ingredients || product.safety_notes) && (
              <AccordionItem value="ingredients" className="border-t border-black/[0.06]">
                <AccordionTrigger className="text-lg font-bold hover:no-underline py-5 text-black/80">
                  Ingredients & Safety
                </AccordionTrigger>
                <AccordionContent className="pb-8 space-y-6">
                  {product.ingredients && (
                    <div className="text-black/70 prose prose-sm max-w-none">
                      <ReactMarkdown>{product.ingredients}</ReactMarkdown>
                    </div>
                  )}
                  {product.safety_notes && (
                    <div className="flex gap-4 p-4 rounded-2xl bg-red-50/30 border border-red-100/50">
                      <Info className="w-5 h-5 text-red-400 shrink-0" />
                      <div className="text-xs text-red-900/60 leading-relaxed italic">
                        <ReactMarkdown>{product.safety_notes}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* 4. FAQs */}
            <AccordionItem value="faq" className="border-t border-black/[0.06] border-b-0">
              <AccordionTrigger className="text-lg font-bold hover:no-underline py-5 text-black/80">
                Product FAQs
              </AccordionTrigger>
              <AccordionContent className="pb-8">
                <ProductQA productId={product.id} />
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 pt-20 border-t border-black/[0.05]">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-furco-yellow">Curated for you</span>
                <h2 className="text-3xl font-serif font-bold">You Might Also Love</h2>
              </div>
              <Link to="/shop" className="text-sm font-bold text-black/40 hover:text-black transition-colors underline underline-offset-8">
                View Collection
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
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
