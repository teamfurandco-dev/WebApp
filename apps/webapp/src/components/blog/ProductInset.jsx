import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProductInset = ({ product }) => {
    return (
        <div className="my-12 relative overflow-hidden rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Image */}
                <div className="h-64 md:h-auto overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Content */}
                <div className="p-8 md:col-span-2 flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-furco-brown mb-2">Editor's Choice</span>
                    <h4 className="text-2xl font-serif font-medium text-black mb-2">{product.name}</h4>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-medium text-black/80">{product.price}</span>
                        {product.rating && <span className="text-sm text-furco-gold">★ {product.rating}</span>}
                    </div>
                    <p className="text-black/60 mb-6 leading-relaxed text-sm">
                        {product.description}
                    </p>
                    <Link to={product.link} className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-furco-gold hover:text-black transition-colors self-start">
                        Shop Now <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductInset;
