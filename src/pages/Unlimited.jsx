import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Truck,
  RotateCw,
  Settings,
  ChevronDown,
  Plus,
  ArrowRight,
  Sparkles,
  Leaf,
  PencilRuler
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Unlimited = () => {
  const { switchMode } = useTheme();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    switchMode('CORE');
    window.scrollTo(0, 0);
  }, [switchMode]);

  const plans = [
    { items: 4, price: 3499, label: 'Essentials', color: 'bg-[#4C4B63]' },
    { items: 6, price: 4399, label: 'Basic', color: 'bg-[#4C4B63]' },
    { items: 8, price: 5599, label: 'Lite', color: 'bg-[#4C4B63]' },
    { items: 12, price: 6599, label: 'Premium', color: 'bg-[#7C3AED]' },
    { items: 14, price: 7499, label: 'Luxury', color: 'bg-[#4C4B63]' },
  ];

  const features = [
    { icon: RotateCw, label: 'Pay monthly', desc: 'Predictable care' },
    { icon: Truck, label: 'Free delivery', desc: 'In 3-5 days' },
    { icon: ShieldCheck, label: 'Zero deposit', desc: 'No hidden costs' },
    { icon: Settings, label: '5-days curation', desc: 'Curated for you' },
    { icon: Settings, label: 'Free installation', desc: 'Hassle-free' },
    { icon: RotateCw, label: 'Easy renewals', desc: 'One-click stays' },
  ];

  const steps = [
    { num: '1', title: 'Select a plan.', desc: 'Choose what fits your pet best.' },
    { num: '2', title: 'Add food & items to your cart.', desc: 'Science-backed essentials.' },
    { num: '3', title: 'Pay the first month\'s rent & checkout.', desc: 'Simple and secure.' },
    { num: '4', title: 'Complete a 30 sec onboarding process.', desc: 'Getting to know your pet.' },
    { num: '5', title: 'Schedule your free delivery & installation.', desc: 'Sit back and relax.' },
  ];

  const faqs = [
    { q: "What is UNLMTD by Fur & Co?", a: "UNLMTD is our premium subscription service that provides everything your pet needs—from nutrition to wellness—for a fixed monthly price." },
    { q: "How can I subscribe to UNLMTD by Fur & Co?", a: "Simply select a plan based on the number of items you need, fill your pack, and checkout. We'll handle the rest!" },
    { q: "What are the different subscription plans available?", a: "We offer plans ranging from 4 items (Essentials) to 14 items (Luxury) to suit every pet parent's needs." },
  ];

  const sparkleGoldClass = "bg-clip-text text-transparent bg-[linear-gradient(45deg,#D4AF37,#FFF78A,#D4AF37)] bg-[length:200%_auto] animate-shimmer";

  return (
    <div className="min-h-screen bg-[#1A1B23] text-white font-sans selection:bg-primary selection:text-black overflow-x-hidden">

      {/* Custom Styles */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 1. Hero Section (87vh) */}
      <section className="h-[87vh] relative flex flex-col justify-center px-4 md:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2000&auto=format&fit=crop"
            alt="Pet Lifestyle"
            className="w-full h-full object-cover opacity-40 grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1B23] via-[#1A1B23]/40 to-transparent" />
        </div>

        <div className="container mx-auto z-10">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="max-w-2xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className={cn("text-xl md:text-2xl font-black uppercase tracking-widest", sparkleGoldClass)}>UNLMTD</span>
              <span className="text-white/40 text-sm font-bold uppercase tracking-wider">by Fur & Co</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight text-white mb-2">
              It's Everything <br /> your pet needs
            </h1>
            <div className="space-y-1">
              <span className="text-white/60 text-lg">Starting at</span>
              <div className="text-4xl md:text-5xl font-black text-white">₹3499 <span className="text-xl font-normal text-white/40">/mo</span></div>
            </div>
            <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl px-10 py-7 text-lg font-bold transition-all shadow-xl">
              Rent Now
            </Button>
            <div className="flex flex-wrap gap-8 pt-8">
              {[
                { label: "Zero Deposit", desc: "No hidden costs" },
                { label: "Free Delivery", desc: "& Installation" },
                { label: "Monthly Payment", desc: "Predictable care" }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-sm font-bold text-white uppercase tracking-tighter">{item.label}</div>
                  <div className="text-xs text-white/40">{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Peek Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/20" />
        </div>
      </section>

      {/* 2. Tiered Plans (87vh) */}
      <section className="h-[87vh] flex flex-col justify-center px-4 md:px-8 border-b border-white/5">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-12 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible">
            {plans.map((plan, i) => (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="flex-none w-[280px] md:w-auto bg-white/5 rounded-[2rem] p-8 border border-white/10 flex flex-col justify-between hover:border-white/30 transition-all hover:bg-white/10 shadow-2xl"
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-black text-white">{plan.items}</div>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Items</div>
                    <div className="text-[10px] text-white/30 mt-1 italic">₹ {Math.round(plan.price / plan.items)} per product</div>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-black text-white">₹ {plan.price}/mo</div>
                    <div className="text-[10px] line-through text-white/20">₹ {Math.round(plan.price * 1.25)}/mo</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-xl font-serif font-medium text-white">{plan.label}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Access to 150+ Products</div>
                  </div>
                </div>
                <Button className={cn("mt-8 w-full rounded-xl py-6 font-bold uppercase text-[10px] tracking-[2px] border-none shadow-lg", plan.color)}>
                  Select Plan
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Experience Banner (87vh) */}
      <section className="h-[87vh] flex flex-col justify-center px-4 md:px-8 bg-black/40 border-b border-white/5">
        <div className="container mx-auto">
          <div className="rounded-[3rem] overflow-hidden relative h-[400px] md:h-[500px] bg-gradient-to-r from-[#2A2B35] to-[#1A1B23] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-full p-12 flex items-center justify-center">
              <div className="relative w-full aspect-video bg-black/20 rounded-3xl overflow-hidden border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1000&auto=format&fit=crop"
                  alt="Experience"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white rotate-45" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-12 text-center md:text-left space-y-8">
              <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight">
                Experience before <br /> you rent
              </h2>
              <Button className="bg-white text-black hover:bg-white/90 rounded-full px-12 py-7 font-bold text-lg shadow-xl">
                Schedule A Video Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Grid (87vh) */}
      <section className="h-[87vh] flex flex-col justify-center px-4 md:px-8 border-b border-white/5">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all group-hover:border-white/20 group-hover:bg-white/10 shadow-lg">
                <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-white/80" strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold uppercase tracking-tighter">{feature.label}</div>
                <div className="text-[10px] text-white/40">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How it Works (87vh) */}
      <section className="h-[87vh] flex flex-col justify-center px-4 md:px-8 bg-[#3E3D52]/20 border-b border-white/5">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-20 italic">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-[50px] left-[10%] right-[10%] h-[1px] bg-white/10" />

            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                <div className="text-8xl font-serif font-bold text-white/5 absolute -top-8 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0">{step.num}</div>
                <div className="pt-4 space-y-3">
                  <h3 className="text-lg font-bold uppercase tracking-tight leading-snug">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-20">
            <p className="text-[10px] uppercase tracking-widest text-white/20">*Minimum tenure of 3 months applies</p>
          </div>
        </div>
      </section>

      {/* 6. Featured Plans (87vh) */}
      <section className="h-[87vh] flex flex-col justify-center px-4 md:px-8 bg-black">
        <div className="container mx-auto relative px-10">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 snap-x">
            {[
              { title: "Essential Plan", desc: "Ideal for fresh pet parents & puppies looking for minimal, space-saving care.", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1000&auto=format&fit=crop" },
              { title: "Basic Plan", desc: "A great mix of essentials and a few extras for a comfortable pet lifestyle.", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop" },
              { title: "Lite Plan", desc: "Get the best of functionality for your active pet's needs.", img: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop" }
            ].map((item, i) => (
              <div key={i} className="flex-none w-[80vw] md:w-[600px] h-[350px] md:h-[400px] rounded-[3rem] overflow-hidden relative group snap-center border border-white/5">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end space-y-3">
                  <h3 className="text-3xl font-serif font-medium italic">{item.title}</h3>
                  <p className="text-white/60 text-lg max-w-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Arrows UI */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center text-black cursor-pointer shadow-xl">
            <ArrowRight className="rotate-180" />
          </div>
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center text-black cursor-pointer shadow-xl">
            <ArrowRight />
          </div>
        </div>
      </section>

      {/* 7. FAQ Section (87vh) */}
      <section className="h-[87vh] flex flex-col justify-center px-4 md:px-8 bg-[#1A1B23]">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-serif text-center mb-16">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/10 pb-6">
                <button
                  className="w-full flex justify-between items-center text-left group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-base md:text-lg font-medium text-white/80 group-hover:text-white transition-colors">{faq.q}</span>
                  <ChevronDown className={cn("w-5 h-5 text-white/40 transition-transform duration-300", openFaq === i && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-white/40 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button className="bg-[#B06AB3] hover:bg-[#8E44AD] text-white rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all">
              See More
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Unlimited;
