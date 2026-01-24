import { Heart, ShieldCheck, Sparkles, PencilRuler } from 'lucide-react';
import { motion } from 'framer-motion';

const reasons = [
    { icon: Heart, label: "Loved by Pet Parents" },
    { icon: ShieldCheck, label: "Vet Approved" },
    { icon: Sparkles, label: "Safe Ingredients" },
    { icon: PencilRuler, label: "Thoughtfully Designed" }
];

const WhyChoose = () => {
    // Duplicate the reasons array for seamless infinite loop
    const duplicatedReasons = [...reasons, ...reasons];

    return (
        <section className="py-0 md:py-0 min-h-[50vh] flex flex-col justify-center bg-[#FDFBF7] overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col justify-center">
                {/* Standard Section Header */}
                <div className="mb-2 md:mb-4 py-[5px]">
                    <h2 className="text-3xl md:text-4xl font-peace-sans font-medium text-black mb-2">
                        Why Choose Fur & Co?
                    </h2>
                    <p className="text-black/60 text-base md:text-lg font-light">
                        Trusted by thousands of pet parents across India.
                    </p>
                </div>

                {/* Infinite Horizontal Carousel */}
                <div className="relative overflow-hidden pb-8 md:pb-0">
                    <motion.div
                        className="flex gap-4 md:gap-8"
                        animate={{
                            x: [0, -1200],
                        }}
                        transition={{
                            x: {
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            },
                        }}
                    >
                        {duplicatedReasons.map((item, index) => (
                            <div key={index} className="flex-none w-[280px] md:w-[300px] flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-black/5 hover:border-black/10 shadow-sm hover:shadow-lg transition-all duration-300">
                                <item.icon className="w-8 h-8 text-furco-gold" strokeWidth={1.5} />
                                <span className="text-base font-medium text-black text-center leading-tight">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;
