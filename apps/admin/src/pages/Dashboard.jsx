import { Package, ShoppingCart, Users, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@fur-co/utils';

const stats = [
  { name: 'Total Products', value: 'Coming Soon', icon: Package, color: 'bg-blue-500', textColor: 'text-blue-600' },
  { name: 'Total Orders', value: 'Coming Soon', icon: ShoppingCart, color: 'bg-green-500', textColor: 'text-green-600' },
  { name: 'Total Users', value: 'Coming Soon', icon: Users, color: 'bg-purple-500', textColor: 'text-purple-600' },
  { name: 'Total Revenue', value: 'Coming Soon', icon: TrendingUp, color: 'bg-amber-500', textColor: 'text-amber-600' },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your store.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-xl", stat.color + '/10')}>
                  <Icon className={cn("w-6 h-6", stat.textColor)} />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mt-4">{stat.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-4 bg-amber-50 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-gray-500 text-center">Coming Soon</p>
          <p className="text-gray-400 text-sm text-center mt-1">Recent activity will appear here once data starts flowing in.</p>
        </div>
      </div>
    </div>
  );
}
