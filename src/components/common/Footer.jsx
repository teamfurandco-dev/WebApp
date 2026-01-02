import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Newsletter from './Newsletter';

const Footer = () => {
  return (
    <footer className="mt-auto">
      <Newsletter />
      <div className="bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-fg))] pt-16 pb-8 border-t border-[hsl(var(--footer-fg))]/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Brand & About */}
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold">Fur & Co</h3>
              <p className="opacity-60 text-sm leading-relaxed">
                The Animal Aura. Providing the best care and products for your beloved pets.
              </p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="opacity-60 hover:opacity-100 hover:text-primary transition-colors">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="font-semibold mb-4 text-primary">Shop</h4>
              <ul className="space-y-2 text-sm opacity-60">
                <li><Link to="/products?category=food" className="hover:opacity-100 hover:text-primary transition-colors">Food & Treats</Link></li>
                <li><Link to="/products?category=toys" className="hover:opacity-100 hover:text-primary transition-colors">Toys & Accessories</Link></li>
                <li><Link to="/products?category=grooming" className="hover:opacity-100 hover:text-primary transition-colors">Grooming</Link></li>
                <li><Link to="/products?category=health" className="hover:opacity-100 hover:text-primary transition-colors">Health & Wellness</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4 text-primary">Company</h4>
              <ul className="space-y-2 text-sm opacity-60">
                <li><Link to="/about" className="hover:opacity-100 hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:opacity-100 hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:opacity-100 hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:opacity-100 hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <Separator className="bg-[hsl(var(--footer-fg))]/10 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-40">
            <p>&copy; {new Date().getFullYear()} Fur & Co. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:opacity-100 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:opacity-100 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
