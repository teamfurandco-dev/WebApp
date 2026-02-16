import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useProduct } from '@/hooks/useQueries';
import ProductQA from '@/components/product/ProductQA';
import FoodSpecs from '@/components/product/FoodSpecs';
import ToySpecs from '@/components/product/ToySpecs';
import AccessorySpecs from '@/components/product/AccessorySpecs';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productData, isLoading } = useProduct(id);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = productData?.product ? isInWishlist(productData.product.id) : false;
  const { switchMode } = useTheme();

  const [searchParams] = useSearchParams();
  const unlimitedSource = searchParams.get('source');
  const unlimitedMode = searchParams.get('mode');
  const unlimitedBudget = searchParams.get('budget');
  const unlimitedPetType = searchParams.get('petType');
  const unlimitedDraftId = searchParams.get('draftId');

  const product = productData?.product || null;
  const reviews = productData?.topReviews || [];
  const productVariants = productData?.variants || [];
  const relatedProducts = productData?.relatedProducts || [];
  const selectedVariant = productVariants[0] || null;
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const relatedScrollRef = useRef(null);
  const descriptionRef = useRef(null);
  const ingredientsRef = useRef(null);
  const reviewsRef = useRef(null);
  const qaRef = useRef(null);
  const [activeSection, setActiveSection] = useState('description');

  useEffect(() => {
    switchMode(unlimitedSource === 'unlimited' ? 'CORE' : 'GATEWAY');
  }, [switchMode, unlimitedSource]);

  const categoryType = product ? getCategoryType(product.category) : 'Accessories';

  const currentPrice = selectedVariant ? selectedVariant.price_cents : product?.base_price_cents;
  const currentComparePrice = selectedVariant ? selectedVariant.compare_at_price_cents : product?.compare_at_price_cents;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product?.stock_quantity || 0;
  const currentSku = selectedVariant ? selectedVariant.sku : product?.sku;

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
      const scrollAmount = 340;
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
          const draft = await api.unlimited.createDraft({
            mode: unlimitedMode,
            budget: Number(unlimitedBudget),
            petType: unlimitedPetType,
            products: [{
              productId: product.id,
              variantId: selectedVariant.id,
              quantity,
              price: selectedVariant.price_cents
            }]
          });
          draftId = draft.draftId;
        } else {
          await api.unlimited.updateDraftProducts(draftId, {
            action: 'add',
            productId: product.id,
            variantId: selectedVariant.id,
            quantity
          });
        }

        toast.success(`Added to your box!`);

        const params = new URLSearchParams({
          budget: unlimitedBudget,
          petType: unlimitedPetType,
          mode: unlimitedMode || 'monthly',
          draftId
        });

        navigate(`/unlimited-fur/${unlimitedMode || 'monthly'}/shop?${params.toString()}`);
        return;
      }

      await addToCart(product.id, selectedVariant.id, quantity);

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

  if (isLoading) {
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
    <div className="w-full min-h-screen bg-white pb-20 lg:pb-0">
      <div className="container px-3 md:px-8 pt-16 md:pt-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 min-h-[85vh] lg:min-h-0">

          {/* LEFT: GALLERY (Sticky) */}
          <div className="w-full lg:w-1/2">
            <div className="lg:sticky lg:top-28 space-y-4 md:space-y-6">
              <motion.div
                layoutId="product-image"
                className="relative aspect-square rounded-2xl md:rounded-[2rem] bg-[#F9F9F9] overflow-hidden border border-black/[0.03]"
              >
                <img
                  src={product.images?.[activeImage] || product.image || '/placeholder-product.png'}
                  alt={product.name}
                  className="w-full h-full object-cover md:object-contain transition-transform duration-700 hover:scale-105"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-[#E11D48] text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-tight shadow-lg">
                    {discountPercentage}% OFF
                  </div>
                )}
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-4 scrollbar-hide">
                {(product.images?.length > 0 ? product.images : [product.image]).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl md:rounded-2xl border-2 transition-all p-1.5 md:p-2 bg-[#F9F9F9]",
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
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5D2A5]/30 border border-[#D4AF37]/20 text-[10px] font-bold tracking-[0.05em] text-[#8B6E1C] uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>Certified Premium Care</span>
              </div>

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-normal text-black leading-[1.15] tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 text-black/40 text-xs font-medium uppercase tracking-widest">
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
                  <span className="text-sm font-medium ml-1">{product.rating || '5.0'}</span>
                </div>
                <span className="text-sm font-medium text-black/40">
                  ({product.reviewsCount || reviews.length || 45} Reviews)
                </span>
              </div>

              <div className="pt-1 md:pt-2">
                <div className="text-2xl md:text-3xl font-medium text-black">
                  {formatPrice(currentPrice)}
                </div>
                <p className="text-[10px] text-black/30 uppercase tracking-[0.1em] font-medium mt-1 leading-none">Inclusive of all taxes</p>
              </div>
            </div>

            <Separator className="bg-black/[0.05]" />

            {/* SELECTION & ACTIONS */}
            <div className="space-y-4 md:space-y-6">
              {productVariants.length > 0 && (
                <div className="space-y-3 md:space-y-4">
                  <span className="text-sm font-medium text-black block tracking-tight">Select Option</span>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {productVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "px-4 md:px-6 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300",
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

              <div className="flex items-stretch gap-2 md:gap-4">
                <div className="flex items-center border border-black/[0.08] rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors text-black/40 hover:text-black"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-10 text-center font-medium text-sm tracking-tighter">{quantity}</div>
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
                  className="flex-1 h-10 md:h-12 rounded-xl bg-furco-yellow text-black hover:bg-black hover:text-white transition-all font-medium text-sm shadow-none"
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
                    "h-10 w-10 md:h-12 md:w-12 rounded-xl border border-black/[0.08] transition-all bg-white shadow-sm hover:scale-105",
                    isWishlisted ? "text-red-500 fill-current" : "text-black/60"
                  )}
                >
                  <Heart className={cn("h-4 w-4 md:h-5 md:w-5", isWishlisted && "fill-current")} />
                </Button>
              </div>

              {/* TRUST INDICATORS */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-[#FFF7E0] border border-[#ffcc00]/10">
                  <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Truck className="w-4 md:w-5 h-4 md:h-5 text-black/80" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-black leading-tight">Delivery:</span>
                    <span className="text-[11px] font-normal text-black/60 leading-tight">3-5 Business Days</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-[#FFE5E5] border border-[#E1182A]/5">
                  <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <RotateCcw className="w-4 md:w-5 h-4 md:h-5 text-black/80" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-black leading-tight">Returns:</span>
                    <span className="text-[11px] font-normal text-black/60 leading-tight">7 Days Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC INFORMATION ACCORDIONS */}
        <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full" defaultValue="description">

            <AccordionItem value="description" className="border-t border-black/[0.06]">
              <AccordionTrigger className="[&[data-state=open]>div]:underline hover:no-underline py-4 md:py-6">
                <div className="text-lg md:text-xl font-medium text-black/90 text-left">
                  Product Description
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 md:pb-8">
                <div className="text-black/70 leading-relaxed text-sm md:text-base">
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div>
                {product.descriptionSections && Array.isArray(product.descriptionSections) && product.descriptionSections.map((section, idx) => (
                  <div key={idx} className="mt-4 md:mt-6 space-y-2">
                    <h4 className="font-medium text-black">{section.title}</h4>
                    <div className="text-black/60 text-sm">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {(product.specifications || product.usage_instructions) && (
              <AccordionItem value="specifications" className="border-t border-black/[0.06]">
                <AccordionTrigger className="[&[data-state=open]>div]:underline hover:no-underline py-4 md:py-6">
                  <div className="text-lg md:text-xl font-medium text-black/90 text-left">
                    General Information
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 md:pb-8 space-y-4 md:space-y-6">
                  {product.specifications && (
                    <div className="text-black/70 text-sm md:text-base">
                      <ReactMarkdown>{product.specifications}</ReactMarkdown>
                    </div>
                  )}
                  {product.usage_instructions && (
                    <div className="bg-[#F9F9F9] p-4 md:p-5 rounded-xl md:rounded-2xl border border-black/[0.03]">
                      <span className="text-[10px] font-medium uppercase tracking-widest text-black/30 block mb-2">Feeding / Usage Guide</span>
                      <div className="text-black/60 text-sm leading-relaxed">
                        <ReactMarkdown>{product.usage_instructions}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {(product.ingredients || product.safety_notes) && (
              <AccordionItem value="ingredients" className="border-t border-black/[0.06]">
                <AccordionTrigger className="[&[data-state=open]>div]:underline hover:no-underline py-4 md:py-6">
                  <div className="text-lg md:text-xl font-medium text-black/90 text-left">
                    Ingredients & Safety
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 md:pb-8 space-y-4 md:space-y-6">
                  {product.ingredients && (
                    <div className="text-black/70 text-sm md:text-base">
                      <ReactMarkdown>{product.ingredients}</ReactMarkdown>
                    </div>
                  )}
                  {product.safety_notes && (
                    <div className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-red-50/30 border border-red-100/50">
                      <Info className="w-4 md:w-5 h-4 md:h-5 text-red-400 shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm text-red-900/60 leading-relaxed italic">
                        <ReactMarkdown>{product.safety_notes}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="faq" className="border-t border-black/[0.06] border-b-0">
              <AccordionTrigger className="[&[data-state=open]>div]:underline hover:no-underline py-4 md:py-6">
                <div className="text-lg md:text-xl font-medium text-black/90 text-left">
                  Product FAQs
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 md:pb-8">
                <ProductQA productId={product.id} />
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-black/[0.05]">
            <div className="flex items-end justify-between mb-6 md:mb-10">
              <div className="space-y-1">
                <h2 className="text-xl md:text-3xl font-medium text-black">You Might Also Love</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollRelated('left')}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/[0.1] flex items-center justify-center hover:bg-black hover:text-white transition-all group active:scale-95"
                >
                  <ChevronLeft className="w-4 md:w-5 h-4 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => scrollRelated('right')}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/[0.1] flex items-center justify-center hover:bg-black hover:text-white transition-all group active:scale-95"
                >
                  <ChevronRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            <div
              ref={relatedScrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-6 md:pb-8 hide-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {relatedProducts.map((p) => (
                <div key={p.id} className="min-w-[160px] w-[70vw] md:w-[280px] md:min-w-[280px] snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Add to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 p-3 md:p-4 z-40 lg:hidden shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex flex-col flex-1">
            <span className="text-xs text-black/50 font-medium">Total</span>
            <span className="text-lg font-medium text-black">{formatPrice(currentPrice * quantity)}</span>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={currentStock === 0 || isAddingToCart}
            className="flex-1 h-12 rounded-xl bg-furco-yellow text-black hover:bg-black hover:text-white transition-all font-medium text-sm shadow-none"
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Adding...
              </div>
            ) : currentStock === 0 ? 'Out of Stock' : (unlimitedSource === 'unlimited' ? 'Add to Box' : 'Add to Cart')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
