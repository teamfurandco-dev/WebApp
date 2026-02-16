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
        <section className="pt-12 pb-8 md:py-20 bg-[#FDFBF7]">
            <div className="container mx-auto px-3 md:px-8">
                {/* Standard Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-3 md:gap-4 py-[5px]">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-peace-sans font-medium text-black mb-1 md:mb-2">
                            Browse by Category
                        </h2>
                        <p className="text-black/60 text-sm md:text-lg font-light">
                            Everything your pet needs, thoughtfully organized.
                        </p>
                    </div>
                    <Link to="/products" className="group flex items-center gap-2 text-black font-medium border-b border-black/20 pb-0.5 hover:border-black transition-all text-sm whitespace-nowrap">
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto overflow-x-auto md:overflow-visible pb-6 md:pb-0 snap-x scroll-pl-4 hide-scrollbar">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            to={cat.link}
                            className="relative group overflow-hidden rounded-2xl md:rounded-[2rem] w-[80vw] md:w-full aspect-[4/3] min-h-[200px] md:min-h-[250px] flex-shrink-0 block shadow-sm hover:shadow-xl transition-all duration-500 snap-start"
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
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col items-start transform md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-lg md:text-xl lg:text-2xl font-peace-sans font-medium text-white mb-1 md:mb-2">
                                    {cat.title}
                                </h3>
                                <p className="text-white/80 text-xs md:text-base font-light mb-2 md:mb-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                                    {cat.description}
                                </p>
                                <div className="flex items-center gap-2 text-furco-yellow font-medium uppercase tracking-widest text-xs border-b border-furco-yellow pb-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
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
