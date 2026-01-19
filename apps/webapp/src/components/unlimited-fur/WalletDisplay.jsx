import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@fur-co/utils';

export const WalletDisplay = ({ wallet }) => {
  const { monthlyBudget, spent, remaining, canAddMore } = wallet;
  
  const percentageUsed = monthlyBudget > 0 ? (spent / monthlyBudget) * 100 : 0;
  const percentageRemaining = 100 - percentageUsed;
  
  // Determine color state
  let colorState = 'green';
  if (percentageRemaining < 20) colorState = 'red';
  else if (percentageRemaining < 40) colorState = 'yellow';
  
  const colors = {
    green: { bg: 'bg-green-500/20', text: 'text-green-400', bar: 'bg-green-500' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', bar: 'bg-yellow-500' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', bar: 'bg-red-500' },
  };
  
  const formatPrice = (cents) => `₹${(cents / 100).toFixed(2)}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Your Budget Wallet</h3>
          <p className="text-sm text-white/60">Track your spending in real-time</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Monthly Budget */}
        <div>
          <div className="text-sm text-white/60 mb-1">Monthly Budget</div>
          <div className="text-3xl font-bold text-white">{formatPrice(monthlyBudget)}</div>
        </div>
        
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Budget Used</span>
            <span className="text-white font-medium">{percentageUsed.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentageUsed}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={cn('h-full', colors[colorState].bar)}
            />
          </div>
        </div>
        
        {/* Spent and Remaining */}
        <div className="grid grid-cols-2 gap-4">
          <div className={cn('rounded-xl p-4', colors[colorState].bg)}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs text-white/60">Spent</span>
            </div>
            <div className={cn('text-xl font-bold', colors[colorState].text)}>
              {formatPrice(spent)}
            </div>
          </div>
          
          <div className={cn('rounded-xl p-4', colors[colorState].bg)}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs text-white/60">Remaining</span>
            </div>
            <div className={cn('text-xl font-bold', colors[colorState].text)}>
              {formatPrice(remaining)}
            </div>
          </div>
        </div>
        
        {/* Status Message */}
        {!canAddMore && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
            Budget exhausted. Remove items to add more products.
          </div>
        )}
        
        {canAddMore && percentageRemaining < 20 && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400">
            Low budget remaining. Choose carefully!
          </div>
        )}
      </div>
    </motion.div>
  );
};
