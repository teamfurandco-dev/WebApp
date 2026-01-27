import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { User, Package, MapPin, Heart, LogOut, Mail, Pencil, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
// Phase 2: Referral system
// import ReferralDashboard from '@/components/profile/ReferralDashboard';
import OrderDetail from '@/pages/OrderDetail';
import { toast } from 'sonner';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to}>
    <Button variant={active ? "secondary" : "ghost"} className="w-full justify-start gap-3 h-10 text-sm">
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  </Link>
);

const MonthlyPlanCard = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const data = await api.get('/api/unlimited-fur/monthly-plan/active');
      setPlan(data);
    } catch (err) {
      console.error('No active plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!plan) return null;

  return (
    <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Monthly Essentials Plan</h3>
            <p className="text-sm text-muted-foreground">
              {plan.planStatus === 'active' ? 'Active' : plan.planStatus}
            </p>
          </div>
          <Badge className="bg-[#D4AF37] text-black">
            ₹{(plan.monthlyBudget / 100).toFixed(0)}/mo
          </Badge>
        </div>
        <Link to="/unlimited-fur/monthly/my-plan">
          <Button className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black">
            Manage Plan
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const ProfileDashboard = ({ user, stats, loading }) => (
  <div className="space-y-6">
    <MonthlyPlanCard />

    <Card className="p-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback className="text-lg font-semibold">
            {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-1">{user?.full_name || 'User'}</h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Mail className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>

          {stats && (
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <div className="font-semibold text-lg">{stats.totalOrders || 0}</div>
                <div className="text-muted-foreground">Orders</div>
              </div>
              {/* Phase 2: Wishlist stats
              <div>
                <div className="font-semibold text-lg">{stats.wishlistCount || 0}</div>
                <div className="text-muted-foreground">Wishlist Items</div>
              </div>
              */}
            </div>
          )}
        </div>

        <Button size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </Card>
  </div>
);

const Orders = ({ orders, loading }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Order History</h2>
    {loading ? (
      <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
    ) : orders.length === 0 ? (
      <Card className="p-8 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-semibold mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </Card>
    ) : (
      <div className="space-y-3">
        {orders.map((order) => (
          <Link to={`/account/orders/${order.id}`} key={order.id}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">Order #{order.order_number || order.id}</div>
                    <div className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Processing'}
                  </Badge>
                </div>

                {order.items?.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-muted rounded overflow-hidden">
                      <img
                        src={item.product?.images?.[0] || item.image}
                        alt={item.product?.name || item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product?.name || item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}

                {order.items?.length > 2 && (
                  <p className="text-xs text-muted-foreground mb-3">+{order.items.length - 2} more items</p>
                )}

                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-semibold">₹{(order.total_amount / 100).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )}
  </div>
);

const Addresses = ({ addresses, loading, onRefresh }) => {
  const handleSetDefault = async (addressId) => {
    try {
      await api.setDefaultAddress(addressId);
      toast.success('Default address updated');
      onRefresh();
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await api.deleteAddress(addressId);
      toast.success('Address deleted');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <Button size="sm">Add New Address</Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading addresses...</div>
      ) : addresses && addresses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{addr.label || addr.type || 'Address'}</span>
                    {addr.is_default && <Badge variant="secondary" className="text-xs">Default</Badge>}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-4">
                  {addr.full_name && <div className="font-medium text-foreground">{addr.full_name}</div>}
                  <div>{addr.line1}</div>
                  {addr.line2 && <div>{addr.line2}</div>}
                  <div>{addr.city}, {addr.state} - {addr.postal_code}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  {!addr.is_default && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(addr.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(addr.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-4">Add an address for faster checkout</p>
          <Button>Add Address</Button>
        </Card>
      )}
    </div>
  );
};

// Phase 2: Wishlist component (moved to dedicated page)
// const Wishlist = () => (
//   <Card className="p-8 text-center">
//     <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//     <h3 className="font-semibold mb-2">Your wishlist is empty</h3>
//     <p className="text-muted-foreground mb-4">Save items you love for later</p>
//     <Link to="/products">
//       <Button>Browse Products</Button>
//     </Link>
//   </Card>
// );

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, signOut, loading: authLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('GATEWAY');
  }, [switchMode]);

  const fetchProfileData = async () => {
    if (!authUser) return;

    try {
      setLoading(true);

      const [profileData, ordersData, addressesData, statsData] = await Promise.all([
        api.getUserProfile().catch(() => authUser),
        api.getOrders().catch(() => []),
        api.getAddresses().catch(() => []),
        api.getUserStats().catch(() => null)
      ]);

      setUser(profileData);
      setOrders(ordersData || []);
      setAddresses(addressesData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
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

  if (authLoading) return <div className="container py-12 text-center">Loading...</div>;
  if (!authUser && !authLoading) return <div className="container py-12 text-center">Please login to view profile.</div>;

  return (
    <div className="container px-4 md:px-6 pt-24 pb-12">
      <div className="grid md:grid-cols-5 gap-6">
        <aside className="md:col-span-1">
          <Card className="p-4">
            <nav className="space-y-1">
              <SidebarLink to="/account" icon={User} label="Profile" active={location.pathname === '/account'} />
              <SidebarLink to="/account/orders" icon={Package} label="Orders" active={location.pathname.startsWith('/account/orders')} />
              <SidebarLink to="/account/addresses" icon={MapPin} label="Addresses" active={location.pathname === '/account/addresses'} />
              {/* Wishlist moved to dedicated page - remove from account sidebar */}
              {/* <SidebarLink to="/account/wishlist" icon={Heart} label="Wishlist" active={location.pathname === '/account/wishlist'} /> */}
              {/* Phase 2: Referral system */}
              {/* <SidebarLink to="/account/referrals" icon={Users} label="Referrals" active={location.pathname === '/account/referrals'} /> */}
              <Separator className="my-2" />
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </Card>
        </aside>

        <div className="md:col-span-4">
          <Routes>
            <Route index element={<ProfileDashboard user={user} stats={stats} loading={loading} />} />
            <Route path="orders" element={<Orders orders={orders} loading={loading} />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="addresses" element={<Addresses addresses={addresses} loading={loading} onRefresh={fetchProfileData} />} />
            {/* Wishlist moved to dedicated page */}
            {/* <Route path="wishlist" element={<Wishlist />} /> */}
            {/* Phase 2: Referral system */}
            {/* <Route path="referrals" element={<ReferralDashboard user={authUser} />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;