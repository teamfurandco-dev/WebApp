import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@fur-co/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowRight, Heart, ShieldCheck, Sparkles,
    Leaf, Ban, Sprout, Hammer, HandMetal, Recycle, Dog, PawPrint,
    CheckCircle2, Star, Quote
} from 'lucide-react';
import aboutPerfectHero from '@/assets/about-hero-final.jpg';
import aboutHero from '@/assets/about_hero.png';
import aboutHeroBg from '@/assets/about-hero.png';
import aboutStory from '@/assets/about_story.png';
import aboutNature from '@/assets/about_nature.png';

// --- Specialized Animation Wrappers ---

const Reveal = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

const GlassCard = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`backdrop-blur-xl bg-white/40 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] p-8 ${className}`}
    >
        {children}
    </motion.div>
);

// --- Hero Organic Shapes ---
const OrganicBlob = ({ className, color = "bg-furco-gold/10" }) => (
    <motion.div
        animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 50% 60% 50% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={`absolute blur-3xl ${color} ${className}`}
    />
);

const About = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 1.1]);
    const yParallax = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
    const { switchMode } = useTheme();

    useEffect(() => {
        switchMode('GATEWAY');
        window.scrollTo(0, 0);
    }, [switchMode]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#FDFBF7] text-furco-black font-sans selection:bg-furco-gold selection:text-white overflow-hidden">

            {/* --- 1. Immersive Hero Section --- */}
            <section className="relative h-[75vh] md:h-[80vh] lg:h-[85vh] min-h-[550px] w-full flex items-center justify-center overflow-hidden">
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        src={aboutPerfectHero}
                        alt="Golden hour pet love"
                        className="w-full h-full object-cover object-top md:object-[center_2%] brightness-[0.98] contrast-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                </motion.div>

                <div className="relative z-10 container px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-4">
                        <Reveal>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] tracking-tight drop-shadow-sm">
                                Where Love <br />
                                <span className="italic relative inline-block text-white">
                                    Meets Care
                                    <svg className="absolute -bottom-2 left-0 w-full h-2 text-white/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </span>
                            </h1>
                        </Reveal>

                        <Reveal delay={0.3}>
                            <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
                                Elevating pet parenting with nature's purest touch.
                                <span className="block mt-2 text-sm md:text-base font-serif italic text-white/80">Crafting a sanctuary for your fur babies.</span>
                            </p>
                        </Reveal>

                        <Reveal delay={0.6}>
                            <div className="flex items-center justify-center mt-8">
                                <Button
                                    onClick={() => navigate('/products')}
                                    className="h-14 px-12 bg-black text-white hover:bg-furco-gold hover:text-black rounded-full text-base font-medium transition-all duration-700 shadow-2xl group border border-white/10"
                                >
                                    Explore Collection
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Floating Organic Elements */}
                <OrganicBlob className="w-[400px] h-[400px] -top-20 -left-20 opacity-10" />
                <OrganicBlob className="w-[300px] h-[300px] -bottom-20 -right-20 opacity-5" color="bg-white/10" />
            </section>

            {/* --- 2. "Born from Love" Story Section --- */}
            <section className="relative py-16 overflow-hidden">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">

                        {/* Image Side - Abstract Framing */}
                        <div className="lg:col-span-5 relative order-2 lg:order-1">
                            <Reveal>
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group shadow-xl">
                                    <motion.img
                                        style={{ y: useTransform(smoothProgress, [0.1, 0.4], [0, 50]) }}
                                        src={aboutStory}
                                        alt="Our Inspiration"
                                        className="w-full h-[120%] object-cover absolute -top-[10%]"
                                    />
                                    <div className="absolute inset-0 bg-furco-gold/5 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-1000" />

                                </div>
                            </Reveal>
                        </div>

                        {/* Content Side */}
                        <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
                            <Reveal delay={0.2}>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-furco-gold">
                                        <div className="w-8 h-[1px] bg-furco-gold" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Our Genesis</span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-serif text-furco-black leading-tight">
                                        Fur & Co was <br />
                                        <span className="text-furco-gold italic underline decoration-furco-gold/10 decoration-4 underline-offset-4">born from love.</span>
                                    </h2>
                                </div>
                            </Reveal>

                            <Reveal delay={0.4}>
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <p className="text-lg text-furco-black/80 font-light leading-relaxed">
                                            It started with a simple belief: a fur baby is never "just a pet." They are our little ones, our joy, and our heartbeat wrapped in fur.
                                        </p>
                                        <div className="flex items-center gap-3 text-furco-gold">
                                            <Heart className="w-5 h-5 fill-current" />
                                            <div className="h-[1px] flex-1 bg-furco-gold/10" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 border-l border-furco-gold/5 pl-8">
                                        <p className="text-base text-muted-foreground leading-relaxed italic">
                                            "Fur & Co isn’t just a brand — it’s a family, a community, and a promise to every pet parent who chooses love first."
                                        </p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            We bring the finest products, thoughtful essentials, and trusted services under one loving roof.
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. Nature-Centric "Luminous" Section --- */}
            <section className="relative py-20 overflow-hidden">
                {/* Background Image Parallax */}
                <div className="absolute inset-0 z-0">
                    <motion.img
                        style={{ scale: useTransform(scrollYProgress, [0.3, 0.6], [1.1, 1]) }}
                        src={aboutNature}
                        className="w-full h-full object-cover brightness-[0.35]"
                        alt="Nature Background"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="container px-4 mx-auto relative z-10 text-white">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <Reveal>
                                <div className="inline-block px-4 py-1.5 rounded-full border border-furco-gold/20 bg-furco-gold/5 text-furco-gold text-[10px] uppercase tracking-[0.3em] backdrop-blur-sm">
                                    Sustainable Future
                                </div>
                                <h2 className="text-4xl md:text-6xl font-serif leading-[1.1] mt-4">
                                    India's First <br />
                                    <span className="text-furco-gold italic">Nature-Centric</span> Brand
                                </h2>
                            </Reveal>

                            <Reveal delay={0.2}>
                                <p className="text-lg text-white/80 font-light leading-relaxed max-w-2xl drop-shadow-md mx-auto lg:mx-0">
                                    Why should sustainability be only for humans? Pets deserve products that honour their natural roots — chemical-free, toxin-free, safe, and crafted with respect for the planet.
                                </p>
                            </Reveal>

                            <Reveal delay={0.4}>
                                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                                    {[
                                        { title: 'Chemical-Free', icon: Leaf },
                                        { title: 'Toxin-Free', icon: ShieldCheck },
                                        { title: 'Earth-Friendly', icon: Recycle }
                                    ].map((item, i) => (
                                        <div key={i} className="group p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm text-center">
                                            <item.icon className="w-8 h-8 text-furco-gold mb-4 mx-auto group-hover:scale-110 transition-transform" />
                                            <h3 className="text-lg font-medium">{item.title}</h3>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 4. What We're Solving - Premium Marquee --- */}
            <section className="py-20 bg-[#F7F4EF] relative overflow-hidden">
                <div className="container px-4 mx-auto mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <Reveal className="max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-serif text-furco-black mb-4">What We’re Solving</h2>
                            <p className="text-lg text-muted-foreground font-light leading-relaxed">
                                Transforming Pet Parenting Into Quality Parenting.
                                <span className="text-furco-gold font-medium"> No compromises.</span>
                            </p>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <div className="flex items-center gap-3 text-furco-gold font-serif italic text-base pb-2">
                                <span>Our Promises</span>
                                <div className="w-12 h-[1px] bg-furco-gold" />
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Dynamic Marquee */}
                <div className="relative overflow-hidden group">
                    <div className="flex gap-8 px-10 py-6">
                        <motion.div
                            className="flex gap-8 w-max"
                            animate={{ x: [0, - (isMobile ? 280 : 320) * 8 - 32 * 8] }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 35,
                                repeatType: "loop"
                            }}
                        >
                            {[
                                { title: "100% Chemical-Free", icon: Leaf, tag: "Pure Nature" },
                                { title: "Zero Toxins", icon: Ban, tag: "Safety First" },
                                { title: "Nature-Safe", icon: Sprout, tag: "Eco-Conscious" },
                                { title: "Indian Craft", icon: Hammer, tag: "Local Pride" },
                                { title: "No Mass Production", icon: HandMetal, tag: "Artisanal" },
                                { title: "Eco-Friendly", icon: Recycle, tag: "Earth First" },
                                { title: "Indie Love", icon: Dog, tag: "Inclusive" },
                                { title: "Stray Support", icon: PawPrint, tag: "Better World" },
                            ].map((item, index) => (
                                <div key={index} className="w-[280px] md:w-[320px]">
                                    <GlassCard className="h-[280px] md:h-[320px] flex flex-col p-6 md:p-10 justify-between group/card transition-all duration-700 rounded-[2.5rem] md:rounded-[3rem] border shadow-xl bg-white border-furco-gold/25 text-gray-900 hover:shadow-furco-gold/10">
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-6 bg-furco-gold/10">
                                                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-furco-gold" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full mb-3 inline-block bg-furco-gold/5 text-furco-gold">{item.tag}</span>
                                                <h3 className="text-xl md:text-2xl font-serif leading-tight">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex items-center justify-between opacity-40 group-hover/card:opacity-100 transition-opacity duration-500">
                                            <div className="w-12 h-[1px] bg-furco-gold/40" />
                                            <Sparkles className="w-4 h-4 text-furco-gold" />
                                        </div>
                                    </GlassCard>
                                </div>
                            ))}
                            {/* Duplicate for Infinite Scroll */}
                            {[
                                { title: "100% Chemical-Free", icon: Leaf, tag: "Pure Nature" },
                                { title: "Zero Toxins", icon: Ban, tag: "Safety First" },
                                { title: "Nature-Safe", icon: Sprout, tag: "Eco-Conscious" },
                                { title: "Indian Craft", icon: Hammer, tag: "Local Pride" },
                                { title: "No Mass Production", icon: HandMetal, tag: "Artisanal" },
                                { title: "Eco-Friendly", icon: Recycle, tag: "Earth First" },
                                { title: "Indie Love", icon: Dog, tag: "Inclusive" },
                                { title: "Stray Support", icon: PawPrint, tag: "Better World" },
                            ].map((item, index) => (
                                <div key={`dub-${index}`} className="w-[280px] md:w-[320px]">
                                    <GlassCard className="h-[280px] md:h-[320px] flex flex-col p-6 md:p-10 justify-between group/card transition-all duration-700 rounded-[2.5rem] md:rounded-[3rem] border shadow-xl bg-white border-furco-gold/25 text-gray-900 hover:shadow-furco-gold/10">
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-6 bg-furco-gold/10">
                                                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-furco-gold" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full mb-3 inline-block bg-furco-gold/5 text-furco-gold">{item.tag}</span>
                                                <h3 className="text-xl md:text-2xl font-serif leading-tight">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex items-center justify-between opacity-40 group-hover/card:opacity-100 transition-opacity duration-500">
                                            <div className="w-12 h-[1px] bg-furco-gold/40" />
                                            <Sparkles className="w-4 h-4 text-furco-gold" />
                                        </div>
                                    </GlassCard>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* --- 5. Our Mission - Refined Museum Aesthetic --- */}
            <section className="relative min-h-[500px] flex items-center justify-center py-12 bg-[#FDFBF7]">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Visual Side - Framed Experience */}
                        <div className="relative group order-2 lg:order-1">
                            <Reveal>
                                <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                                    <motion.img
                                        initial={{ scale: 1.1 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ duration: 2 }}
                                        src={aboutHero}
                                        alt="Mission Pet"
                                        className="w-full h-full object-cover brightness-[0.9] group-hover:scale-105 transition-transform duration-[5s]"
                                    />
                                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                                </div>
                            </Reveal>
                            {/* Accent Circle */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-furco-gold/10 rounded-full blur-3xl" />
                        </div>

                        {/* Content Side */}
                        <div className="space-y-10 order-1 lg:order-2">
                            <Reveal>
                                <div className="inline-flex items-center gap-3 text-furco-gold">
                                    <div className="w-10 h-[1px] bg-furco-gold/30" />
                                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold">The Vision Statement</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-furco-black mt-4 leading-tight">
                                    Our <span className="text-furco-gold italic">Mission</span>
                                </h2>
                            </Reveal>

                            <Reveal delay={0.2}>
                                <div className="relative">
                                    <p className="text-xl md:text-2xl font-serif leading-relaxed text-furco-black/90 italic">
                                        "To give every pet in India a safer, healthier, and happier life."
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal delay={0.4}>
                                <div className="space-y-6">
                                    <p className="text-base md:text-lg text-furco-black/70 font-light leading-relaxed">
                                        We see the toxins in toys, the parabens in grooming products, and the low-quality accessories that quietly harm pets. We’re here to change that story with products crafted from love, not chemicals.
                                    </p>

                                    <div className="pt-6 flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-furco-gold/5 border border-furco-gold/10 flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-furco-gold" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-furco-gold uppercase tracking-[0.2em] font-bold mb-1">Safety First</p>
                                            <p className="text-sm text-furco-black/40 font-medium">Verified Safety Protocols</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 6. Why Fur & Co - Staggered Bento Grid --- */}
            <section className="py-12 bg-[#FDFBF7] relative">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-2">
                        <Reveal>
                            <h2 className="text-4xl md:text-6xl font-serif text-furco-black mb-6">Why Fur & Co?</h2>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-8 h-[1px] bg-furco-gold" />
                                <p className="text-xl text-furco-gold italic font-serif">The pillars of our promise.</p>
                                <div className="w-8 h-[1px] bg-furco-gold" />
                            </div>
                        </Reveal>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Zero-Toxin Promise",
                                desc: "Safe ingredients, no chemicals — products you can trust blindly.",
                                icon: ShieldCheck
                            },
                            {
                                title: "Made from Nature",
                                desc: "All items crafted using natural, sustainable materials.",
                                icon: Leaf
                            },
                            {
                                title: "Handcrafted with Care",
                                desc: "Supporting Indian artisans, not mass production.",
                                icon: Hammer
                            },
                            {
                                title: "Designed for Sensitive Pets",
                                desc: "Thoughtfully created for comfort, health, and emotional wellbeing.",
                                icon: Heart
                            },
                            {
                                title: "Eco-Friendly",
                                desc: "Products naturally return to the earth.",
                                icon: Recycle
                            },
                            {
                                title: "Built on Love",
                                desc: "We uplift indie breeds, support stray feeding, and promote ethical choices.",
                                icon: Dog
                            },
                        ].map((item, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <div className="group relative h-full">
                                    <div className="absolute inset-0 bg-furco-gold/5 rounded-[2rem] rotate-1 group-hover:rotate-2 transition-transform duration-500" />
                                    <div className={`relative p-8 rounded-[2rem] border border-furco-gold/5 hover:border-furco-gold/20 shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col items-center text-center overflow-hidden h-full 
                                        ${i % 2 === 0 ? 'bg-black text-white' : 'bg-furco-gold text-black'}`}>

                                        <div className={`absolute top-0 right-0 p-4 font-serif text-6xl 
                                            ${i % 2 === 0 ? 'text-white/10' : 'text-black/20'}`}>0{i + 1}</div>

                                        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-12 
                                            ${i % 2 === 0 ? 'bg-white/10 text-furco-gold' : 'bg-black/10 text-black'}`}>
                                            <item.icon className="w-7 h-7" />
                                        </div>

                                        <h3 className={`text-xl font-serif font-bold mb-4 transition-colors 
                                            ${i % 2 === 0 ? 'text-white group-hover:text-furco-gold' : 'text-black'}`}>{item.title}</h3>
                                        <p className={`text-sm leading-relaxed font-light 
                                            ${i % 2 === 0 ? 'text-white/70' : 'text-black/70'}`}>{item.desc}</p>

                                        <div className={`mt-8 h-[1px] w-0 group-hover:w-full transition-all duration-700 
                                            ${i % 2 === 0 ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-black/20 to-transparent'}`} />
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Closing Organic Blob */}
                <OrganicBlob className="w-[600px] h-[600px] -bottom-48 -left-48 opacity-10" />
            </section>

            {/* Adding a bottom CTA to make it feel complete */}
            <section className="py-8 px-4 bg-[#FDFBF7]">
                <Reveal>
                    <div className="max-w-3xl mx-auto rounded-[2.5rem] bg-black p-10 md:p-16 text-center space-y-6 shadow-2xl overflow-hidden relative group">
                        <OrganicBlob className="w-60 h-60 -top-10 -right-10 bg-furco-gold/10 opacity-30 group-hover:scale-150 transition-transform duration-[3s]" />

                        <h2 className="text-3xl md:text-5xl font-serif text-white relative z-10">Join the Family</h2>
                        <p className="text-lg text-white max-w-xl mx-auto relative z-10 leading-relaxed font-medium">
                            Experience the difference that nature and love make.
                        </p>
                        <div className="relative z-10 pt-2">
                            <Button
                                onClick={() => navigate('/products')}
                                className="h-14 px-10 bg-white text-black hover:bg-furco-gold hover:text-black rounded-full text-base font-bold transition-all duration-500 shadow-xl shadow-white/10"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* Padding for Mobile Nav */}
            <div className="h-20 lg:h-0" />
        </div>
    );
};

export default About;
