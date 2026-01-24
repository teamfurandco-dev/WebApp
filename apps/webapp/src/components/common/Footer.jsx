import { Link } from 'react-router-dom';
import logoSvg from '@/assets/logo.svg';
import { cn } from '@fur-co/utils';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/context/ThemeContext';


const Footer = () => {
  const { currentMode } = useTheme();
  const isUnlimitedMode = currentMode === 'CORE';
  return (
    <footer className={cn(
      "border-t pt-20 pb-8 mt-auto relative overflow-hidden transition-colors duration-300",
      isUnlimitedMode
        ? "bg-white text-gray-900 border-[#EDC520]/20"
        : "bg-[#F8C701] text-gray-900 border-black/10"
    )}>

      {/* Pet Theme Separator */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgNDBDOS41IDQwIDAgMzAuNSAwIDIwUzkuNSAwIDIwIDBzMjAgOS41IDIwIDIwLTkuNSAyMC0yMCAyMHptMCAyYzExIDAgMjAtOSAyMC0yMFMzMSAwIDIwIDAgMCA5IDAgMjBzOSAyMCAyMCAyMHoiIGZpbGw9IiNFREM1MjAiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]",
        isUnlimitedMode ? "opacity-20" : "opacity-10 mix-blend-multiply"
      )}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-1 space-y-6">
            <img src={logoSvg} alt="Fur & Co" className="h-8 md:h-10 w-auto" />
            <p className={cn("text-sm leading-relaxed max-w-xs", isUnlimitedMode ? "text-gray-900" : "text-gray-600")}>
              Providing science-backed care and premium essentials for the furry family members who deserve the world.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isUnlimitedMode ? "bg-gray-100 text-gray-600 hover:bg-[#EDC520] hover:text-gray-900" : "bg-black/5 text-gray-800 hover:bg-black hover:text-[#EDC520]"
                )}>
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className={cn("font-black mb-6 uppercase text-sm tracking-wider font-peace-sans", isUnlimitedMode ? "text-[#EDC520]" : "text-black")}>Shop</h4>
            <ul className={cn("space-y-4 text-sm", isUnlimitedMode ? "text-gray-900 font-medium" : "text-gray-600")}>
              {['Food & Treats', 'Toys & Accessories', 'Grooming', 'Health & Wellness'].map((item) => (
                <li key={item}><Link to={`/products?category=${item.toLowerCase()}`} className="hover:text-black transition-colors flex items-center gap-2">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className={cn("font-black mb-6 uppercase text-sm tracking-wider font-peace-sans", isUnlimitedMode ? "text-[#EDC520]" : "text-black")}>Company</h4>
            <ul className={cn("space-y-4 text-sm", isUnlimitedMode ? "text-gray-900 font-medium" : "text-gray-600")}>
              {['About Us', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}><Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-black transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className={cn("font-black mb-6 uppercase text-sm tracking-wider font-peace-sans", isUnlimitedMode ? "text-[#EDC520]" : "text-black")}>Stay Connected</h4>
            <p className={cn("text-sm mb-4", isUnlimitedMode ? "text-gray-900 font-medium" : "text-gray-600")}>Join our newsletter for exclusive offers and pet care tips.</p>
            <div className={cn(
              "flex rounded-full p-1 border focus-within:border-black/50 transition-colors",
              isUnlimitedMode ? "bg-gray-50 border-gray-200" : "bg-white/40 border-white/40"
            )}>
              <input
                type="email"
                placeholder="Enter email"
                className="bg-transparent border-none text-gray-900 text-sm px-4 py-2 w-full focus:ring-0 placeholder:text-gray-500"
              />
              <button className={cn(
                "px-4 py-2 rounded-full font-bold text-xs transition-colors",
                isUnlimitedMode ? "bg-[#EDC520] text-gray-900 hover:bg-black hover:text-white" : "bg-black text-[#EDC520] hover:bg-white hover:text-black"
              )}>
                Join
              </button>
            </div>
          </div>
        </div>

        <Separator className={cn("mb-8", isUnlimitedMode ? "bg-gray-200" : "bg-black/10")} />

        <div className={cn("flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold", isUnlimitedMode ? "text-gray-900" : "text-gray-500")}>
          <p>&copy; {new Date().getFullYear()} Fur & Co. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// Updated footer bg reference
