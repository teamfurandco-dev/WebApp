import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

export default function MonthlySuccess() {
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('CORE');
  }, [switchMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Monthly Plan Activated!
        </h1>
        
        <p className="text-white/60 mb-8">
          Your Unlimited Fur monthly subscription is now active. You'll receive your first delivery within 3-5 business days.
        </p>

        <div className="space-y-4">
          <Link to="/unlimited-fur/monthly/my-plan">
            <Button className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium">
              Manage My Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
