import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Truck,
  RotateCw,
  Settings,
  ChevronDown,
  Calendar,
  Package,
  CreditCard,
  Heart
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

  const trustPoints = [
    { icon: CreditCard, label: 'Monthly budget control', desc: 'Set your limit' },
    { icon: Settings, label: 'Modify anytime', desc: 'Full flexibility' },
    { icon: Heart, label: 'Vet-approved essentials', desc: 'Expert curated' },
    { icon: ShieldCheck, label: 'No overspending', desc: 'Stay within budget' }
  ];

  const steps = [
    { num: '1', title: 'Choose mode & set budget', desc: 'Pick monthly essentials or smart bundle' },
    { num: '2', title: 'Pick products within limits', desc: 'Shop curated essentials for your pet' },
    { num: '3', title: 'Checkout', desc: 'Simple and secure payment' },
    { num: '4', title: 'Monthly/one-time delivery', desc: 'Delivered to your doorstep' }
  ];

  const faqs = [
    { q: "Can I change items later?", a: "Yes, you can modify your monthly essentials anytime before your next billing cycle." },
    { q: "What if I exceed my budget?", a: "Our system prevents you from adding items that exceed your selected monthly budget." },
    { q: "Can I pause or skip a month?", a: "Absolutely. You can pause or skip deliveries anytime from your account dashboard." },
    { q: "How does the bundle discount work?", a: "Smart bundles require minimum 3 products and automatically apply 15% discount at checkout." }
  ];

  return (
    <div className="min-h-screen bg-[#1A1B23] text-white font-sans selection:bg-primary selection:text-black">

      {/* Section 1: Hero */}
      <section className="relative min-h-[calc(100vh-80px-15vh)] flex flex-col justify-center px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2000&auto=format&fit=crop"
            alt="Pet Lifestyle"
            className="w-full h-full object-cover opacity-40 grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1B23] via-[#1A1B23]/40 to-transparent" />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-8 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight">
              Monthly pet essentials<br />within your budget
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Set your monthly budget, shop curated essentials, and get everything delivered automatically.
            </p>
            <div className="text-3xl font-bold">
              Starting at <span className="text-[#D4AF37]">₹2,999</span>/month
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-12 pt-8">
            <div className="text-center">
              <div className="text-sm font-bold uppercase tracking-wider">Budget Control</div>
              <div className="text-xs text-white/40">Never overspend</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold uppercase tracking-wider">Vet Approved</div>
              <div className="text-xs text-white/40">Expert curated</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold uppercase tracking-wider">Free Delivery</div>
              <div className="text-xs text-white/40">Every month</div>
            </div>
          </div>

          <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl px-12 py-6 text-lg font-bold">
            Build My Monthly Essentials
          </Button>
        </div>
      </section>

      {/* Section 2: Trust Strip */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                  <point.icon className="w-8 h-8 text-white/80" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-bold">{point.label}</div>
                  <div className="text-xs text-white/40">{point.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Choose Your Shopping Mode */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-serif text-center mb-16">Choose your shopping mode</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Essentials - Primary */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="bg-white/5 rounded-3xl p-12 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-6 right-6 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full">
                RECOMMENDED
              </div>
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Monthly Essentials</h3>
                  <p className="text-white/60 mb-4">
                    Set your monthly budget, shop curated essentials, and get automatic deliveries every month.
                  </p>
                  <div className="text-sm text-white/40 mb-6">
                    Perfect for pet parents who want predictable monthly care costs
                  </div>
                </div>
                <Button className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl py-4 font-bold">
                  Start Monthly Plan
                </Button>
              </div>
            </motion.div>

            {/* Smart Bundle - Secondary */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 rounded-3xl p-12 border border-white/10"
            >
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Package className="w-8 h-8 text-white/80" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Smart Bundle</h3>
                  <p className="text-white/60 mb-4">
                    One-time purchase with minimum 3 products. Get 15% off automatically.
                  </p>
                  <div className="text-sm text-white/40 mb-6">
                    Great for trying new products or one-time needs
                  </div>
                </div>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl py-4 font-bold border border-white/20">
                  Build a Bundle
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-serif text-center mb-16">How it works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-2xl font-bold">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-white/60">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: FAQ */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-serif text-center mb-16">Frequently asked questions</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/10 pb-6">
                <button
                  className="w-full flex justify-between items-center text-left group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    className={cn(
                      "w-5 h-5 text-white/40 transition-transform duration-300",
                      openFaq === i && "rotate-180"
                    )} 
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-white/60 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto max-w-2xl text-center space-y-8">
          <h2 className="text-4xl font-serif">Ready to get started?</h2>
          <p className="text-white/60 text-lg">
            Join thousands of pet parents who trust Unlimited Fur for their monthly essentials.
          </p>
          <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl px-12 py-6 text-lg font-bold">
            Start with Monthly Essentials
          </Button>
        </div>
      </section>

    </div>
  );
};

export default Unlimited;
