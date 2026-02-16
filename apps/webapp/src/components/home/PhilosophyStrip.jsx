import { ShieldCheck, Leaf, Globe, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
    { icon: ShieldCheck, label: 'Vet Approved' },
    { icon: Leaf, label: 'Limited Ingredients' },
    { icon: Globe, label: 'Ethically Sourced' },
    { icon: Home, label: 'Designed for Indian Homes' },
];

const PhilosophyStrip = () => {
    // Duplicate for seamless infinite loop
    const duplicatedValues = [...values, ...values];

    return (
        <section className="py-10 md:py-20 bg-white border-b border-black/5 overflow-hidden">
            <div className="container mx-auto px-3 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

                    {/* Title - Static */}
                    <div className="md:w-1/4 text-center md:text-left flex-shrink-0 py-[5px]">
                        <h2 className="text-xl md:text-3xl font-serif font-medium text-black">
                            The Science of <br /> <span className="italic text-black/70">Happy Pets</span>
                        </h2>
                    </div>

                    {/* Icons Carousel */}
                    <div className="flex-1 relative overflow-hidden">
                        <motion.div
                            className="flex gap-6 md:gap-12"
                            animate={{
                                x: [0, -800],
                            }}
                            transition={{
                                x: {
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: "linear",
                                },
                            }}
                        >
                            {duplicatedValues.map((value, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center justify-center text-center gap-2 md:gap-4 group flex-shrink-0 w-[140px] md:w-[180px]"
                                >
                                    <div className="p-3 md:p-4 rounded-full bg-[#FAF8F5] group-hover:bg-[#F2E8D5] transition-colors duration-300">
                                        <value.icon className="w-5 h-5 md:w-8 md:h-8 text-black/80" strokeWidth={1} />
                                    </div>
                                    <span className="text-xs md:text-base font-medium text-black/80">
                                        {value.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PhilosophyStrip;
