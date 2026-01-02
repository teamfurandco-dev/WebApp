import { ArrowRight, Box, Infinity, Diamond, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const TripleCTA = () => {
    const items = [
        {
            label: 'Essentials',
            icon: Box,
            bg: 'bg-[#F2E8D5]', // Soft Beige
            hover: 'hover:bg-[#E6DCC9]',
            path: '/products?category=essentials',
            colSpan: 'col-span-1'
        },
        {
            label: 'Unlimited',
            icon: Infinity,
            bg: 'bg-[#E0D4B2]', // Darker Beige/Gold
            hover: 'hover:bg-[#D4C8A8]',
            path: '/unlimited',
            colSpan: 'col-span-1'
        },
        {
            label: 'Niche',
            icon: Diamond,
            bg: 'bg-[#D1C2A3]', // Deepest Beige/Taupe
            hover: 'hover:bg-[#C4B596]',
            path: '/niche',
            colSpan: 'col-span-2 md:col-span-1' // Full width on mobile (bottom row), normal on desktop
        }
    ];

    return (
        <div className="relative z-30 -mt-16 md:-mt-24 px-4 md:px-0">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-0 md:rounded-t-3xl overflow-hidden shadow-2xl">
                    {items.map((item, index) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={cn(
                                item.colSpan,
                                "group relative overflow-hidden flex items-center justify-between p-6 md:p-8 transition-colors duration-300",
                                item.bg,
                                item.hover,
                                // On mobile, add rounding to separate blocks if needed, or keep them blocky. 
                                // Request said "Overlap bottom edge of hero". 
                                // Let's keep them sharp on desktop inside the container, rounded on mobile independently or blocky.
                                "rounded-2xl md:rounded-none first:md:rounded-tl-3xl last:md:rounded-tr-3xl"
                            )}
                        >
                            <div className="flex items-center gap-4 z-10">
                                <div className="p-3 bg-black/5 rounded-full group-hover:bg-black/10 transition-colors">
                                    <item.icon className="w-6 h-6 md:w-8 md:h-8 text-black" strokeWidth={1.5} />
                                </div>
                                <span className="text-lg md:text-2xl font-serif font-bold text-black tracking-tight">
                                    {item.label}
                                </span>
                            </div>

                            <div className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full border border-black/10 group-hover:border-black/30 transition-colors">
                                <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                            </div>

                            {/* Hover effect background */}
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TripleCTA;
