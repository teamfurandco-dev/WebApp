import { PawPrint, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Newsletter = () => {
  return (
    <section className="relative bg-furco-yellow py-24 overflow-hidden w-full">
      {/* Paw Print Trail */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Trail of paws walking from bottom left to the input */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <PawPrint className="absolute bottom-[-20px] left-[5%] w-12 h-12 text-furco-brown/20 rotate-[15deg]" />
          <PawPrint className="absolute bottom-[10%] left-[12%] w-10 h-10 text-furco-brown/30 rotate-[30deg]" />
          <PawPrint className="absolute bottom-[25%] left-[20%] w-12 h-12 text-furco-brown/40 rotate-[45deg]" />
          <PawPrint className="absolute bottom-[35%] left-[30%] w-10 h-10 text-furco-brown/50 rotate-[60deg]" />
          <PawPrint className="absolute bottom-[40%] left-[42%] w-12 h-12 text-furco-brown/60 rotate-[75deg]" />
          <PawPrint className="absolute bottom-[45%] left-[55%] w-10 h-10 text-furco-brown/70 rotate-[90deg]" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black tracking-tight">
              Join the Fur & Co Family
            </h2>
            <p className="text-lg text-black/70 max-w-xl mx-auto font-medium">
              Get exclusive offers, pet care tips, and early access to new products delivered straight to your inbox.
            </p>
          </div>

          <form className="max-w-md mx-auto relative" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex items-center">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full h-16 rounded-full pl-8 pr-36 bg-white border-2 border-transparent focus:border-black/10 text-lg shadow-xl placeholder:text-black/30"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-2 bottom-2 rounded-full bg-furco-brown hover:bg-furco-brown-dark text-white px-8 font-bold text-base transition-all duration-300 shadow-md"
              >
                Sign Up
              </Button>
            </div>
            {/* Arrow pointing to input */}
            <div className="absolute -right-24 top-1/2 -translate-y-1/2 hidden lg:block">
               <ArrowRight className="w-12 h-12 text-black/20" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
