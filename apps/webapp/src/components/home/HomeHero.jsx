import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomeHero = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-80px-15vh)] flex flex-col justify-center overflow-hidden bg-background">
      {/* 1. Static Hero Image with Art Direction */}
      <picture className="absolute inset-0 w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2686&auto=format&fit=crop"
        />
        <img
          src="https://images.unsplash.com/photo-1510771463146-e89e6e86560e?q=80&w=1000&auto=format&fit=crop"
          alt="Fur & Co - The Science of Happy Pets"
          className="w-full h-full object-cover"
        />
      </picture>

      {/* 2. Gradient Overlay - Subtle & Premium */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-black/40 md:via-transparent md:to-transparent" />

      {/* 3. Content - Minimal & Editorial */}
      <div className="relative z-10 w-full flex flex-col justify-center px-4 md:px-20 h-full">
        <div className="max-w-4xl text-center md:text-left text-white space-y-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-serif font-medium leading-tight mb-5 drop-shadow-lg tracking-tight">
              Curated Care for <br /> <i className="font-serif italic">Your Best Friend.</i>
            </h1>
            <p className="text-lg md:text-xl text-white/95 font-sans font-light leading-relaxed mb-8 drop-shadow-md max-w-lg mx-auto md:mx-0">
              Science-backed nutrition and thoughtfully designed essentials for the ones who trust you the most.
            </p>
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-furco-cream hover:text-black border-none text-lg px-12 py-8 rounded-full transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] group"
              >
                Explore Essentials
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
