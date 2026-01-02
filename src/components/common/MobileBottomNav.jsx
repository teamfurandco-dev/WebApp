import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const MobileBottomNav = () => {
    const { user } = useAuth();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Search', path: '/products' }, // Using products as search landing or separate search page? Request said "Search"
        { icon: ShoppingCart, label: 'Cart', path: '/cart' },
        { icon: User, label: 'Profile', path: user ? '/account' : '/login' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            isActive ? "text-furco-yellow" : "text-gray-500 hover:text-gray-900"
                        )}
                    >
                        <item.icon className="w-6 h-6" strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default MobileBottomNav;
