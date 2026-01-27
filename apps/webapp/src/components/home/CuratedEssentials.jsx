import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, PawPrint } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { formatPrice } from '@fur-co/utils';

const CuratedEssentials = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const data = await api.getFeaturedProducts();
                if (!data || data.length === 0) {
                    setError(true);
                } else {
                    setProducts(data.slice(0, 6));
                    setError(false);
                }
            } catch (error) {
                console.error('Error fetching featured products:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-8 md:py-0 min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-[#FDFBF7]">
                <div className="container mx-auto px-4 md:px-8 h-full flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-peace-sans font-medium text-black mb-2">
                                Everyday Essentials
                            </h2>
                            <p className="text-black/60 text-base md:text-lg font-light">
                                Loading our carefully chosen products...
                            </p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-6 md:gap-y-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/2] bg-gray-200 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || products.length === 0) {
        return (
            <section className="py-16 md:py-24 min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-[#FDFBF7]">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-md mx-auto flex flex-col items-center"
                    >
                        <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mb-6">
                            <PawPrint className="w-12 h-12 text-black/20" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-peace-sans font-medium text-black mb-4">
                            Oops! Our shelves are empty
                        </h2>
                        <p className="text-black/60 text-base md:text-lg font-light mb-8">
                            We couldn't get the products right now. Please check back in a moment or try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-black/80 transition-all"
                        >
                            Refresh Page
                        </button>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-0 min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-[#FDFBF7]">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col justify-center">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-4 py-[5px]">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-peace-sans font-medium text-black mb-2">
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
                        <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="group cursor-pointer flex-none w-[85vw] md:w-auto"
                        >
                            {/* Horizontal Card Layout */}
                            <div className="flex md:flex-col gap-4 md:gap-0 h-full">
                                {/* Image Card */}
                                <div className="aspect-square w-32 md:w-full md:aspect-[3/2] bg-white rounded-2xl overflow-hidden md:mb-4 relative flex-shrink-0">
                                    <img
                                        src={product.images?.[0] || product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-2 left-2 md:top-3 md:left-3">
                                        <span className="inline-block px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-black">
                                            {product.is_featured ? 'Featured' : 'Best Seller'}
                                        </span>
                                    </div>
                                    {product.rating && (
                                        <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                                            <Star className="w-3 h-3 fill-furco-yellow text-furco-yellow" />
                                            <span className="text-xs font-medium">{product.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-center md:justify-start space-y-1 md:space-y-2">
                                    <h3 className="text-lg md:text-xl font-serif font-medium text-black group-hover:text-furco-brown transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base md:text-lg font-sans font-medium text-black/80">
                                            {formatPrice(product.base_price_cents)}
                                        </span>
                                        {product.compare_at_price_cents > product.base_price_cents && (
                                            <span className="text-sm text-black/40 line-through">
                                                {formatPrice(product.compare_at_price_cents)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs md:text-sm font-medium text-furco-brown/80 bg-furco-cream inline-block px-2 py-1 rounded-md w-fit">
                                        {product.category} • {product.reviewsCount || 0} reviews
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CuratedEssentials;
