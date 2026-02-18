import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, BookOpen, RefreshCw, Menu, X } from 'lucide-react';
import { cn } from '@fur-co/utils';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import Logo from '../assets/logo.svg';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Blogs', href: '/blogs', icon: BookOpen },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Subscriptions', href: '/subscriptions', icon: RefreshCw },
  { name: 'Users', href: '/users', icon: Users },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-screen flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="Fur & Co" className="h-12 w-auto" />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Admin Panel</p>
                <p className="text-sm text-gray-600 mt-1 truncate">{user?.email}</p>
              </div>
            </div>
            <nav className="flex-1 py-6 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center px-6 py-3 mx-3 rounded-lg text-gray-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50/50 hover:text-amber-600 transition-all duration-200',
                      isActive && 'bg-gradient-to-r from-amber-50 to-yellow-50/50 text-amber-600 font-semibold shadow-sm'
                    )}
                  >
                    <Icon className={cn("w-5 h-5 mr-3", isActive && "text-amber-500")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={signOut}
                className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="hidden lg:block" />
          </header>
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
    </div>
  );
}
