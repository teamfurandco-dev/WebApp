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
      className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-md">
          <Wallet className="w-5 h-5 text-[#ffcc00]" />
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 leading-tight font-peace-sans uppercase tracking-tighter">Your Wallet</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Live Budget</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Monthly Budget */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-0.5">Budget Cap</div>
          <div className="text-2xl font-black text-black leading-none">{formatPrice(monthlyBudget)}</div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-[10px] mb-1.5 font-bold text-gray-600 uppercase tracking-widest">
            <span>Utilization</span>
            <span>{percentageUsed.toFixed(0)}%</span>
          </div>
          <div className="h-4 bg-white/40 rounded-full overflow-hidden border border-black/5 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentageUsed}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-black rounded-r-full"
            />
          </div>
        </div>

        {/* Spent and Remaining */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 bg-white/20 border border-white/40">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-gray-400" />
              <span className="text-[9px] uppercase font-black text-gray-500">Spent</span>
            </div>
            <div className="text-sm font-black text-gray-900 leading-none">
              {formatPrice(spent)}
            </div>
          </div>

          <div className="rounded-xl p-3 bg-black/5 border border-black/5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3 h-3 text-emerald-600" />
              <span className="text-[9px] uppercase font-black text-emerald-700">Left</span>
            </div>
            <div className="text-sm font-black text-black leading-none">
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
