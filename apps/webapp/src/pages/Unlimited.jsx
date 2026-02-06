import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Gift,
  ChevronDown,
  Check,
  Package,
  Shield,
  RefreshCw,
  Heart,
  PiggyBank,
  BadgeDollarSign,
  Sparkles,
  Cat,
  Dog
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@fur-co/utils';
import unlmtHeroImage from '@/assets/unlmt_hero.png';
import readyBg from '@/assets/ready_section_img.png';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';

const Unlimited = () => {
  const { switchMode } = useTheme();
  const [openFaq, setOpenFaq] = useState(null);
  const containerRef = useRef(null);
  const faqAnswerRef = useRef(null);

  const handleFaqClick = (i) => {
    setOpenFaq(i);
    // On mobile, scroll to the answer panel when a question is clicked
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        if (faqAnswerRef.current) {
          faqAnswerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Parallax Scroll Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroTextY = useTransform(scrollYProgress, [0, 0.2], [0, 80]);
  const heroImageY = useTransform(scrollYProgress, [0, 0.2], [0, -40]);

  // Sticky cards effect
  const cardsY = useTransform(scrollYProgress, [0, 0.15], [0, -20]);

  useEffect(() => {
    switchMode('CORE');
    window.scrollTo(0, 0);
  }, [switchMode]);

  const faqs = [
    { q: "Can I change items later?", a: "Yes, you can modify your monthly essentials anytime before your next billing cycle." },
    { q: "What if I exceed my budget?", a: "Our system prevents you from adding items that exceed your selected monthly budget.", icon: "💰" },
    { q: "Can I pause or skip a month?", a: "Absolutely. You can pause or skip deliveries anytime from your account dashboard." },
    { q: "How does the bundle discount work?", a: "Unlimited Joys require minimum 3 products and automatically apply 15% discount at checkout." }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#ffcc00] text-gray-900 font-sans selection:bg-black/10 selection:text-black overflow-hidden relative">

      {/* --- LIVE ORGANIC BG (6 Blobs) --- */}
      <UnlimitedBackground />


      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[calc(100vh-120px)] pt-4 pb-0 px-4 container mx-auto max-w-7xl flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">

          {/* Left: Typography (Parallax Layer 1) */}
          <div className="lg:col-span-5 z-10 relative">
            <motion.div style={{ y: heroTextY }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-3xl md:text-6xl font-black tracking-tighter leading-[1] text-gray-900 mb-4 font-peace-sans drop-shadow-sm">
                  Love Tailored.<br />
                  On Your Terms.
                </h1>
              </motion.div>
            </motion.div>
          </div>


          {/* Right: Creative Plan Cards (No Image) */}
          <div className="lg:col-span-7 relative h-full flex justify-center items-center">

            {/* Large Creative Cards */}
            <motion.div
              style={{ y: cardsY }}
              className="w-full max-w-2xl z-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Monthly (White BG / Dark Text) */}
                <motion.div
                  className="relative"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link to="/unlimited-fur/monthly/budget?mode=monthly" className="group block">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-transparent hover:border-[#ffcc00] min-h-[340px] flex flex-col items-center text-center justify-between relative overflow-hidden transition-all duration-300">

                      {/* Badge */}
                      <div className="absolute top-4 right-4 bg-[#ffcc00]/20 text-[#C7A317] text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">
                        Popular
                      </div>

                      <div className="relative z-10 w-full flex flex-col items-center pt-4">
                        <div className="mb-5 w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner">
                          <Calendar className="w-10 h-10 text-gray-900" />
                        </div>

                        <h3 className="text-2xl font-black leading-tight text-gray-900 mb-3 font-peace-sans">The Worry-Free<br />Routine</h3>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          Set your budget once. We deliver essentials monthly.
                        </p>
                      </div>

                      <div className="relative z-10 w-full">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-gray-900 text-white w-full py-4 rounded-xl text-base font-bold shadow-lg flex items-center justify-center gap-2 group-hover:bg-[#ffcc00] group-hover:text-gray-900 transition-colors"
                        >
                          <Sparkles className="w-5 h-5" />
                          Start Monthly Plan
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Card 2: Bundle (Dark BG / White Text / Yellow Accents) */}
                <motion.div
                  className="relative"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link to="/unlimited-fur/bundle/budget?mode=bundle" className="group block">
                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl border-2 border-[#ffcc00] min-h-[340px] flex flex-col items-center text-center justify-between relative overflow-hidden group-hover:shadow-[0_0_30px_-5px_#ffcc00] transition-all duration-300">

                      {/* Decorative Glow */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ffcc00]/10 rounded-full blur-3xl"></div>

                      <div className="relative z-10 w-full flex flex-col items-center pt-4">
                        <div className="mb-5 w-20 h-20 rounded-2xl bg-gray-800/50 flex items-center justify-center shadow-inner border border-[#ffcc00]/20">
                          <Gift className="w-10 h-10 text-[#ffcc00]" />
                        </div>

                        <h3 className="text-2xl font-black leading-tight text-white mb-3 font-peace-sans">The Celebration<br />Box</h3>
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                          Pick 3+ items for any occasion. No commitment.
                        </p>
                      </div>

                      <div className="relative z-10 w-full">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-[#ffcc00] text-gray-900 w-full py-4 rounded-xl text-base font-bold shadow-lg flex items-center justify-center gap-2 group-hover:bg-white transition-colors"
                        >
                          <Package className="w-5 h-5" />
                          Build a Bundle
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- PROCESS STRIP (Matches "How It Works" Reference) --- */}
      <section className="bg-transparent py-12 md:py-20 relative z-10 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 relative">

          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-peace-sans">Pet Care How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-[#D4AF37]/30 -translate-y-1/2 -z-10 rounded-full"></div>

            {[
              { num: "1", title: "Set Your Budget", desc: "Determine your monthly spend.", icon: <Calendar className="w-8 h-8" /> },
              { num: "2", title: "Pick Products", desc: "Choose curated essentials.", icon: <Gift className="w-8 h-8" /> },
              { num: "3", title: "Secure Checkout", desc: "Simple and secure process.", icon: <Check className="w-8 h-8" /> },
              { num: "4", title: "Delivery", desc: "Right to your doorstep.", icon: <Package className="w-8 h-8" /> }
            ].map((step, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className={cn(
                  "rounded-[2rem] p-6 text-center relative shadow-lg hover:-translate-y-1 transition-all duration-300 border",
                  // Alternating Pattern: Odd=White, Even=Dark
                  idx % 2 === 0
                    ? "bg-white border-transparent text-gray-900"
                    : "bg-gray-900 border-[#ffcc00]/30 text-white"
                )}
              >
                {/* Number Badge */}
                <div className={cn(
                  "absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md ring-4",
                  idx % 2 === 0
                    ? "bg-gray-900 text-[#ffcc00] ring-white"
                    : "bg-[#ffcc00] text-gray-900 ring-gray-900"
                )}>
                  {step.num}
                </div>

                <div className={cn("mt-6 mb-4 flex justify-center", idx % 2 === 0 ? "text-[#ffcc00]" : "text-white")}>
                  {step.icon}
                </div>

                <h3 className={cn("font-bold text-lg mb-2 leading-tight font-peace-sans", idx % 2 === 0 ? "text-gray-900" : "text-white")}>
                  {step.title}
                </h3>
                <p className={cn("text-xs font-medium leading-relaxed px-2", idx % 2 === 0 ? "text-gray-500" : "text-gray-400")}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION (Dark Cards) --- */}
      <section className="py-12 md:py-24 relative z-10">
        <div className="container mx-auto max-w-7xl px-4">

          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-peace-sans mb-3">Why Choose Unlimited?</h2>
            <p className="text-sm md:text-base text-gray-800/80 max-w-2xl mx-auto px-4">Experience the freedom of hassle-free pet care with benefits designed for you.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: <Shield className="w-10 h-10" />, title: "Monthly budget control", desc: "Set your limit" },
              { icon: <RefreshCw className="w-10 h-10" />, title: "Modify anytime", desc: "Full flexibility" },
              { icon: <Heart className="w-10 h-10" />, title: "Vet-approved essentials", desc: "Expert curated" },
              { icon: <PiggyBank className="w-10 h-10" />, title: "No overspending", desc: "Stay within budget" },
              { icon: <BadgeDollarSign className="w-10 h-10" />, title: "Net-savings", desc: "Save within limit" }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={cn(
                  "rounded-3xl p-6 text-center border-2 hover:scale-105 transition-all duration-300 shadow-xl min-h-[180px] flex flex-col justify-center",
                  // Alternating Pattern: White -> Dark -> White ...
                  idx % 2 === 0
                    ? "bg-white border-transparent hover:border-[#ffcc00] text-gray-900"
                    : "bg-gray-900 border-[#ffcc00]/20 hover:border-[#ffcc00] text-white"
                )}
              >
                <div className={cn("mb-4 flex justify-center", idx % 2 === 0 ? "text-gray-900" : "text-[#ffcc00]")}>
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-sm mb-1 leading-tight font-peace-sans">{benefit.title}</h3>
                <p className={cn("text-xs", idx % 2 === 0 ? "text-gray-500" : "text-[#ffcc00]/80")}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* --- CREATIVE FAQ --- */}
      <section className="container mx-auto max-w-5xl px-6 py-0 md:py-20 relative">
        <h2 className="text-4xl font-black mb-12 text-gray-900 font-peace-sans">FAQs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: Questions */}
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleFaqClick(i)}
                  className={cn(
                    "w-full p-6 text-left rounded-3xl transition-all duration-300 relative border-2",
                    openFaq === i
                      ? "bg-gray-900 text-[#ffcc00] border-gray-900 shadow-xl"
                      : "bg-white text-gray-900 border-gray-200 hover:border-[#ffcc00] shadow-sm"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className={cn("font-bold text-lg pr-4 font-peace-sans", openFaq === i ? "text-white" : "text-gray-900")}>
                      {faq.q}
                    </span>
                    {openFaq === i ? (
                      <motion.span layoutId="active-dot" className="w-3 h-3 rounded-full bg-[#ffcc00]" />
                    ) : (
                      <span className="w-3 h-3 rounded-full bg-gray-200" />
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Right: Answer Panel */}
          <div ref={faqAnswerRef} className="lg:sticky lg:top-8 scroll-mt-20">
            <AnimatePresence mode="wait">
              {openFaq !== null ? (
                <motion.div
                  key={openFaq}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  className="bg-gray-900 border-2 border-[#ffcc00] rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffcc00]/10 rounded-full blur-2xl"></div>

                  <div className="relative z-10">
                    <div className="flex gap-4 mb-6">
                      <Cat className="w-10 h-10 text-[#ffcc00]" strokeWidth={2.5} />
                      <Dog className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-xl mb-4 text-[#ffcc00] font-peace-sans">Answer:</h3>
                    <p className="text-xl text-gray-300 leading-relaxed font-medium">
                      {faqs[openFaq].a}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-64 md:h-80 flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-gray-300 rounded-[2rem] p-8"
                >
                  <div className="mb-6 p-4 bg-[#ffcc00]/10 rounded-full">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <span className="text-6xl">👋</span>
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-peace-sans">Have questions?</h3>
                  <p className="text-gray-500 max-w-xs">
                    Click on any question on the left to view the details here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* --- GET STARTED CTA (Redesigned & Relocated) --- */}
      <section className="pt-12 pb-4 md:py-12 relative z-10">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden ring-4 ring-black/5 min-h-[420px] md:min-h-[500px] flex items-center"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img src={readyBg} alt="Background" className="w-full h-full object-cover object-left md:object-center" />
              <div className="absolute inset-0 bg-gradient-to-l md:bg-gradient-to-r from-black/95 via-black/40 to-transparent md:from-transparent md:via-black/20 md:to-black/80"></div>
            </div>

            <div className="relative z-10 w-full flex justify-end p-6 md:p-16">
              <div className="max-w-[240px] md:max-w-xl text-right flex flex-col items-end">

                <h2 className="text-3xl md:text-6xl font-black text-white mb-2 md:mb-6 leading-[1.1] md:leading-[0.9] font-peace-sans drop-shadow-xl text-right">
                  Ready to Give Them<br className="hidden md:block" /> The Best?
                </h2>
                <p className="text-base md:text-xl text-white/90 mb-6 md:mb-10 leading-relaxed font-medium drop-shadow-md text-right">
                  Join 10,000+ happy pet parents and experience the joy of worry-free care today.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 justify-end items-end w-full">
                  <Link to="/unlimited-fur/bundle/budget?mode=bundle" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/10 backdrop-blur-md text-white border-2 border-white px-6 py-2.5 rounded-full font-bold text-xs md:text-base shadow-lg hover:bg-white hover:text-gray-900 transition-all w-full"
                    >
                      Create a Bundle
                    </motion.button>
                  </Link>
                  <Link to="/unlimited-fur/monthly/budget?mode=monthly" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#ffcc00] text-gray-900 px-6 py-2.5 rounded-full font-bold text-xs md:text-base shadow-xl hover:bg-[#FFD700] transition-all flex items-center gap-1.5 w-full justify-center"
                    >
                      Start Monthly Plan <ChevronDown className="rotate-[-90deg] w-3 h-3" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div >
  );
};

export default Unlimited;
