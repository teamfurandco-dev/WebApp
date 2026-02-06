import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { ShoppingCart, User, Search, Menu, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@fur-co/utils';
import logoSvg from '@/assets/logo.svg';
import unlimitedLogo from '@/assets/unlimted_logo.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getCartCount } = useCart();
  const { currentMode, switchMode } = useTheme();
  const isUnlimitedMode = currentMode === 'CORE';

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
    { name: 'About Us', path: '/about' },
    { name: 'Shop', path: '/products' },
    { name: 'PetSchool', path: '/blog' },
    { name: 'Unlimited', path: '/unlimited' },
  ];

  const sparkleGoldClass = "bg-clip-text text-transparent bg-[linear-gradient(45deg,#D4AF37,#FFF78A,#D4AF37)] bg-[length:200%_auto] animate-shimmer";

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b",
          isUnlimitedMode
            ? "bg-white/95 border-[#ffcc00]/20 text-gray-900"
            : "bg-[#ffcc00]/95 border-black/10 text-gray-900",
          isScrolled ? "py-2 shadow-sm" : "py-4"
        )}
      >
        <div className="container mx-auto px-4 md:px-8 max-w-full flex items-center justify-between gap-4">

          {/* 1. Left Section: Logo */}
          <Link to="/" className="relative z-50 group flex-shrink-0">
            <div className="flex items-center gap-2">
              <img
                src={isUnlimitedMode ? unlimitedLogo : logoSvg}
                alt="Fur & Co"
                className="h-10 md:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* 2. Center Section: Search Bar (Desktop Only) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl xl:max-w-2xl mx-auto px-4 lg:px-8">
            <div
              className="w-full relative group"
              onClick={() => setIsSearchOpen(true)}
            >
              <div className="flex items-center w-full h-12 rounded-full border border-black/10 bg-white/90 px-4 hover:border-[#ffcc00] transition-colors cursor-text">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-400 text-sm font-medium truncate">Search for science-backed essentials...</span>
              </div>
            </div>
          </div>

          {/* 3. Right Section: Navigation & Icons */}
          <div className="flex items-center gap-1 md:gap-6">
            {/* Desktop Navigation Links */}
            <nav className={cn(
              "hidden lg:flex items-center gap-2 mr-4 p-1.5 rounded-full border transition-colors duration-300",
              isUnlimitedMode ? "bg-black border-black" : "bg-white border-black"
            )}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full whitespace-nowrap",
                      isActive
                        ? (isUnlimitedMode ? "text-black" : "text-white")
                        : (isUnlimitedMode ? "text-white/70 hover:text-white" : "text-gray-800 hover:text-black"),
                      link.name === 'Unlimited' && !isActive ? "text-[#B8860B] font-bold" : "",
                      link.name === 'Unlimited' && isActive ? "font-bold" : ""
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-capsule"
                        className={cn(
                          "absolute inset-0 rounded-full z-0",
                          isUnlimitedMode ? "bg-[#B8860B]" : "bg-black"
                        )}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Utility Icons */}
            <div className="flex items-center gap-3 md:gap-4">

              {/* Mobile Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "md:hidden p-2 transition-colors",
                  "text-gray-900 hover:text-gray-600"
                )}
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={2.5} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className={cn(
                "hidden md:block p-2 transition-colors",
                isUnlimitedMode ? "text-gray-900 hover:text-gray-700" : "text-foreground hover:text-white"
              )}>
                <Heart className="w-6 h-6" strokeWidth={2.5} />
              </Link>

              {/* Cart */}
              <Link to="/cart" className={cn(
                "hidden md:flex p-2 relative transition-colors items-center justify-center",
                isUnlimitedMode ? "text-gray-900 hover:text-gray-700" : "text-foreground hover:text-white"
              )}>
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                {getCartCount() > 0 && (
                  <Badge className={`absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 p-0 flex items-center justify-center text-[10px] font-bold border-none shadow-sm ${isUnlimitedMode ? 'bg-white text-black' : 'bg-white text-black'}`}>
                    {getCartCount()}
                  </Badge>
                )}
              </Link>

              {/* Profile (Desktop) */}
              <Link to={user ? "/account" : "/login"} className={cn(
                "hidden md:block p-2 transition-colors",
                isUnlimitedMode ? "text-gray-900 hover:text-gray-700" : "text-foreground hover:text-white"
              )}>
                <User className="w-6 h-6" strokeWidth={2.5} />
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-black/5 hover:text-black text-gray-900"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
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
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                className="p-4 md:p-6 flex items-center gap-4 border-b border-border"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6 text-[#ffcc00]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none text-lg md:text-xl text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none font-serif"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </form>
              <div className="p-6 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wider font-medium">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Dog Food', 'Cat Toys', 'Grooming Kit', 'Organic Treats'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(tag)}`);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 rounded-full bg-card border border-border text-sm hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors text-foreground"
                    >
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
            className={cn(
              "fixed inset-0 z-40 flex flex-col pt-24 px-6 md:hidden overflow-y-auto",
              isUnlimitedMode ? "bg-white" : "bg-[#FDFBF7]"
            )}
          >
            <nav className="flex flex-col py-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "group flex items-center justify-between py-5 border-b border-black/5 transition-all duration-300",
                      isActive ? "text-black" : "text-black/60 hover:text-black"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-4">
                      {isActive && (
                        <motion.div
                          layoutId="mobile-nav-indicator"
                          className="w-2 h-2 rounded-full bg-[#B8860B]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className={cn(
                        "text-2xl font-bold tracking-tight",
                        link.name === 'Unlimited' ? "text-[#B8860B] font-black" : ""
                      )}>
                        {link.name}
                      </span>
                    </div>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs font-bold uppercase tracking-widest text-[#B8860B]"
                      >
                        Active
                      </motion.span>
                    )}
                  </Link>
                );
              })}

              <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-black/10">
                <Link to={user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-black/5 hover:bg-black/10 transition-colors">
                  <User className="w-6 h-6 text-black" />
                  <span className="text-sm font-bold text-black font-peace-sans">Account</span>
                </Link>
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-black/5 hover:bg-black/10 transition-colors">
                  <Heart className="w-6 h-6 text-black" />
                  <span className="text-sm font-bold text-black font-peace-sans">Wishlist</span>
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
