import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp, Facebook, Twitter, Linkedin, Share2, Clock, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';

const BlogPost = () => {
  const { id } = useParams();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Mock Data for the post (In a real app, fetch based on ID)
  const post = {
    title: "5 Tips for a Healthy Dog Diet",
    subtitle: "Nutrition is the foundation of a happy, active life for your furry friend.",
    author: "Dr. Sarah Miller",
    date: "Oct 25, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=1000&auto=format&fit=crop",
    content: [
      {
        type: 'paragraph',
        text: "Just like humans, dogs need a balanced diet to thrive. Providing the right mix of proteins, carbohydrates, fats, vitamins, and minerals is essential for their longevity and vitality. But with so many options on the shelf, where do you start?"
      },
      {
        type: 'heading',
        text: "1. Prioritize High-Quality Protein"
      },
      {
        type: 'paragraph',
        text: "Protein is the building block of your dog's body. Look for foods where real meat (chicken, beef, lamb) is the first ingredient. Avoid generic 'meat meals' or by-products if possible."
      },
      {
        type: 'quote',
        text: "A healthy dog is a happy dog. Nutrition isn't just about survival; it's about thriving."
      },
      {
        type: 'paragraph',
        text: "Puppies, adults, and seniors all have different protein requirements, so be sure to choose a formula that matches your dog's life stage."
      },
      {
        type: 'image',
        src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=1000&auto=format&fit=crop",
        alt: "Dog eating healthy food"
      },
      {
        type: 'heading',
        text: "2. Incorporate Fresh Vegetables"
      },
      {
        type: 'paragraph',
        text: "Many vegetables are safe and healthy for dogs. Carrots, green beans, and pumpkin can be great low-calorie treats that add fiber and vitamins to their diet. Always avoid toxic foods like onions, grapes, and chocolate."
      },
      {
        type: 'callout',
        title: "Did You Know?",
        text: "Pumpkin is a superfood for dogs! It helps with digestion and can soothe an upset stomach."
      }
    ]
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Fetch related products (mock)
    const fetchRelated = async () => {
      const prods = await api.getProducts({ limit: 3 });
      setRelatedProducts(prods);
    };
    fetchRelated();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          src={post.image} 
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
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl">
                {post.subtitle}
              </p>
              <div className="flex items-center gap-2 mt-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <User className="w-5 h-5 text-furco-yellow" />
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-8">
          {post.content.map((block, index) => {
            if (block.type === 'paragraph') {
              return (
                <p key={index} className="text-xl leading-relaxed text-black/80 font-sans">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'heading') {
              return (
                <h2 key={index} className="text-3xl font-serif font-bold text-black mt-12 mb-6">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={index} className="my-10 pl-8 border-l-4 border-furco-yellow italic text-2xl font-serif text-black/90 bg-furco-yellow/5 py-6 pr-6 rounded-r-xl">
                  "{block.text}"
                </blockquote>
              );
            }
            if (block.type === 'image') {
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="my-12 rounded-2xl overflow-hidden shadow-xl"
                >
                  <img src={block.src} alt={block.alt} className="w-full h-auto" />
                </motion.div>
              );
            }
            if (block.type === 'callout') {
              return (
                <div key={index} className="my-10 p-8 border-2 border-black rounded-xl bg-[#FFFDF5] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-furco-yellow/20 rounded-bl-full -mr-10 -mt-10" />
                  <h3 className="text-xl font-bold text-furco-yellow mb-2 uppercase tracking-wider">{block.title}</h3>
                  <p className="text-lg text-black font-medium">{block.text}</p>
                </div>
              );
            }
            return null;
          })}
        </div>

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
