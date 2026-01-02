import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, Heart, ShieldCheck, Sparkles, 
  Leaf, Ban, Sprout, Hammer, HandMetal, Recycle, Dog, PawPrint,
  Facebook, Twitter, Instagram, Mail
} from 'lucide-react';

// --- Animation Components ---
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const ScaleIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- SVG Separators ---
const CurveTop = ({ className }) => (
  <div className={`absolute top-0 left-0 w-full overflow-hidden leading-none z-10 ${className}`}>
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#FDFBF7]"></path>
    </svg>
  </div>
);

const CurveBottom = ({ className, fill = "#FDFBF7" }) => (
  <div className={`absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 ${className}`}>
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]">
      <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" style={{ fill }}></path>
    </svg>
  </div>
);

const About = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={targetRef} className="min-h-screen bg-[#FDFBF7] text-furco-black font-sans selection:bg-furco-gold selection:text-white">
      
      {/* 1. Header & Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y: parallaxY }} className="w-full h-[120%] -mt-[10%]">
             <img 
              src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop" 
              alt="Golden hour pet love" 
              className="w-full h-full object-cover brightness-[0.85]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
        </div>

        {/* Branding Overlay */}
        <div className="absolute top-8 left-8 z-20">
           {/* Assuming Logo Component or Image exists, using text for now as per prompt instructions to place logo */}
           <div className="text-white font-serif tracking-widest text-sm font-bold uppercase">
             Fur & Co <span className="block text-[10px] font-sans font-normal opacity-80">The Animal Aura</span>
           </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container px-4 text-center">
          <FadeIn>
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 drop-shadow-2xl leading-tight">
              Where Love <br/> <span className="italic text-furco-gold">Meets Care</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light mb-10 tracking-wide">
              Elevating pet parenting with nature's purest touch.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <Button className="bg-furco-gold text-black hover:bg-white hover:text-black rounded-full px-10 py-7 text-lg font-medium transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              Explore Our Collection
            </Button>
          </FadeIn>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent mx-auto mb-2" />
          <span className="text-xs uppercase tracking-widest">Scroll</span>
        </motion.div>
      </section>

      {/* 2. "Born from Love" Section */}
      <section className="relative py-32 bg-[#FDFBF7]">
        <CurveTop className="rotate-180 -top-[1px] fill-[#FDFBF7]" /> {/* Seamless transition */}
        
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            {/* Content */}
            <div className="flex-1 text-center md:text-left space-y-8">
              <FadeIn>
                <h2 className="text-5xl md:text-7xl font-serif text-furco-black leading-[1.1]">
                  Fur & Co was <br/>
                  <span className="text-furco-gold italic font-light">born from love.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    It started with a simple belief: a fur baby is never "just a pet." They are our little ones, our joy, and our heartbeat wrapped in fur.
                  </p>
                  <p>
                    Fur & Co isn’t just a brand — it’s a family, a community, and a promise to every pet parent who chooses love first. We bring the finest products, thoughtful essentials, and trusted services under one loving roof.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex items-center gap-4 pt-4 justify-center md:justify-start">
                  <div className="h-[1px] w-12 bg-furco-gold" />
                  <span className="font-serif italic text-furco-black text-lg">Est. 2024</span>
                </div>
              </FadeIn>
            </div>

            {/* Visual */}
            <div className="flex-1 relative">
              <ScaleIn>
                <div className="relative z-10 p-3 border border-furco-gold/30 rounded-t-[10rem] rounded-b-[2rem]">
                  <img 
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop" 
                    alt="Our Inspiration" 
                    className="w-full h-[500px] object-cover rounded-t-[9.5rem] rounded-b-[1.5rem] shadow-2xl grayscale-[20%] sepia-[10%]"
                  />
                  {/* Botanical Illustration Overlay (Simulated with Icon) */}
                  <Leaf className="absolute -bottom-6 -right-6 w-24 h-24 text-furco-gold/20 rotate-12" />
                </div>
              </ScaleIn>
              {/* Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-furco-gold/5 rounded-full blur-3xl -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. "Nature-Centric Brand" Section */}
      <section className="relative py-40 bg-black text-white overflow-hidden">
        <CurveTop className="fill-[#FDFBF7]" /> {/* Transition from Cream */}
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Visual Focal Point */}
            <div className="relative order-2 md:order-1">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop" 
                  alt="Nature Centric" 
                  className="w-full max-w-md mx-auto rounded-3xl border-2 border-furco-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)]"
                />
              </motion.div>
              {/* Organic Lines */}
              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-0 opacity-40 pointer-events-none" viewBox="0 0 200 200">
                <path fill="none" stroke="#D4AF37" strokeWidth="0.5" d="M42.7,-72.8C54.8,-67.1,63.6,-56.3,70.9,-45.3C78.2,-34.3,84,-23.1,83.3,-12.2C82.6,-1.3,75.4,9.3,68.4,19.6C61.4,29.9,54.6,39.9,46.1,48.1C37.6,56.3,27.4,62.7,16.8,66.6C6.2,70.5,-4.8,71.9,-15.6,70.2C-26.4,68.5,-37,63.7,-46.8,56.5C-56.6,49.3,-65.6,39.7,-71.3,28.6C-77,17.5,-79.4,4.9,-77.6,-6.8C-75.8,-18.5,-69.8,-29.3,-61.6,-38.4C-53.4,-47.5,-43,-54.9,-32.3,-61.4C-21.6,-67.9,-10.8,-73.5,0.8,-74.8C12.4,-76.1,24.8,-73.1,30.6,-78.5" transform="translate(100 100)" />
              </svg>
            </div>

            {/* Content */}
            <div className="order-1 md:order-2 space-y-8">
              <FadeIn>
                <div className="inline-block px-4 py-1 border border-furco-gold rounded-full text-furco-gold text-sm tracking-wider uppercase mb-4">
                  Our Philosophy
                </div>
                <h2 className="text-5xl md:text-6xl font-serif leading-tight">
                  India's First <br/>
                  <span className="text-furco-gold italic">Nature-Centric</span> Brand
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-xl text-white/70 font-light leading-relaxed">
                  Why should sustainability be only for humans? Pets deserve products that honour their natural roots — chemical-free, toxin-free, safe, and crafted with respect for the planet they’re born to explore.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <ul className="space-y-4 text-white/80">
                  {['Chemical-Free', 'Toxin-Free', 'Earth-Friendly'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-furco-gold" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
          </div>
        </div>
        
        <CurveBottom className="fill-[#FDFBF7]" />
      </section>

      {/* 4. "What We're Solving" Section - Continuous Marquee */}
      <section className="py-32 bg-[#FDFBF7] overflow-hidden">
        <div className="container px-4 mx-auto mb-16 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif text-furco-black mb-4">What We’re Solving</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Transforming Pet Parenting Into Quality Parenting with our core commitments.</p>
          </FadeIn>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10" />
          
          <motion.div 
            className="flex gap-8 w-max"
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[
              { title: "100% Chemical-Free", icon: Leaf },
              { title: "Zero Toxins", icon: Ban },
              { title: "Nature-Safe", icon: Sprout },
              { title: "Indian Craft", icon: Hammer },
              { title: "No Mass Production", icon: HandMetal },
              { title: "Eco-Friendly", icon: Recycle },
              { title: "Indie Love", icon: Dog },
              { title: "Stray Support", icon: PawPrint },
              // Duplicated for seamless loop
              { title: "100% Chemical-Free", icon: Leaf },
              { title: "Zero Toxins", icon: Ban },
              { title: "Nature-Safe", icon: Sprout },
              { title: "Indian Craft", icon: Hammer },
              { title: "No Mass Production", icon: HandMetal },
              { title: "Eco-Friendly", icon: Recycle },
              { title: "Indie Love", icon: Dog },
              { title: "Stray Support", icon: PawPrint },
            ].map((item, index) => (
              <div key={index} className="w-[280px]">
                <Card className="h-[320px] bg-gradient-to-br from-white to-furco-gold/10 border-furco-gold/20 hover:border-furco-gold transition-all duration-500 group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 rounded-[2rem]">
                  <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white border border-furco-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      <item.icon className="w-8 h-8 text-furco-gold group-hover:text-furco-black transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-serif text-furco-black group-hover:text-furco-gold transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="w-8 h-[1px] bg-furco-gold/30 group-hover:w-16 transition-all duration-500" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. "Our Mission" Section - Split Screen */}
      <section className="relative py-0 bg-black text-white">
        <div className="grid md:grid-cols-2 min-h-[800px]">
          {/* Image Side */}
          <div className="relative h-[500px] md:h-auto overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop" 
              alt="Mission Pet" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent md:bg-gradient-to-t" />
          </div>

          {/* Content Side */}
          <div className="relative flex items-center p-12 md:p-24 bg-black">
            <div className="relative z-10 space-y-10">
              <FadeIn>
                <div className="w-16 h-1 bg-furco-gold mb-8" />
                <h2 className="text-5xl md:text-7xl font-serif mb-6">Our Mission</h2>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <div className="p-8 border-l-2 border-furco-gold bg-white/5 backdrop-blur-sm rounded-r-2xl">
                  <p className="text-2xl md:text-3xl font-serif leading-relaxed text-white/90 italic">
                    "To give every pet in India a safer, healthier, and happier life."
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <p className="text-lg text-white/60 font-light leading-relaxed max-w-md">
                  We see the toxins in toys, the parabens in grooming products, and the low-quality accessories that quietly harm pets. We’re here to change that story with products crafted from love, not chemicals.
                </p>
              </FadeIn>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 opacity-20 animate-pulse">
              <Sparkles className="w-24 h-24 text-furco-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. "Why Fur & Co?" Section - Staggered Grid */}
      <section className="py-32 bg-[#FDFBF7] relative">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="text-5xl font-serif text-furco-black mb-4">Why Fur & Co?</h2>
              <p className="text-muted-foreground text-xl italic font-serif">The pillars of our promise.</p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: "Zero-Toxin Promise", desc: "Safe ingredients, no chemicals — products you can trust blindly." },
              { title: "Made from Nature", desc: "All items crafted using natural, sustainable materials." },
              { title: "Handcrafted with Care", desc: "Supporting Indian artisans, not mass production." },
              { title: "Designed for Sensitive Pets", desc: "Thoughtfully created for comfort, health, and emotional wellbeing." },
              { title: "Eco-Friendly", desc: "Products naturally return to the earth." },
              { title: "Built on Love", desc: "We uplift indie breeds, support stray feeding, and promote ethical choices." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className={i % 2 === 1 ? "md:mt-12" : ""}> {/* Stagger effect */}
                <div className="group p-10 rounded-[2rem] bg-white border border-furco-gold/10 hover:border-furco-gold/40 shadow-sm hover:shadow-2xl hover:bg-gradient-to-b hover:from-white hover:to-furco-gold/5 transition-all duration-500 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-furco-gold/5 rounded-bl-[4rem] -mr-4 -mt-4 transition-all duration-500 group-hover:bg-furco-gold/20" />
                  
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-furco-black/10 mb-6 group-hover:bg-furco-gold group-hover:text-black transition-colors duration-500 bg-white">
                    <span className="font-serif font-bold text-lg">{i + 1}</span>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-bold mb-4 text-furco-black group-hover:text-furco-gold transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer Section Removed (Using Global Footer) */}
    </div>
  );
};

export default About;
