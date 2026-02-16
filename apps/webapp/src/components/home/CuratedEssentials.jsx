import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PawPrint } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

const CuratedEssentials = ({ products = [] }) => {
    const loading = false; // No loading since data comes from parent
    const error = products.length === 0;

    return (
        <section className="py-6 md:py-0 min-h-[60vh] md:min-h-[calc(100vh-80px-13vh)] flex flex-col justify-center bg-[#FDFBF7]">
            <div className="container mx-auto px-3 md:px-8 h-full flex flex-col justify-center">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 md:mb-12 gap-3 md:gap-4 py-[5px]">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-peace-sans font-medium text-black mb-1 md:mb-2">
                            Everyday Essentials
                        </h2>
                        <p className="text-black/60 text-sm md:text-lg font-light">
                            Carefully chosen tools for a happier life.
                        </p>
                    </div>
                    <Link to="/products" className="group flex items-center gap-2 text-black font-medium border-b border-black/20 pb-0.5 hover:border-black transition-all text-sm whitespace-nowrap">
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid / Slider */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar -mx-3 px-3 md:mx-0 md:px-0">
                    {products.slice(0, 6).map((product) => (
                        <div key={product.id} className="min-w-[45%] md:min-w-0">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CuratedEssentials;
