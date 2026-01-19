import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Package, Edit, Pause, XCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/services/api';

export default function MyMonthlyPlan() {
  const navigate = useNavigate();
  const { switchMode } = useTheme();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    switchMode('CORE');
    fetchPlan();
  }, [switchMode]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/unlimited-fur/monthly-plan/active');
      setPlan(data);
    } catch (err) {
      console.error('Failed to fetch plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    if (!confirm('Pause your monthly plan? You can resume anytime.')) return;
    
    try {
      setActionLoading(true);
      await api.put(`/api/unlimited-fur/monthly-plan/${plan.id}/pause`);
      await fetchPlan();
    } catch (err) {
      alert('Failed to pause plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel your monthly plan? This cannot be undone.')) return;
    
    try {
      setActionLoading(true);
      await api.put(`/api/unlimited-fur/monthly-plan/${plan.id}/cancel`);
      navigate('/unlimited');
    } catch (err) {
      alert('Failed to cancel plan');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1B23] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#1A1B23] text-white py-20 px-8">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-serif mb-4">No Active Plan</h1>
          <p className="text-white/60 mb-8">You don't have an active monthly plan yet.</p>
          <Button
            onClick={() => navigate('/unlimited')}
            className="bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl px-8 py-4"
          >
            Start Monthly Plan
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#1A1B23] text-white py-20 px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-serif font-medium mb-4">My Monthly Plan</h1>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              plan.planStatus === 'active' ? 'bg-green-500/20 text-green-400' :
              plan.planStatus === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {plan.planStatus.toUpperCase()}
            </span>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Plan Details */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Plan Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-white/60 mb-1">Monthly Budget</div>
                <div className="text-2xl font-bold text-[#D4AF37]">
                  ₹{(plan.monthlyBudget / 100).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-1">Pet Type</div>
                <div className="text-xl font-bold capitalize">{plan.petType}</div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-1">Next Billing Date</div>
                <div className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  {formatDate(plan.nextBillingDate)}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-1">Categories</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {plan.selectedCategories.map(cat => (
                    <span key={cat} className="bg-white/10 px-3 py-1 rounded-full text-sm capitalize">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Products */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D4AF37]" />
              Selected Products ({plan.products?.length || 0})
            </h2>
            <div className="space-y-3">
              {plan.products?.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="font-bold">{item.product.name}</div>
                    <div className="text-sm text-white/60">{item.variant.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#D4AF37]">
                      ₹{(item.lockedPrice / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-white/60">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate(`/unlimited-fur/monthly/shopping?edit=${plan.id}`)}
              disabled={actionLoading || plan.planStatus !== 'active'}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl py-4 font-bold"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Plan
            </Button>

            {plan.planStatus === 'active' ? (
              <Button
                onClick={handlePause}
                disabled={actionLoading}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl py-4 font-bold border border-yellow-500/30"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause Plan
              </Button>
            ) : (
              <Button
                disabled
                className="bg-green-500/20 text-green-400 rounded-xl py-4 font-bold border border-green-500/30"
              >
                <Play className="w-5 h-5 mr-2" />
                Resume Plan
              </Button>
            )}

            <Button
              onClick={handleCancel}
              disabled={actionLoading}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl py-4 font-bold border border-red-500/30"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Cancel Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
