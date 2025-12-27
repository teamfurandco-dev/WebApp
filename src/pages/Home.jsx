import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Hand, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HomeHero from '@/components/home/HomeHero';
import ProductCarousel from '@/components/home/ProductCarousel';
import { api } from '@/services/api';

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // State for dynamic data
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, trending, cats, blogs] = await Promise.all([
          api.getFeaturedProducts(),
          api.getTrendingProducts(),
          api.getCategories(),
          api.getBlogs({ limit: 3 })
        ]);
        setFeaturedProducts(featured);
        setTrendingProducts(trending);
        setCategories(cats);
        setBlogPosts(blogs);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-12 h-12 animate-spin text-furco-yellow" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FDFBF7] overflow-hidden">
      
      {/* I. Hero Section */}
      <HomeHero />

      {/* II. Category & Spotlight Section */}
      <section className="py-24 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative h-[500px] rounded-[2rem] overflow-hidden border border-black/10 hover:border-black/30 transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img 
                    src={cat.image_url || `https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1000&auto=format&fit=crop`} 
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ y }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-serif font-bold text-white">{cat.name}</h3>
                  <Link to={`/products?category=${cat.slug || cat.name}`}>
                    <Button className="bg-transparent border-2 border-white text-white hover:bg-furco-yellow hover:border-furco-yellow hover:text-black rounded-full px-8 transition-all duration-300">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* III. Featured Products */}
      {featuredProducts.length > 0 && (
        <ProductCarousel title="Keeping Pets Happy" products={featuredProducts} />
      )}

      {/* IV. Why Choose Fur & Co */}
      <section className="py-24 bg-white w-full">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">Why Choose Fur & Co?</h2>
            <p className="text-muted-foreground text-lg">Trusted by thousands of happy tails.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Loved by People", icon: Heart, desc: "Over 10,000+ 5-star reviews from happy parents." },
              { title: "Vet Approved", icon: ShieldCheck, desc: "Formulated and recommended by top veterinarians." },
              { title: "100% Natural", icon: Sparkles, desc: "Only the best ingredients from mother nature." },
              { title: "Handmade", icon: Hand, desc: "Crafted with love and care in small batches." },
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-black/5 hover:border-black/20 bg-[#FDFBF7] transition-all duration-300 group h-full">
                  <div className="w-20 h-20 mb-6 relative">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full text-furco-yellow/30 fill-current group-hover:text-furco-yellow/60 transition-colors duration-500">
                      <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,71.6,32.6C61,43.7,51.1,53.1,39.8,60.6C28.5,68.1,15.8,73.7,2.3,69.7C-11.2,65.7,-25.5,52.1,-38.6,40.6C-51.7,29.1,-63.6,19.7,-69.3,7.4C-75,-4.9,-74.5,-20.1,-66.9,-32.8C-59.3,-45.5,-44.6,-55.7,-30.2,-62.8C-15.8,-69.9,-1.7,-73.9,13.2,-76.4L44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-black" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* V. Trending / New Arrivals */}
      {trendingProducts.length > 0 && (
        <ProductCarousel title="Trending Now" products={trendingProducts} />
      )}

      {/* VI. Pet Parenting Tips (Blog) */}
      {blogPosts.length > 0 && (
        <section className="py-24 bg-[#FDFBF7] border-t border-black/5 w-full">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-black">Pet Parenting Tips</h2>
              <Link to="/blog" className="text-black font-medium hover:text-furco-gold transition-colors flex items-center gap-2 group">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <FadeIn key={post.id} delay={index * 0.1}>
                  <Link to={`/blog/${post.id}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5 h-full flex flex-col">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.featured_image || post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow relative">
                        <h3 className="text-xl font-serif font-bold text-black mb-3 group-hover:text-furco-gold transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                          {post.excerpt || post.content?.substring(0, 100) + '...'}
                        </p>
                        <div className="mt-auto pt-4 border-t border-black/5 flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-black/40">Read Article</span>
                          <ArrowRight className="w-4 h-4 text-furco-yellow" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-furco-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VII. Subscription CTA */}
      <section ref={targetRef} className="py-32 bg-furco-beige relative overflow-hidden w-full">
        <div className="container px-4 mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center md:text-left">
            <motion.h2 
              className="text-5xl md:text-7xl font-serif font-black text-black leading-none"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Get a Monthly <br/> Surprise
            </motion.h2>
            <p className="text-xl font-medium text-black/80 max-w-md mx-auto md:mx-0">
              Tailored treats and toys delivered to your doorstep. Happiness guaranteed.
            </p>
            <Button className="bg-black text-white hover:bg-white hover:text-black text-lg px-10 py-8 rounded-full shadow-xl transition-all duration-300">
              Get Custom & Start
            </Button>
          </div>
          
          <div className="relative">
            <motion.div 
              style={{ y }}
              className="relative z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1597633425046-08f5110420b5?q=80&w=1000&auto=format&fit=crop" 
                alt="Subscription Box" 
                className="w-full max-w-md mx-auto rounded-[3rem] shadow-2xl rotate-3 border-4 border-black"
              />
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/20 rounded-full blur-3xl -z-0" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
