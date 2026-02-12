import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  User, Package, MapPin, CreditCard, Settings,
  LogOut, Plus, ChevronRight, Truck, ShoppingBag, Heart, X, RefreshCw, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/services/api';
import OrderDetail from '@/pages/OrderDetail';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@fur-co/utils';

// Assets
import catImage from '@/assets/cat.jpeg';
import dogImage from '@/assets/dog.jpeg';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className="block group">
    <div className={cn(
      "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 relative overflow-hidden",
      active
        ? "bg-furco-yellow text-black font-bold shadow-lg shadow-furco-yellow/10"
        : "text-black/60 hover:bg-black/5 hover:text-black"
    )}>
      <Icon className={cn("h-5 w-5", active ? "text-black" : "text-black/40 group-hover:text-black")} />
      <span className="text-[15px] font-black">{label}</span>

      {active && (
        <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none">
          <Package className="w-20 h-20 rotate-12" />
        </div>
      )}
    </div>
  </Link>
);

const PetAvatar = ({ type, name, active, onDelete }) => (
  <div className="flex flex-col items-center gap-2 group relative">
    <div className={cn(
      "w-16 h-16 rounded-full border-2 p-1 transition-all duration-300 relative",
      active ? "border-furco-yellow scale-110" : "border-black/5"
    )}>
      <div className="w-full h-full rounded-full overflow-hidden relative">
        <img
          src={type === 'cat' ? catImage : dogImage}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(type); }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-black/10 rounded-full flex items-center justify-center shadow-md hover:bg-destructive hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
    <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">{name}</span>
  </div>
);

const OtpModal = ({ isOpen, onClose, onVerify, phone }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onVerify(otp);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl p-10 w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-6 h-6 text-black/40" />
        </button>

        <h2 className="text-3xl font-peace-sans text-black mb-2">Verify Phone</h2>
        <p className="text-black/40 font-medium mb-8">
          Enter the code sent to <span className="text-black font-bold">{phone}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="w-full h-16 bg-black/5 rounded-xl px-4 text-center text-3xl font-peace-sans tracking-[0.5em] text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none"
            autoFocus
          />

          <p className="text-xs text-center text-black/40">
            Didn't receive code? <button type="button" className="text-black font-bold hover:underline">Resend</button>
          </p>

          <Button
            type="submit"
            disabled={loading || otp.length < 4}
            className="w-full h-14 bg-black text-white rounded-xl text-lg font-peace-sans uppercase tracking-[0.1em] shadow-xl hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Now'}
          </Button>
        </form>
      </div>
    </div>
  );
};

const AddPetModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl p-10 w-full max-w-lg relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-6 h-6 text-black/40" />
        </button>

        <h2 className="text-3xl font-peace-sans text-black mb-2">Add New Pet</h2>
        <p className="text-black/40 font-medium mb-10">Select your companion to personalize your experience.</p>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => { onAdd('dog'); onClose(); }}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-black/[0.03] hover:border-furco-yellow hover:bg-furco-yellow/5 transition-all"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform">
              <img src={dogImage} alt="Dog" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg">Dog</span>
          </button>

          <button
            onClick={() => { onAdd('cat'); onClose(); }}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-black/[0.03] hover:border-furco-yellow hover:bg-furco-yellow/5 transition-all"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform">
              <img src={catImage} alt="Cat" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg">Cat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileSidebar = ({ user, petTypes, onLogout, onAddPet, onDeletePet }) => {
  const location = useLocation();

  return (
    <aside className="w-full md:w-[320px] bg-white rounded-2xl shadow-2xl shadow-black/[0.03] overflow-hidden flex flex-col p-8 sticky top-10 h-[calc(100vh-80px)]">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-10">
        <Avatar className="h-14 w-14 border-2 border-furco-yellow/20">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback className="bg-furco-yellow/10 text-furco-yellow font-bold">
            {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-peace-sans text-lg text-black leading-tight truncate max-w-[160px]">
            {user?.full_name || 'Premium User'}
          </h2>
          <span className="text-xs text-black/40 truncate max-w-[160px] font-medium">
            {user?.email}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1 overflow-y-auto hide-scrollbar">
        <SidebarLink to="/account/orders" icon={Package} label="Orders" active={location.pathname === '/account/orders' || location.pathname === '/account'} />
        <SidebarLink to="/account/addresses" icon={MapPin} label="Addresses" active={location.pathname === '/account/addresses'} />
        <SidebarLink to="/account/subscriptions" icon={RefreshCw} label="Subscriptions" active={location.pathname === '/account/subscriptions'} />
        <SidebarLink to="/account/settings" icon={Settings} label="Account Settings" active={location.pathname === '/account/settings'} />

        <div className="pt-8 pb-4">
          <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mb-6 px-6">Your Pets</p>
          <div className="flex px-4 gap-6">
            {petTypes?.includes('dog') && <PetAvatar type="dog" name="Buddy" active onDelete={onDeletePet} />}
            {petTypes?.includes('cat') && <PetAvatar type="cat" name="Lucy" active onDelete={onDeletePet} />}
            <div
              onClick={onAddPet}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-black/30 flex items-center justify-center group-hover:border-furco-yellow group-hover:bg-furco-yellow/5 transition-all">
                <Plus className="w-6 h-6 text-black/40 group-hover:text-furco-yellow" />
              </div>
              <span className="text-[10px] font-bold text-black/40 group-hover:text-furco-yellow uppercase tracking-widest">Add Pet</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-4 px-6 py-4 text-black/40 hover:text-destructive transition-colors duration-300"
      >
        <LogOut className="h-5 w-5" />
        <span className="text-[15px] font-peace-sans">Logout</span>
      </button>
    </aside>
  );
};

