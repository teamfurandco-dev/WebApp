import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';
import { cn } from '@fur-co/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Users', href: '/users', icon: Users },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-furco-yellow">Fur & Co Admin</h1>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-6 py-3 text-gray-700 hover:bg-furco-yellow/10 hover:text-furco-yellow transition-colors',
                    isActive && 'bg-furco-yellow/20 text-furco-yellow font-medium border-r-4 border-furco-yellow'
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
