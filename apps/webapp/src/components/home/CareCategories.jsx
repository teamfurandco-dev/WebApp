import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        id: 'dog-nutrition',
        title: 'Nutrition for Dogs',
        description: 'Science-backed recipes for vitality.',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop',
        link: '/products?category=dog-nutrition'
    },
    {
        id: 'cat-nutrition',
        title: 'Nutrition for Cats',
        description: 'Clean protein for the pickiest eaters.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop',
        link: '/products?category=cat-nutrition'
    },
    {
        id: 'comfort-play',
        title: 'Comfort & Play',
        description: 'Enrichment tools for modern homes.',
        image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1000&auto=format&fit=crop', // Playful image
        link: '/products?category=comfort'
    }
];

const CareCategories = () => {
    return (
        <section className="py-8 md:py-0 min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-[#FDFBF7]">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col justify-center">
                {/* Standard Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-4 pt-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif font-medium text-black mb-2">
                            Browse by Category
                        </h2>
                        <p className="text-black/60 text-base md:text-lg font-light">
                            Everything your pet needs, thoughtfully organized.
                        </p>
                    </div>
                    <Link to="/products" className="group flex items-center gap-2 text-black font-medium border-b border-black/20 pb-1 hover:border-black transition-all text-sm md:text-base whitespace-nowrap">
                        View All Categories
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-none scroll-pl-4">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            to={cat.link}
                            className="relative group overflow-hidden rounded-[2rem] flex-none w-[85vw] md:w-auto aspect-[3/4] md:aspect-auto md:h-[min(60vh,500px)] block shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col items-start transform translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-2xl lg:text-3xl font-serif font-medium text-white mb-2">
                                    {cat.title}
                                </h3>
                                <p className="text-white/80 text-base md:text-lg font-light mb-4 md:mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {cat.description}
                                </p>
                                <div className="flex items-center gap-2 text-furco-yellow font-medium uppercase tracking-widest text-xs md:text-sm border-b border-furco-yellow pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                    Explore
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CareCategories;