const Orders = ({ orders, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-peace-sans text-black">Orders</h1>
          <div className="relative">
            <Truck className="w-12 h-12 text-black/80" />
            <div className="absolute top-1 right-1 w-6 h-6 bg-furco-yellow rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <div className="w-2.5 h-2.5 bg-black rounded-sm" />
            </div>
          </div>
        </div>
        <Link to="/products">
          <Button className="bg-furco-yellow hover:bg-furco-yellow-hover text-black font-peace-sans rounded-xl h-12 px-8 flex items-center gap-3 active:scale-95 transition-all">
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-black/[0.02] overflow-hidden border border-black/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.05]">
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Order ID</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Date</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Status</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Total</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-black/30"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-10 py-16 text-center">
                    <div className="w-10 h-10 border-4 border-furco-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Fetching your history...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-10 py-16 text-center">
                    <div className="max-w-xs mx-auto space-y-6">
                      <div className="w-24 h-24 bg-furco-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-furco-yellow" />
                      </div>
                      <h3 className="text-xl font-peace-sans text-black">No orders found</h3>
                      <p className="text-sm text-black/40 font-medium leading-relaxed">
                        Your history is currently empty. Start your premium pet care journey today!
                      </p>
                      <Link to="/products" className="inline-block pt-4">
                        <Button className="bg-black text-white px-8 rounded-xl h-12 font-peace-sans">Browse Collection</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={cn(
                    "group transition-all duration-300",
                    idx % 2 === 0 ? "bg-white" : "bg-furco-cream/20"
                  )}
                >
                  <td className="px-10 py-8">
                    <span className="font-bold text-black font-peace-sans">#{order.order_number || order.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-bold text-black/60">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        order.status === 'delivered' ? "bg-green-500" : order.status === 'cancelled' ? "bg-red-500" : "bg-furco-yellow"
                      )} />
                      <span className="text-sm font-bold text-black capitalize">{order.status || 'Processing'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-bold text-black">₹{(order.total_amount / 100).toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <Link to={`/account/orders/${order.id}`}>
                      <Button className="bg-furco-yellow hover:bg-furco-yellow-hover text-black font-peace-sans rounded-xl h-11 px-6 flex items-center gap-3 transition-all duration-300 active:scale-95">
                        <Package className="w-4 h-4" />
                        View Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Addresses = ({ addresses, setAddresses, onRefresh, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading && addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-12 h-12 border-4 border-furco-yellow border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Fetching your addresses...</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.deleteAddress(id);
      toast.success('Address deleted successfully');
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.setDefaultAddress(id);
      toast.success('Default address updated');
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
    } catch (err) {
      toast.error('Failed to set default address');
    }
  };

  const handleSuccess = (address) => {
    setAddresses(prev => {
      // If the new/updated address is default, unset other defaults
      const updatedList = address.isDefault
        ? prev.map(a => ({ ...a, isDefault: false }))
        : [...prev];

      if (editingAddress) {
        return updatedList.map(a => a.id === address.id ? address : a);
      } else {
        return [address, ...updatedList];
      }
    });
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-peace-sans text-black">Addresses</h1>
          <MapPin className="w-10 h-10 text-black/60" />
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-black/5 rounded-full transition-colors group"
            title="Refresh addresses"
          >
            <RefreshCw className={cn("w-5 h-5 text-black/20 group-hover:text-black/40", loading && "animate-spin")} />
          </button>
        </div>
        <Button
          onClick={() => { setEditingAddress(null); setShowForm(true); }}
          className="bg-furco-yellow hover:bg-furco-yellow-hover text-black font-peace-sans rounded-xl h-12 px-8 flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Address
        </Button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl p-10 shadow-xl border border-black/[0.03]">
          <AddressForm
            initialData={editingAddress}
            onCancel={() => setShowForm(false)}
            onSuccess={handleSuccess}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-24 text-center border border-black/[0.03]">
              <MapPin className="w-16 h-16 text-black/10 mx-auto mb-6" />
              <h3 className="text-xl font-peace-sans text-black mb-2">No addresses yet</h3>
              <p className="text-black/40 font-medium max-w-xs mx-auto mb-8">
                Add your shipping address for a faster checkout experience.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-black text-white px-10 rounded-xl h-14 font-peace-sans"
                >
                  Get Started
                </Button>
                <button
                  onClick={onRefresh}
                  className="text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors"
                >
                  Sync from server
                </button>
              </div>
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={cn(
                  "bg-white rounded-2xl p-8 border-2 transition-all group relative overflow-hidden",
                  addr.isDefault ? "border-furco-yellow shadow-xl shadow-furco-yellow/5" : "border-black/[0.03] hover:border-furco-yellow/30"
                )}
              >
                {addr.isDefault && (
                  <div className="absolute top-6 right-8 bg-furco-yellow text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Default
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-peace-sans text-black mb-1">{addr.fullName}</h3>
                  <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.2em]">{addr.label || 'Home'}</p>
                </div>

                <div className="space-y-1 text-sm text-black/60 font-medium mb-8 leading-relaxed">
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="pt-2 text-black/80">{addr.phone}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => { setEditingAddress(addr); setShowForm(true); }}
                    className="h-10 px-5 rounded-xl text-[12px] font-peace-sans bg-black/5 hover:bg-black/10"
                  >
                    Edit
                  </Button>
                  {!addr.isDefault && (
                    <Button
                      variant="ghost"
                      onClick={() => handleSetDefault(addr.id)}
                      className="h-10 px-5 rounded-xl text-[12px] font-peace-sans hover:bg-furco-yellow/10"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(addr.id)}
                    className="h-10 px-5 rounded-xl text-[12px] font-peace-sans text-destructive hover:bg-destructive/5 ml-auto"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const Subscriptions = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const data = await api.unlimited.getActivePlan();
      setPlan(data);
    } catch (err) {
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleAction = async (action, planId) => {
    try {
      setActionLoading(true);
      if (action === 'edit') {
        const draft = await api.unlimited.createDraftFromPlan(planId);
        navigate(`/unlimited-fur/monthly/shopping?mode=edit&draftId=${draft.id}&planId=${planId}`);
        return;
      } else if (action === 'skip') {
        const confirmSkip = confirm('Skip this billing cycle? Your next order will be pushed by one month.');
        if (!confirmSkip) return;
        await api.unlimited.skipPlan(planId);
        toast.success('Billing cycle skipped successfully!');
      } else if (action === 'pause') {
        await api.unlimited.pausePlan(planId);
        toast.success('Subscription paused.');
      } else if (action === 'resume') {
        await api.unlimited.resumePlan(planId);
        toast.success('Subscription resumed.');
      } else if (action === 'cancel') {
        if (!confirm('Are you sure you want to cancel your subscription?')) return;
        await api.unlimited.cancelPlan(planId);
        toast.success('Subscription cancelled.');
      }
      await fetchPlan();
    } catch (err) {
      toast.error(err.message || `Failed to ${action} subscription`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-12 h-12 border-4 border-furco-yellow border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Loading your subscriptions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-6 mb-8">
        <h1 className="text-4xl font-peace-sans text-black">Subscriptions</h1>
        <RefreshCw className={cn("w-10 h-10 text-black/60", actionLoading && "animate-spin")} />
      </div>

      {!plan ? (
        <div className="bg-white rounded-2xl p-24 text-center border border-black/[0.03] shadow-xl shadow-black/[0.01]">
          <div className="w-24 h-24 bg-furco-yellow/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <RefreshCw className="w-10 h-10 text-furco-yellow" />
          </div>
          <h3 className="text-2xl font-peace-sans text-black mb-4">No Active Subscriptions</h3>
          <p className="text-black/40 font-medium max-w-sm mx-auto leading-relaxed mb-8">
            You haven't joined the Unlimited Fur family yet. Join today for tailored premium pet care!
          </p>
          <Link to="/unlimited">
            <Button className="bg-black text-white px-10 rounded-xl h-14 font-peace-sans">Explore Unlimited</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* Main Plan Card */}
          <div className="bg-white rounded-[32px] border border-black/[0.03] shadow-2xl shadow-black/[0.02] overflow-hidden">
            <div className="p-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]",
                      plan.planStatus === 'active' ? "bg-green-100 text-green-700" : "bg-furco-yellow/20 text-black/60"
                    )}>
                      {plan.planStatus}
                    </Badge>
                    <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Unlimited Monthly</span>
                  </div>
                  <h2 className="text-3xl font-peace-sans text-black">Your Pet Care Pack</h2>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Next Billing</p>
                      <p className="font-bold text-black">{new Date(plan.nextBillingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="w-px h-10 bg-black/5" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Monthly Budget</p>
                      <p className="font-bold text-black">₹{(plan.monthlyBudget / 100).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleAction('edit', plan.id)}
                    disabled={actionLoading || plan.planStatus !== 'active'}
                    className="h-12 px-6 rounded-xl font-peace-sans text-[12px] border-2 hover:bg-black hover:text-white transition-all"
                  >
                    Edit Pack
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAction('skip', plan.id)}
                    disabled={actionLoading}
                    className="h-12 px-6 rounded-xl font-peace-sans text-[12px] border-2 hover:bg-black hover:text-white transition-all"
                  >
                    Skip a Month
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAction(plan.planStatus === 'paused' ? 'resume' : 'pause', plan.id)}
                    disabled={actionLoading}
                    className="h-12 px-6 rounded-xl font-peace-sans text-[12px] border-2 hover:bg-black hover:text-white transition-all"
                  >
                    {plan.planStatus === 'paused' ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleAction('cancel', plan.id)}
                    disabled={actionLoading}
                    className="h-12 px-6 rounded-xl font-peace-sans text-[12px] text-destructive hover:bg-destructive/5"
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-6">
                <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.2em]">Pack Selection ({plan.products.length} Items)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.products.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 bg-black/[0.02] p-4 rounded-2xl border border-black/[0.03]">
                      <div className="w-16 h-16 rounded-xl bg-white p-2 shadow-sm">
                        {/* We don't have product images in the products join easily here, using a generic check */}
                        <div className="w-full h-full bg-furco-cream/30 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-black/20" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-sm line-clamp-1">{p.product.name}</h4>
                        <p className="text-[10px] font-medium text-black/40">{p.variant.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] font-black text-black/80">Qty: {p.quantity}</span>
                          <span className="text-[10px] font-black text-black">₹{(p.lockedPrice / 100).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-black/5 p-6 flex items-center justify-center gap-4">
              <ShieldCheck className="w-5 h-5 text-black/40" />
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Premium Care Protection Enabled</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-furco-cream/20 p-8 rounded-[32px] space-y-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <Truck className="w-5 h-5 text-furco-yellow" />
              </div>
              <h4 className="font-peace-sans text-sm">Free Express Delivery</h4>
              <p className="text-xs text-black/40 font-medium">As an Unlimited member, all your pack renewals ship free.</p>
            </div>
            <div className="bg-furco-cream/20 p-8 rounded-[32px] space-y-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <RefreshCw className="w-5 h-5 text-furco-yellow" />
              </div>
              <h4 className="font-peace-sans text-sm">Flexibility Guaranteed</h4>
              <p className="text-xs text-black/40 font-medium">Pause or skip any time. Your pack, your rules.</p>
            </div>
            <div className="bg-furco-cream/20 p-8 rounded-[32px] space-y-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-furco-yellow" />
              </div>
              <h4 className="font-peace-sans text-sm">Priority Support</h4>
              <p className="text-xs text-black/40 font-medium">Access our dedicated vet help line 24/7.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddressForm = ({ initialData, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    label: 'Home',
    isDefault: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (initialData) {
        const updated = await api.updateAddress(initialData.id, formData);
        toast.success('Address updated successfully');
        onSuccess(updated);
      } else {
        const saved = await api.addAddress(formData);
        toast.success('Address added successfully');
        onSuccess(saved);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-peace-sans text-black">
          {initialData ? 'Edit Address' : 'New Address'}
        </h2>
        <Button type="button" variant="ghost" onClick={onCancel} className="text-black/40 hover:text-black">
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Full Name</label>
          <input
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Phone Number</label>
          <input
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none"
            placeholder="+91 9876543210"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Address Line 1</label>
          <input
            required
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className="w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none"
            placeholder="Street, Building, Flat"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Address Line 2 (Optional)</label>
          <input
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none"
            placeholder="Landmark, Area"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">City</label>
          <input
            required
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none"
            placeholder="Mumbai"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">State</label>
          <input
            required
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none"
            placeholder="Maharashtra"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Postal Code</label>
          <input
            required
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none"
            placeholder="400001"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Label</label>
          <select
            name="label"
            value={formData.label}
            onChange={handleChange}
            className="w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none appearance-none"
          >
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 py-4">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="w-5 h-5 accent-furco-yellow"
        />
        <label htmlFor="isDefault" className="text-sm font-bold text-black/60 cursor-pointer">Set as default address</label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-16 bg-black text-white rounded-xl text-lg font-peace-sans uppercase tracking-[0.1em] shadow-xl hover:bg-gray-800 transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : initialData ? 'Update Address' : 'Save Address'}
      </Button>
    </form>
  );
};
const AccountSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(user?.preferences?.phoneVerified || false);

  const handleRequestVerification = async () => {
    if (!formData.phone) {
      toast.error('Please enter a phone number first');
      return;
    }

    try {
      setIsUpdating(true);
      await api.requestPhoneVerification(formData.phone);
      toast.success(`Verification code sent to ${formData.phone}`);
      setShowOtpModal(true);
    } catch (error) {
      toast.error(error.message || 'Failed to send verification code');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      const res = await api.verifyPhone(formData.phone, otp);
      if (res) {
        toast.success('Phone number verified successfully!');
        setIsPhoneVerified(true);
        setShowOtpModal(false);
      }
    } catch (error) {
      toast.error(error.message || 'Invalid verification code');
    }
  };

  // Check if provider is email (for password reset visibility)
  const isEmailProvider = user?.app_metadata?.provider === 'email' || !user?.app_metadata?.provider;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    toast.success('Settings UI ready! Backend linking coming soon.');
    setTimeout(() => setIsUpdating(false), 1000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-6 mb-8">
        <h1 className="text-4xl font-peace-sans text-black">Account Settings</h1>
        <Settings className="w-10 h-10 text-black/60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-10 shadow-xl border border-black/[0.03]">
            <h2 className="text-xl font-peace-sans text-black mb-10 flex items-center gap-3">
              <User className="w-6 h-6 text-furco-yellow" />
              Personal Information
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:border-furco-yellow focus:bg-white transition-all outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Phone Number</label>
                  <div className="relative">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={cn(
                        "w-full h-14 bg-black/5 rounded-xl px-6 font-bold text-black border-2 border-transparent focus:bg-white transition-all outline-none",
                        isPhoneVerified ? "focus:border-green-500/50 pr-32" : "focus:border-furco-yellow pr-24"
                      )}
                      placeholder="+91 00000 00000"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {isPhoneVerified ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
                          <ShieldCheck className="w-3 h-3 text-green-600" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-green-700">Verified</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRequestVerification}
                          disabled={!formData.phone || isUpdating}
                          className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-peace-sans uppercase tracking-widest hover:bg-furco-yellow hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Email Address</label>
                <div className="relative">
                  <input
                    disabled
                    name="email"
                    value={formData.email}
                    className="w-full h-14 bg-black/[0.02] rounded-xl px-6 font-bold text-black/40 border-2 border-transparent cursor-not-allowed outline-none"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <span className="text-[9px] font-black uppercase bg-black/5 text-black/40 px-3 py-1 rounded-full">Primary</span>
                  </div>
                </div>
                <p className="text-[10px] text-black/30 font-medium px-2">Email changes require identity verification.</p>
              </div>

              <Button
                type="submit"
                disabled={isUpdating}
                className="w-full h-16 bg-black text-white rounded-xl text-lg font-peace-sans uppercase tracking-[0.1em] shadow-xl hover:bg-gray-800 transition-all disabled:opacity-50 mt-4"
              >
                {isUpdating ? 'Saving Changes...' : 'Save Profile Settings'}
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {isEmailProvider && (
            <div className="bg-black text-white rounded-2xl p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Settings className="w-40 h-40 rotate-12" />
              </div>
              <h3 className="text-xl font-peace-sans mb-4 relative z-10">Security</h3>
              <p className="text-white/60 text-xs font-medium mb-8 leading-relaxed relative z-10">
                Keeping your pet's data safe is our priority. Reset your password regularly.
              </p>
              <Button
                onClick={() => toast.info('Password reset email requested!')}
                className="w-full bg-white text-black hover:bg-furco-yellow rounded-xl h-12 font-peace-sans text-xs relative z-10"
              >
                Reset Password
              </Button>
            </div>
          )}

          <div className="bg-furco-yellow/10 rounded-2xl p-8 border border-furco-yellow/20">
            <h4 className="font-peace-sans text-sm text-black mb-2">Need Help?</h4>
            <p className="text-xs text-black/60 font-medium mb-6">Our team is here to support you and your companion through every step of your journey together.</p>
            <Button variant="link" className="p-0 h-auto text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              Customer Support <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        phone={formData.phone}
      />
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, signOut, loading: authLoading } = useAuth();
  const [data, setData] = useState({ profile: null, orders: [], addresses: [], stats: null });
  const [loading, setLoading] = useState(true);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('GATEWAY');
  }, [switchMode]);

  const fetchProfileData = async () => {
    if (!authUser) {
      console.log('[Profile] No authUser, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      console.log('[Profile] Fetching dashboard for:', authUser.id);
      const res = await api.getProfileDashboard();

      if (res) {
        console.log('[Profile] Sync successful. Addresses:', res.addresses?.length);
        setData(res);
      }
    } catch (error) {
      console.error('[Profile] Sync error:', error);
      // Only toast on serious network errors, not minor data mismatches
      if (error.message?.includes('NetworkError') || error.message?.includes('500')) {
        toast.error('Sync failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [authUser]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleAddPet = async (type) => {
    try {
      // Optimistic update
      const currentPets = data.profile?.pet_types || [];
      if (currentPets.includes(type)) {
        toast.info(`You already have a ${type} added!`);
        return;
      }

      const newPets = [...currentPets, type];
      setData(prev => ({
        ...prev,
        profile: { ...prev.profile, pet_types: newPets }
      }));

      // In a real app, we'd call the backend here
      // await api.put('/api/profile', {petTypes: newPets });

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added to your family!`);
    } catch (err) {
      toast.error('Failed to add pet');
    }
  };

  const handleDeletePet = async (type) => {
    try {
      const currentPets = data.profile?.pet_types || [];
      const newPets = currentPets.filter(p => p !== type);

      setData(prev => ({
        ...prev,
        profile: { ...prev.profile, pet_types: newPets }
      }));

      // Backend call placeholder
      // await api.put('/api/profile', {petTypes: newPets });

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} removed.`);
    } catch (err) {
      toast.error('Failed to remove pet');
    }
  };

  if (authLoading) return <div className="min-h-screen bg-furco-cream flex items-center justify-center">Loading...</div>;
  if (!authUser && !authLoading) return <div className="min-h-screen bg-furco-cream flex items-center justify-center font-peace-sans">Please login to view profile.</div>;

  return (
    <div className="min-h-screen pt-12 pb-20 relative overflow-hidden bg-furco-cream">
      {/* Repeating Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 3c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-16 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z' fill='%23000'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12">
        <ProfileSidebar
          user={data.profile || authUser}
          petTypes={data.profile?.pet_types || []}
          onLogout={handleLogout}
          onAddPet={() => setShowAddPetModal(true)}
          onDeletePet={handleDeletePet}
        />

        <main className="flex-1 min-w-0">
          <Routes>
            <Route index element={<Orders orders={data.orders} loading={loading} />} />
            <Route path="orders" element={<Orders orders={data.orders} loading={loading} />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="addresses" element={
              <Addresses
                addresses={data.addresses}
                loading={loading}
                setAddresses={(updater) => setData(prev => ({
                  ...prev,
                  addresses: typeof updater === 'function' ? updater(prev.addresses) : updater
                }))}
                onRefresh={fetchProfileData}
              />
            } />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="settings" element={<AccountSettings user={data.profile || authUser} />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <h2 className="text-3xl font-peace-sans text-black mb-4">Coming Soon</h2>
                <p className="text-black/40 font-medium">This section is currently under refinement.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>

      <AddPetModal
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onAdd={handleAddPet}
      />
    </div>
  );
};

export default Profile;