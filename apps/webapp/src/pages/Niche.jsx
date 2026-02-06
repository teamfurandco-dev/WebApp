import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Niche = () => {
  const { switchMode } = useTheme();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    switchMode('ORIGIN');
  }, [switchMode]);

  const originStories = [
    { title: "The Himalayan Forage", category: "Treats", desc: "Stories of wild-harvested herbs from high-altitude farmers." },
    { title: "The Weaver’s Leash", category: "Walk", desc: "Hand-braided by a women’s collective using organic, plant-dyed hemp." },
    { title: "The Coastal Bowl", category: "Dine", desc: "Upcycled shells for a chemical-free dining experience." },
    { title: "The Forest Bed", category: "Rest", desc: "Filled with natural latex and coconut husk fibers." },
    { title: "The Apothecary Drops", category: "Health", desc: "Herbal tinctures based on ancient Vaidya recipes." },
    { title: "The Artisan Toy", category: "Play", desc: "Hand-carved from fallen neem wood." },
    { title: "The Clay-Pure Kit", category: "Care", desc: "Dental care using sun-dried volcanic clay." },
    { title: "The Nomad Harness", category: "Gear", desc: "Made from recycled fishing nets, supporting ocean cleanup." },
  ];

  return (
    <div className="min-h-screen bg-[#EFF7F2] text-[#14522D] font-serif">

      {/* Impact Ticker */}
      <div className="bg-[#1B3022] text-[#FDFCF0] py-2 overflow-hidden">
        <motion.div
          className="whitespace-nowrap flex gap-12 text-sm font-sans tracking-widest uppercase opacity-80"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        >
          {Array(5).fill("1,200kg of waste repurposed • 15 Artisans supported • 100% Plastic Free • ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      {/* Hero Section */}
      <header className="relative h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[#14522D]/10 pattern-grid-lg absolute top-0 left-0"></div>
          {/* Placeholder for Cinematic Video */}
          <div className="w-full h-full bg-gradient-to-b from-transparent via-[#EFF7F2]/50 to-[#EFF7F2]" />
        </motion.div>

        <div className="relative z-10 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif text-[#14522D] mb-6 leading-tight"
          >
            Born from the Earth.<br />
            <span className="italic">Crafted by Hand.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-[#14522D]/80 mb-12 max-w-2xl mx-auto font-sans font-light"
          >
            We don't just manufacture; we preserve. Discover pet essentials that carry the soul of their makers.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-4 bg-[#14522D] text-[#FDFCF0] rounded-full font-sans tracking-widest uppercase text-sm hover:bg-[#A0522D] transition-colors"
          >
            Explore The Stories
          </motion.button>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#14522D]/40"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </header>

      {/* The Origin 12 - Story Cards */}
      <section className="py-2 md:py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
          {originStories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[3/4] bg-[#FDFCF0] overflow-hidden cursor-pointer"
            >
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-[#A0522D]/10 group-hover:scale-105 transition-transform duration-700 ease-out"></div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="absolute inset-0 bg-gradient-to-t from-[#14522D]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="relative z-10 text-[#FDFCF0]">
                  <span className="text-xs font-sans tracking-widest uppercase mb-2 block text-[#ffcc00]">{story.category}</span>
                  <h3 className="text-2xl font-serif mb-2 leading-none">{story.title}</h3>
                  <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                    <p className="text-sm font-sans pt-4 opacity-90 leading-relaxed border-t border-white/20 mt-4">
                      {story.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet the Maker Block */}
      <section className="py-4 md:py-24 bg-[#14522D] text-[#FDFCF0] overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="aspect-[4/5] bg-[#A0522D] rounded-t-full opacity-80 mix-blend-screen"></div>
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-[#ffcc00] font-sans tracking-widest uppercase mb-4 block">The Hands Behind The Product</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-none">Meet Preetha.</h2>
            <p className="text-xl md:text-2xl font-light opacity-90 leading-relaxed mb-12">
              "Every item you buy supports a family. We believe that when an artisan’s hand touches a product, it carries a different energy—one that is safer and kinder for your pet."
            </p>
            <button className="text-[#ffcc00] border-b border-[#ffcc00] pb-1 hover:text-white hover:border-white transition-colors">Read Full Journal Entry</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Niche;
