import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white">Fur & Co</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              The Animal Aura. Providing the best care and products for your beloved pets.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-white/60 hover:text-furco-gold transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4 text-furco-gold">Shop</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/products?category=food" className="hover:text-white transition-colors">Food & Treats</Link></li>
              <li><Link to="/products?category=toys" className="hover:text-white transition-colors">Toys & Accessories</Link></li>
              <li><Link to="/products?category=grooming" className="hover:text-white transition-colors">Grooming</Link></li>
              <li><Link to="/products?category=health" className="hover:text-white transition-colors">Health & Wellness</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-furco-gold">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-furco-gold">Stay Updated</h4>
            <p className="text-white/60 text-sm mb-4">Subscribe to our newsletter for latest updates and offers.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-furco-gold"
              />
              <Button type="submit" className="bg-furco-gold text-black hover:bg-white">
                Join
              </Button>
            </form>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} Fur & Co. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
