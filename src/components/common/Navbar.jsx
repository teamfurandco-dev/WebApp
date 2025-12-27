import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, User, Search, Menu, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Blog', path: '/blog' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-furco-cream/95 backdrop-blur-md shadow-sm border-b border-black/5 py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* 1. Logo */}
          <Link to="/" className="relative z-50 group">
            <div className="flex flex-col leading-none">
              <span className="text-2xl md:text-3xl font-serif font-black text-black tracking-tighter group-hover:text-furco-gold transition-colors duration-300">
                FUR & CO
              </span>
              <span className="text-[10px] md:text-xs font-sans font-medium tracking-[0.2em] text-black/60 uppercase group-hover:text-black transition-colors duration-300">
                The Animal Aura
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="relative group text-sm font-medium text-black transition-colors hover:text-furco-gold"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-furco-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* 3. Utility Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Search Trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-black hover:text-furco-gold transition-colors"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="hidden md:block text-black hover:text-furco-gold transition-colors">
              <Heart className="w-6 h-6" strokeWidth={1.5} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-black hover:text-furco-gold transition-colors">
              <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-furco-gold text-black text-[10px] font-bold border-none shadow-sm">
                2
              </Badge>
            </Link>

            {/* Profile (Desktop) */}
            <Link to={user ? "/account" : "/login"} className="hidden md:block text-black hover:text-furco-gold transition-colors">
              <User className="w-6 h-6" strokeWidth={1.5} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden relative z-50 text-black hover:text-furco-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-7 h-7" strokeWidth={1.5} />
              ) : (
                <Menu className="w-7 h-7" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 4. Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-2xl bg-furco-cream rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex items-center gap-4 border-b border-furco-gold/20">
                <Search className="w-6 h-6 text-furco-gold" />
                <input 
                  type="text" 
                  placeholder="Search for products, brands, or categories..." 
                  className="flex-1 bg-transparent border-none text-xl text-black placeholder:text-black/40 focus:ring-0 focus:outline-none font-serif"
                  autoFocus
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-black/60" />
                </button>
              </div>
              <div className="p-6 bg-white/50">
                <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wider font-medium">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Dog Food', 'Cat Toys', 'Grooming Kit', 'Organic Treats'].map((tag) => (
                    <button key={tag} className="px-4 py-2 rounded-full bg-white border border-black/5 text-sm hover:border-furco-gold hover:text-furco-gold transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-furco-gold flex flex-col justify-center items-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-4xl font-serif font-bold text-black hover:text-white transition-colors relative group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-black transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
              <div className="flex gap-8 mt-8">
                <Link to={user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="w-8 h-8 text-black hover:text-white transition-colors" />
                </Link>
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                  <Heart className="w-8 h-8 text-black hover:text-white transition-colors" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
