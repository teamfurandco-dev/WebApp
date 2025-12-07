import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductCarousel = ({ title, products }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#FDFBF7] overflow-hidden w-full">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black">{title}</h2>
          
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-furco-yellow hover:border-furco-yellow transition-all duration-300 group"
            >
              <ArrowLeft className="w-6 h-6 text-black" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-furco-yellow border-2 border-furco-yellow flex items-center justify-center hover:bg-black hover:border-black group transition-all duration-300"
            >
              <ArrowRight className="w-6 h-6 text-black group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <motion.div 
              key={product.id || index}
              className="min-w-[300px] md:min-w-[350px] snap-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden group">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-[300px] bg-gray-50 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.badge && (
                      <Badge className="absolute top-4 left-4 bg-furco-yellow text-black hover:bg-furco-yellow border-none px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md">
                        {product.badge}
                      </Badge>
                    )}
                    
                    {/* Hover Add to Cart */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Button className="w-full rounded-none h-14 bg-furco-yellow text-black hover:bg-black hover:text-white font-bold text-lg">
                        Add to Cart
                      </Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-2 text-sm text-muted-foreground font-medium uppercase tracking-wide">
                      {product.category}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-black mb-2 line-clamp-2 group-hover:text-furco-gold transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-auto flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-furco-yellow">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through decoration-black/30">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
