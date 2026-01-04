import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Unlimited = () => {
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('CORE');
  }, [switchMode]);

  const coreProducts = [
    { id: 1, name: 'Fuel', desc: 'High-protein daily kibble' },
    { id: 2, name: 'Joy', desc: '2 Monthly indestructible toys' },
    { id: 3, name: 'Clean', desc: '60-pack biodegradable waste bags' },
    { id: 4, name: 'Fresh', desc: 'Monthly supply of natural clumping litter' },
    { id: 5, name: 'Glow', desc: 'Organic oatmeal shampoo' },
    { id: 6, name: 'Calm', desc: 'Hemp-infused daily treats' },
    { id: 7, name: 'Rest', desc: 'The "Indestructible" orthopedic bed' },
    { id: 8, name: 'Control', desc: 'The No-Pull comfort harness' },
    { id: 9, name: 'Groom', desc: 'Ergonomic de-shedding tool' },
    { id: 10, name: 'Hydrate', desc: '3-pack water fountain filters' },
    { id: 11, name: 'Smile', desc: 'Dental hygiene chew kit' },
    { id: 12, name: 'Pure', desc: 'Anti-bacterial paw wipes' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">

      {/* Marquee Banner */}
      <div className="bg-primary text-black py-3 overflow-hidden border-y-2 border-black">
        <motion.div
          className="whitespace-nowrap flex gap-8 text-2xl font-black font-sans uppercase tracking-tight"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {Array(10).fill("UNLIMITED CARE • ENDLESS JOY • CORE ACCESS • ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 md:px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter mb-8 text-primary uppercase">
              Never Run Out.<br />
              <span className="text-white">Never Overpay.</span>
            </h1>
            <p className="text-xl md:text-3xl font-medium max-w-2xl text-muted-foreground mb-12">
              All your pet’s daily essentials in one smart subscription. Starting at a price that makes sense.
            </p>
            <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-none bg-primary text-black hover:bg-white hover:text-black transition-all border-2 border-transparent hover:border-primary">
              ACTIVATE CORE ACCESS
            </Button>
          </motion.div>
        </div>

        {/* Floating Sticker */}
        <motion.div
          className="absolute top-1/4 right-[10%] w-48 h-48 bg-white rounded-full flex items-center justify-center -rotate-12 shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] border-4 border-black z-10 hidden md:flex"
          animate={{ y: [0, -20, 0], rotate: [-12, -6, -12] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <div className="text-center">
            <span className="block text-4xl font-black text-black">₹999</span>
            <span className="text-sm font-bold uppercase">/ Month</span>
          </div>
        </motion.div>
      </section>

      {/* The Core 12 Grid */}
      <section className="py-24 bg-background border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h4 className="text-primary font-bold uppercase tracking-widest mb-2">The Essentials Library</h4>
              <h2 className="text-5xl font-black text-white">THE CORE 12</h2>
            </div>
            <p className="text-zinc-400 max-w-md text-right md:text-left">
              We found the only 12 things your pet actually needs, so you don't have to.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {coreProducts.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="group relative bg-black border border-zinc-800 p-6 aspect-square flex flex-col justify-between hover:border-primary transition-colors"
              >
                <div className="text-6xl font-black text-zinc-800 group-hover:text-primary/20 transition-colors">
                  {item.id < 10 ? `0${item.id}` : item.id}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-5xl font-black text-center mb-16 uppercase italic">Choose Your Tier</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan A */}
            <div className="border-4 border-zinc-800 bg-black p-8 relative">
              <h3 className="text-3xl font-black text-white mb-2">THE ESSENTIALS EDIT</h3>
              <div className="text-4xl font-bold text-primary mb-6">₹999 <span className="text-lg text-zinc-500 font-normal">/ mo</span></div>
              <ul className="space-y-4 mb-8 text-zinc-300">
                <li className="flex items-center gap-3"><Check className="text-primary" /> Choose any 3 consumables</li>
                <li className="flex items-center gap-3"><Check className="text-primary" /> Monthly Delivery</li>
                <li className="flex items-center gap-3"><Check className="text-primary" /> 10% off Origin Store</li>
              </ul>
              <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold h-12">SELECT PLAN A</Button>
            </div>

            {/* Plan B */}
            <div className="border-4 border-primary bg-primary p-8 relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 font-bold text-xs uppercase transform translate-x-2 -translate-y-1/2 rotate-3">
                Best Value
              </div>
              <h3 className="text-3xl font-black text-black mb-2">CORE UNLIMITED</h3>
              <div className="text-4xl font-bold text-black mb-6">₹2,499 <span className="text-lg text-black/60 font-normal">/ mo</span></div>
              <ul className="space-y-4 mb-8 text-black/80 font-medium">
                <li className="flex items-center gap-3"><Check className="text-black" /> Unlimited access to all 12 products</li>
                <li className="flex items-center gap-3"><Check className="text-black" /> "Swap & Refresh" All Gear</li>
                <li className="flex items-center gap-3"><Check className="text-black" /> Free Vet-on-Call + Shipping</li>
              </ul>
              <Button className="w-full bg-black hover:bg-white hover:text-black text-white font-bold h-12 border-2 border-transparent hover:border-black">Start Unlimited Trial</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Logic Section */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { title: "Swap Anytime", desc: "Puppy outgrew the harness? We swap it for free." },
              { title: "Never Empty", desc: "Smart tracking ensures food arrives before the bowl is empty." },
              { title: "Quality Guaranteed", desc: "Affordable doesn't mean cheap. Lab-tested for safety." }
            ].map((feature, i) => (
              <div key={i}>
                <div className="text-6xl font-black text-black/10 mb-4">0{i + 1}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-black/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Transition */}
      <section className="py-32 bg-gradient-to-b from-primary to-[#EFF7F2] text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-serif font-medium text-black mb-8">Looking for something more... scientific?</h2>
          <Link to="/niche">
            <Button size="lg" variant="outline" className="h-16 px-12 text-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all rounded-full bg-transparent">
              EXPLORE THE ORIGIN LAB <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Unlimited;
