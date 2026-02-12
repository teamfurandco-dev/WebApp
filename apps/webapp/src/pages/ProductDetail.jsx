import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const relatedScrollRef = useRef(null);
  const descriptionRef = useRef(null);
  const ingredientsRef = useRef(null);
  const reviewsRef = useRef(null);
  const qaRef = useRef(null);
  const [activeSection, setActiveSection] = useState('description');

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const { switchMode } = useTheme();

  const [searchParams] = useSearchParams();
  const unlimitedSource = searchParams.get('source');
  const unlimitedMode = searchParams.get('mode');
  const unlimitedBudget = searchParams.get('budget');
  const unlimitedPetType = searchParams.get('petType');
  const unlimitedDraftId = searchParams.get('draftId');

  useEffect(() => {
    switchMode(unlimitedSource === 'unlimited' ? 'CORE' : 'GATEWAY');
  }, [switchMode, unlimitedSource]);

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
  const scrollRelated = (direction) => {
    if (relatedScrollRef.current) {
      const scrollAmount = 340; // Card width + gap
      relatedScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant?.id) {
      toast.error('Please select an option before adding to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      const variantInfo = selectedVariant ? ` (${selectedVariant.name || Object.values(selectedVariant.attributes || {}).join(' - ')})` : '';

      if (unlimitedSource === 'unlimited') {
        let draftId = unlimitedDraftId;

        if (!draftId) {
          // Create new draft if none exists
          const draft = await api.unlimited.createDraft({
            mode: unlimitedMode,
            budget: Number(unlimitedBudget),
            petType: unlimitedPetType,
            products: [{
              productId: product.id,
              variantId: selectedVariant.id,
              quantity,
              price: selectedVariant.price_cents // Verify price field name
            }]
          });
          draftId = draft.draftId;
        } else {
          // Update existing draft
          await api.unlimited.updateDraftProducts(draftId, {
            action: 'add',
            productId: product.id,
            variantId: selectedVariant.id,
            quantity
          });
        }

        toast.success(`Added to your box!`);

        // Navigate back with draftId to preserve state
        const params = new URLSearchParams({
          budget: unlimitedBudget,
          petType: unlimitedPetType,
          mode: unlimitedMode || 'monthly',
          draftId
        });

        navigate(`/unlimited-fur/${unlimitedMode || 'monthly'}/shop?${params.toString()}`);
        return;
      }

      await api.addToCart(product.id, selectedVariant.id, quantity);

      toast.success(`Added ${quantity} ${product.name}${variantInfo} to cart`, {
        action: {
          label: 'View Cart',
          onClick: () => navigate('/cart')
        }
      });
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error(error.message || 'Failed to add item. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5D2A5]/30 border border-[#D4AF37]/20 text-[10px] font-black tracking-[0.05em] text-[#8B6E1C] uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>Certified Premium Care</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-peace-sans font-bold text-black leading-[1.15] tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 text-black/40 text-xs font-bold uppercase tracking-widest">
                <PawPrint className="w-4 h-4 fill-current" />
                <span>Pet e-commerce</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex text-furco-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating || 0) ? "fill-current" : "text-black/10")} />
                    ))}
                  </div>
                  <span className="text-sm font-bold ml-1">{product.rating || '5.0'}</span>
                </div>
                <span className="text-sm font-medium text-black/40">
                  ({product.reviewsCount || reviews.length || 45} Reviews)
                </span>
              </div>

              <div className="pt-2">
                <div className="text-3xl font-black text-black">
                  {formatPrice(currentPrice)}
                </div>
                <p className="text-[10px] text-black/30 uppercase tracking-[0.1em] font-bold mt-1 leading-none">Inclusive of all taxes</p>
              </div>
            </div>

            <Separator className="bg-black/[0.05]" />

            {/* SELECTION & ACTIONS */}
            <div className="space-y-6">
              {productVariants.length > 0 && (
                <div className="space-y-4">
                  <span className="text-sm font-bold text-black block tracking-tight">Select Option</span>
                  <div className="flex flex-wrap gap-3">
                    {productVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "px-6 py-2 rounded-full text-sm font-bold border-2 transition-all duration-300",
                          selectedVariant?.id === variant.id
                            ? "bg-furco-yellow border-furco-yellow text-black shadow-md scale-[1.02]"
                            : "bg-white border-black/[0.08] text-black/60 hover:border-black/20"
                        )}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-stretch gap-4">
                <div className="flex items-center border border-black/[0.08] rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors text-black/40 hover:text-black"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-10 text-center font-bold text-sm tracking-tighter">{quantity}</div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors text-black/40 hover:text-black border-l border-black/[0.08]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0 || isAddingToCart}
                  className="flex-1 h-12 rounded-xl bg-furco-yellow text-black hover:bg-black hover:text-white transition-all font-bold text-sm shadow-none"
                >
                  {isAddingToCart ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Adding...
                    </div>
                  ) : currentStock === 0 ? 'Out of Stock' : (unlimitedSource === 'unlimited' ? 'Add to Box' : 'Add to Cart')}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => toggleWishlist(product.id, selectedVariant?.id)}
                  className={cn(
                    "h-12 w-12 rounded-xl border border-black/[0.08] transition-all bg-white shadow-sm hover:scale-105",
                    isWishlisted ? "text-red-500 fill-current" : "text-black/60"
                  )}
                >
                  <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                </Button>
              </div>

              {/* TRUST INDICATORS - MATCHING SCREENSHOT */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFF7E0] border border-[#ffcc00]/10">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Truck className="w-5 h-5 text-black/80" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-black leading-tight">Delivery:</span>
                    <span className="text-[11px] font-medium text-black/60 leading-tight">3-5 Business Days</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFE5E5] border border-[#E1182A]/5">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <RotateCcw className="w-5 h-5 text-black/80" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-black leading-tight">Returns:</span>
                    <span className="text-[11px] font-medium text-black/60 leading-tight">7 Days Return</span>
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
              <AccordionTrigger className="text-xl md:text-2xl font-peace-sans font-bold hover:no-underline py-6 text-black/90">
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
                <AccordionTrigger className="text-xl md:text-2xl font-peace-sans font-bold hover:no-underline py-6 text-black/90">
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
                <AccordionTrigger className="text-xl md:text-2xl font-peace-sans font-bold hover:no-underline py-6 text-black/90">
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
              <AccordionTrigger className="text-xl md:text-2xl font-peace-sans font-bold hover:no-underline py-6 text-black/90">
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
          <section className="mt-24 pt-16 border-t border-black/[0.05]">
            <div className="flex items-end justify-between mb-10">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-peace-sans font-bold text-black">You Might Also Love</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollRelated('left')}
                  className="w-10 h-10 rounded-full border border-black/[0.1] flex items-center justify-center hover:bg-black hover:text-white transition-all group active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => scrollRelated('right')}
                  className="w-10 h-10 rounded-full border border-black/[0.1] flex items-center justify-center hover:bg-black hover:text-white transition-all group active:scale-95"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            <div
              ref={relatedScrollRef}
              className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {relatedProducts.map((p) => (
                <div key={p.id} className="min-w-[280px] w-[80vw] md:w-[320px] snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div >
  );
};

export default ProductDetail;
