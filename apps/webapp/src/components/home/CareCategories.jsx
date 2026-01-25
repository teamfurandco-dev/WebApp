import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import dogEatingImage from '@/assets/dog_eating.png';
import catEatingImage from '@/assets/cat_eating.png';
import dogCatPlayingImage from '@/assets/dog_cat_playing.png';

const categories = [
    {
        id: 'dog-nutrition',
        title: 'Nutrition for Dogs',
        description: 'Science-backed recipes for vitality.',
        image: dogEatingImage,
        link: '/products?category=dog-nutrition'
    },
    {
        id: 'cat-nutrition',
        title: 'Nutrition for Cats',
        description: 'Clean protein for the pickiest eaters.',
        image: catEatingImage,
        link: '/products?category=cat-nutrition'
    },
    {
        id: 'comfort-play',
        title: 'Comfort & Play',
        description: 'Enrichment tools for modern homes.',
        image: dogCatPlayingImage,
        link: '/products?category=comfort'
    }
];

const CareCategories = () => {
    return (
        <section className="py-8 md:py-12 bg-[#FDFBF7]">
            <div className="container mx-auto px-4 md:px-8">
                {/* Standard Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-4 py-[5px]">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-peace-sans font-medium text-black mb-2">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            to={cat.link}
                            className="relative group overflow-hidden rounded-[2rem] w-full aspect-[4/3] min-h-[250px] block shadow-sm hover:shadow-2xl transition-all duration-500"
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
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col items-start transform translate-y-4 md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-xl lg:text-2xl font-peace-sans font-medium text-white mb-2">
                                    {cat.title}
                                </h3>
                                <p className="text-white/80 text-sm md:text-base font-light mb-3 md:mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
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
