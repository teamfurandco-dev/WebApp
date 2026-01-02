import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sun, Gift, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HERO_SLIDES = [
  {
    id: 0,
    label: "New Arrivals",
    title: "Organic Chews",
    description: "Keep them busy with our all-natural, long-lasting chews. Perfect for teething puppies and power chewers.",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop",
    color: "bg-furco-yellow",
    icon: Star
  },
  {
    id: 1,
    label: "Summer Gear",
    title: "Cooling Vests",
    description: "Beat the heat with our new line of cooling gear. Lightweight, breathable, and stylish for every adventure.",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1000&auto=format&fit=crop",
    color: "bg-blue-400",
    icon: Sun
  },
  {
    id: 2,
    label: "Wellness Boxes",
    title: "Monthly Joy",
    description: "Curated boxes filled with treats, toys, and wellness products tailored to your pet's specific needs.",
    image: "https://images.unsplash.com/photo-1597633425046-08f5110420b5?q=80&w=1000&auto=format&fit=crop",
    color: "bg-green-400",
    icon: Gift
  },
  {
    id: 3,
    label: "Accessories",
    title: "Luxury Collars",
    description: "Handcrafted leather and sustainable fabric collars that combine durability with timeless elegance.",
    image: "https://images.unsplash.com/photo-1585837575652-267c041d77d4?q=80&w=1000&auto=format&fit=crop",
    color: "bg-purple-400",
    icon: ShoppingBag
  }
];

const HomeHero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full bg-furco-yellow overflow-hidden flex items-center pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-furco-yellow via-furco-yellow-light to-white/50" />
      
      {/* Decorative Blur */}
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 h-[85vh] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full gap-8">
          
          {/* Left Side: Navigation (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-4 pr-0 lg:pr-8">
            {HERO_SLIDES.map((slide, index) => {
              const isActive = activeSlide === index;
              return (
                <motion.button
                  key={slide.id}
                  onClick={() => setActiveSlide(index)}
                  className={cn(
                    "relative overflow-hidden rounded-2xl text-left transition-all duration-500 group",
                    isActive 
                      ? "h-40 bg-white/30 backdrop-blur-md border border-white/40 shadow-lg" 
                      : "h-20 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20"
                  )}
                  whileHover={{ scale: isActive ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "text-sm font-bold tracking-widest uppercase transition-colors duration-300",
                        isActive ? "text-black" : "text-black/40 group-hover:text-black/60"
                      )}>
                        0{index + 1}. {slide.label}
                      </span>
                      {isActive && (
                        <motion.div 
                          layoutId="activeIcon"
                          className="ml-auto"
                        >
                          <slide.icon className="w-5 h-5 text-black" />
                        </motion.div>
                      )}
                    </div>
                    
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2"
                      >
                        <h3 className="text-2xl font-serif font-bold text-black leading-tight">
                          {slide.title}
                        </h3>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Progress Bar for Active Slide */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeProgress"
                      className="absolute bottom-0 left-0 h-1 bg-black"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }} // Auto-play simulation visual
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Side: Main Ad Visual (8 cols) */}
          <div className="lg:col-span-8 relative h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20"
              >
                {/* Glass Container Layer */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-10" />
                
                {/* Background Image */}
                <img 
                  src={HERO_SLIDES[activeSlide].image} 
                  alt={HERO_SLIDES[activeSlide].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12 md:p-20">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="max-w-2xl"
                  >
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg">
                      {HERO_SLIDES[activeSlide].title}
                    </h2>
                    <p className="text-xl text-white/90 mb-8 font-medium leading-relaxed drop-shadow-md">
                      {HERO_SLIDES[activeSlide].description}
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-white text-black hover:bg-furco-yellow hover:text-black border-none text-lg px-10 py-8 rounded-full transition-all duration-300 shadow-xl group"
                    >
                      Shop Collection
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>

                {/* Shimmer Effect on Change */}
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "200%", opacity: 0.3 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 z-30 pointer-events-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeHero;
