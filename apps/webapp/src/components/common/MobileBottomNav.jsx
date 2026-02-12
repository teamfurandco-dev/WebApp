import { createPortal } from 'react-dom';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@fur-co/utils';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
    const { user } = useAuth();
    const { getCartCount } = useCart();
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Search', path: '/products' },
        { icon: ShoppingCart, label: 'Cart', path: '/cart' },
        { icon: User, label: 'Profile', path: user ? '/account' : '/login' },
    ];

    return createPortal(
        <div
            className="fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-100 md:hidden px-4 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]"
            style={{
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))'
            }}
        >
            <div className="flex justify-around items-center h-16 relative">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const isCart = item.label === 'Cart';

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300 z-10",
                                isActive ? "text-white" : "text-gray-400"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-capsule"
                                    className="absolute inset-y-2 inset-x-1 bg-black rounded-2xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <div className="relative">
                                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                                {isCart && getCartCount() > 0 && (
                                    <Badge className={cn(
                                        "absolute -top-1.5 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[8px] font-black border-2 border-white shadow-sm",
                                        isActive ? "bg-[#ffcc00] text-black" : "bg-black text-[#ffcc00]"
                                    )}>
                                        {getCartCount()}
                                    </Badge>
                                )}
                            </div>
                            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </div>,
        document.body
    );
};

export default MobileBottomNav;
