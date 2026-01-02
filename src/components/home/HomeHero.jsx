import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TripleCTA from './TripleCTA';

const HERO_SLIDES = [
  {
    id: 0,
    title: "The Science of Happy",
    subtitle: "Veterinarian-Approved Essentials",
    description: "Discover our new range of scientifically formulated treats and supplements designed to boost your pet's vitality.",
    imageDesktop: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2686&auto=format&fit=crop", // Wide cinematic
    imageMobile: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?q=80&w=1000&auto=format&fit=crop", // Portrait
    cta: "Shop Essentials",
    path: "/products"
  },
  {
    id: 1,
    title: "Unlimited Adventure",
    subtitle: "Gear That Goes Further",
    description: "Durable, sustainable, and stylish gear built for the pets who were born to explore the great outdoors.",
    imageDesktop: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop",
    imageMobile: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop",
    cta: "Explore Unlimited",
    path: "/unlimited"
  },
  {
    id: 2,
    title: "Niche Luxuries",
    subtitle: "For the Distinguished Pet",
    description: "Handcrafted accessories and premium grooming products for those who appreciate the finer things in life.",
    imageDesktop: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2594&auto=format&fit=crop",
    imageMobile: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop",
    cta: "Discover Niche",
    path: "/niche"
  }
];

const HomeHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full bg-background flex flex-col">
      {/* 1. Full-Width Carousel */}
      <div className="relative w-full h-[90vh] md:h-[85vh] overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {/* Background Image with Art Direction */}
            <picture className="w-full h-full object-cover">
              <source media="(min-width: 768px)" srcSet={HERO_SLIDES[currentSlide].imageDesktop} />
              <img
                src={HERO_SLIDES[currentSlide].imageMobile}
                alt={HERO_SLIDES[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </picture>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/10 md:to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-20 pt-20">
              <div className="max-w-xl text-center md:text-left text-white space-y-6">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs md:text-sm font-bold tracking-widest uppercase mb-4">
                    {HERO_SLIDES[currentSlide].subtitle}
                  </span>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black leading-[1.1] mb-6 drop-shadow-xl">
                    {HERO_SLIDES[currentSlide].title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed mb-8 drop-shadow-md max-w-md mx-auto md:mx-0">
                    {HERO_SLIDES[currentSlide].description}
                  </p>
                  <Link to={HERO_SLIDES[currentSlide].path}>
                    <Button
                      size="lg"
                      className="bg-furco-yellow text-black hover:bg-white hover:text-black border-none text-lg px-10 py-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] group"
                    >
                      {HERO_SLIDES[currentSlide].cta}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation */}
        <div className="absolute bottom-32 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-4 md:left-8 z-20 flex md:flex-col gap-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Mobile nav hidden/adjusted, simply keeping dot indicators usually better for mobile, but requested design didn't specify. 
               Let's add simple arrows for desktop side. */}
        </div>

        {/* Desktop Side Arrows */}
        <button
          onClick={() => { setIsAutoPlaying(false); prevSlide(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm transition-all hidden md:block"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={() => { setIsAutoPlaying(false); nextSlide(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm transition-all hidden md:block"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-24 md:bottom-12 w-full flex justify-center gap-3 z-20">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => { setIsAutoPlaying(false); setCurrentSlide(index); }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-furco-yellow w-8" : "bg-white/50 hover:bg-white"
                }`}
            />
          ))}
        </div>
      </div>

      {/* 2. Triple CTA Layout - Overlapping */}
      <TripleCTA />
    </section>
  );
};

export default HomeHero;
