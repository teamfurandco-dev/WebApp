import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import UnlimitedBackground from '@/components/unlimited-fur/UnlimitedBackground';

export default function BundleSuccess() {
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('CORE');
  }, [switchMode]);

  return (
    <div className="min-h-screen bg-[#ffcc00] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <UnlimitedBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center relative z-10 bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/60 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white shadow-sm" />
        </motion.div>

        <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight font-peace-sans">
          Bundle Order<br />Placed!
        </h1>

        <p className="text-gray-700 font-medium mb-8">
          Your Unlimited Joys bundle has been ordered successfully. You'll receive your items within 3-5 business days.
        </p>

        <div className="space-y-4">
          <Link to="/account">
            <Button className="w-full bg-black hover:bg-gray-800 text-white h-14 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95">
              View Order History
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <Link to="/unlimited">
            <Button variant="ghost" className="w-full text-gray-600 hover:text-black font-bold">
              Create Another Bundle
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
