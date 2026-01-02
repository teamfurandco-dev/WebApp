import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp, Facebook, Twitter, Linkedin, Share2, Clock, Calendar, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';
import { format } from 'date-fns';

const BlogPost = () => {
  const { id } = useParams();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Fetch blog post and related products
    const fetchData = async () => {
      try {
        const [blogData, prods] = await Promise.all([
          api.getBlogById(id),
          api.getProducts({})
        ]);
        setPost(blogData);
        setRelatedProducts(prods?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-12 h-12 animate-spin text-furco-yellow" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-4">
        <h2 className="text-2xl font-serif font-bold">Blog post not found</h2>
        <Link to="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-furco-yellow origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src={post.featured_image || 'https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=1000&auto=format&fit=crop'} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20 text-white bg-gradient-to-t from-black/80 to-transparent">
          <div className="container max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 text-sm md:text-base mb-4 font-medium text-furco-yellow">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> 
                  {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'Draft'}
                </span>
                {post.read_time && (
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.read_time}</span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl">
                  {post.excerpt}
                </p>
              )}
              {post.author && (
                <div className="flex items-center gap-2 mt-6">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <User className="w-5 h-5 text-furco-yellow" />
                  </div>
                  <span className="font-medium">{post.author}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <div 
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-black/80 prose-p:leading-relaxed prose-a:text-furco-yellow prose-blockquote:border-l-furco-yellow prose-blockquote:bg-furco-yellow/5 prose-blockquote:py-4 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Widget */}
        <div className="mt-16 pt-8 border-t border-black/10 flex items-center justify-between">
          <span className="font-serif font-bold text-xl">Share this article:</span>
          <div className="flex gap-4">
            {[Facebook, Twitter, Linkedin, Share2].map((Icon, i) => (
              <button 
                key={i}
                className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-furco-yellow hover:border-furco-yellow hover:text-black transition-all duration-300 group"
              >
                <Icon className="w-4 h-4 text-black/60 group-hover:text-black" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white py-20 border-t border-black/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shop Related</h2>
              <p className="text-muted-foreground text-lg">Our most loved picks for a healthy lifestyle.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-furco-yellow text-black rounded-full shadow-lg flex items-center justify-center hover:bg-black hover:text-furco-yellow transition-colors duration-300 z-40"
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default BlogPost;
