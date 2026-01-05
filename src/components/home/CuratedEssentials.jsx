import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

// Mock data (replace with actual product inputs or API data later)
const products = [
    {
        id: 1,
        name: "Daily Gut Balance",
        price: "₹850",
        image: "https://images.unsplash.com/photo-1585837575652-267c041d77d4?q=80&w=1000&auto=format&fit=crop",
        tag: "Why it's good: Probiotics + Prebiotics"
    },
    {
        id: 2,
        name: "Calming Hemp Oil",
        price: "₹1,200",
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=1000&auto=format&fit=crop",
        tag: "Why it's good: 100% Natural Stress Relief"
    },
    {
        id: 3,
        name: "Orthopedic Memory Bed",
        price: "₹3,400",
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=1000&auto=format&fit=crop",
        tag: "Why it's good: Joint Support for Seniors"
    },
    {
        id: 4,
        name: "Active Play Rope",
        price: "₹450",
        image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000&auto=format&fit=crop",
        tag: "Why it's good: Durable & Safe Materials"
    },
    {
        id: 5,
        name: "Gentle Grooming Balm",
        price: "₹650",
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1000&auto=format&fit=crop",
        tag: "Why it's good: Shea Butter Enriched"
    },
    {
        id: 6,
        name: "Ceramic Slow Feeder",
        price: "₹990",
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop",
        tag: "Why it's good: Prevents Bloating"
    }
];

const CuratedEssentials = () => {
    return (
        <section className="py-8 md:py-0 min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-[#FDFBF7]">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col justify-center">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif font-medium text-black mb-2">
                            Everyday Essentials
                        </h2>
                        <p className="text-black/60 text-base md:text-lg font-light">
                            Carefully chosen tools for a happier life.
                        </p>
                    </div>
                    <Link to="/products" className="group flex items-center gap-2 text-black font-medium border-b border-black/20 pb-1 hover:border-black transition-all text-sm md:text-base whitespace-nowrap">
                        View All Products
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid / Slider */}
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-6 md:gap-y-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-none scroll-pl-4">
                    {products.map((product) => (
                        <div key={product.id} className="group cursor-pointer flex-none w-[85vw] md:w-auto">
                            {/* Horizontal Card Layout */}
                            <div className="flex md:flex-col gap-4 md:gap-0 h-full">
                                {/* Image Card */}
                                <div className="aspect-square w-32 md:w-full md:aspect-[3/2] bg-white rounded-2xl overflow-hidden md:mb-4 relative flex-shrink-0">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-2 left-2 md:top-3 md:left-3">
                                        <span className="inline-block px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-black">
                                            Best Seller
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-center md:justify-start space-y-1 md:space-y-2">
                                    <h3 className="text-lg md:text-xl font-serif font-medium text-black group-hover:text-furco-brown transition-colors">
                                        {product.name}
                                    </h3>
                                    <span className="text-base md:text-lg font-sans font-medium text-black/80">
                                        {product.price}
                                    </span>
                                    <p className="text-xs md:text-sm font-medium text-furco-brown/80 bg-furco-cream inline-block px-2 py-1 rounded-md w-fit">
                                        {product.tag}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CuratedEssentials;
