import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, Package, MapPin, Heart, LogOut, Mail, Pencil, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import ReferralDashboard from '@/components/profile/ReferralDashboard';
import OrderDetail from '@/pages/OrderDetail';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to}>
    <Button variant={active ? "secondary" : "ghost"} className="w-full justify-start gap-2">
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  </Link>
);

const ProfileDashboard = ({ user }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#FDFBF7] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(251,191,36,0.15)] border border-stone-100">
      {/* Linen Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23A8A29E' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        <div className="mb-12 border-b border-stone-200/60 pb-8">
          <h2 className="text-4xl font-serif font-bold text-[#1F1F1F] mb-3 tracking-tight">Profile Information</h2>
          <p className="text-[#6B7280] font-sans text-lg tracking-wide font-light">Update your account details</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Avatar with Golden Ring */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-200 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative h-40 w-40 rounded-full p-1.5 bg-gradient-to-br from-[#D4AF37] via-[#FBBF24] to-[#D4AF37] shadow-2xl">
              <Avatar className="h-full w-full border-[6px] border-white bg-white">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback className="bg-stone-50 text-4xl font-serif text-stone-400">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('') : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6 w-full">
            <div>
              <h3 className="text-4xl font-serif font-bold text-[#1F1F1F] mb-3">{user.name}</h3>
              <div className="flex items-center justify-center md:justify-start gap-3 text-[#6B7280] font-medium text-lg">
                <div className="p-2 bg-white rounded-full shadow-sm border border-stone-100 text-[#D4AF37]">
                   <Mail className="w-5 h-5" />
                </div>
                <span className="tracking-wide font-light">{user.email}</span>
              </div>
            </div>
            
            <div className="pt-4">
               <Button 
                className="relative overflow-hidden rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-white px-10 py-7 text-lg font-bold shadow-[0_10px_20px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_30px_rgba(251,191,36,0.4)] transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 blur-sm" />
                <span className="relative flex items-center gap-3">
                  Edit Profile
                  <Pencil className="w-5 h-5 stroke-[2.5]" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Orders = ({ orders }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Order History</h2>
    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      orders.map((order) => (
        <Link to={`/account/orders/${order.id}`} key={order.id}>
          <Card className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-furco-yellow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Order #{order.id}</CardTitle>
                <CardDescription>{order.date}</CardDescription>
              </div>
              <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className={order.status === 'Delivered' ? 'bg-green-600 hover:bg-green-700' : ''}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                {order.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-secondary/20 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && <p className="text-xs text-muted-foreground">+{order.items.length - 2} more items</p>}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{order.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))
    )}
  </div>
);

const Addresses = ({ addresses }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Saved Addresses</h2>
      <Button>Add New</Button>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {addresses && addresses.length > 0 ? (
        addresses.map((addr) => (
          <Card key={addr.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {addr.label || addr.type || 'Address'}
                {addr.is_default && <Badge variant="secondary" className="ml-2">Default</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {addr.full_name && <>{addr.full_name}<br /></>}
                {addr.line1}<br />
                {addr.line2 && <>{addr.line2}<br /></>}
                {addr.city}, {addr.state} - {addr.postal_code}
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No addresses saved.</p>
      )}
    </div>
  </div>
);

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, signOut, loading } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authUser) return;

      // Fetch profile from Supabase
      const profile = await api.getUserProfile(authUser.id);
      
      setUser({
        name: profile?.full_name || authUser.user_metadata?.full_name || 'User',
        email: authUser.email,
        avatar: profile?.avatar_url || authUser.user_metadata?.avatar_url,
        phone: profile?.phone
      });

      // Fetch orders and addresses
      const [ordersData, addressesData] = await Promise.all([
        api.getOrders(authUser.id),
        api.getAddresses(authUser.id)
      ]);
      
      setOrders(ordersData || []);
      setAddresses(addressesData || []);
    };

    fetchProfileData();
  }, [authUser]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) return <div className="container py-12">Loading Profile...</div>;
  if (!authUser && !loading) return <div className="container py-12">Please login to view profile.</div>;
  if (!user && authUser) return <div className="container py-12">Loading Profile Data...</div>;

  return (
    <div className="container px-4 md:px-6 pt-32 pb-12">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-2">
          <SidebarLink to="/account" icon={User} label="Profile" active={location.pathname === '/account'} />
          <SidebarLink to="/account/orders" icon={Package} label="Orders" active={location.pathname === '/account/orders'} />
          <SidebarLink to="/account/addresses" icon={MapPin} label="Addresses" active={location.pathname === '/account/addresses'} />
          <SidebarLink to="/account/addresses" icon={MapPin} label="Addresses" active={location.pathname === '/account/addresses'} />
          <SidebarLink to="/account/wishlist" icon={Heart} label="Wishlist" active={location.pathname === '/account/wishlist'} />
          <SidebarLink to="/account/referrals" icon={Users} label="Referrals" active={location.pathname === '/account/referrals'} />
          <Separator className="my-2" />
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </aside>

        {/* Content */}
        <div className="md:col-span-3">
          <Routes>
            <Route index element={<ProfileDashboard user={user} />} />
            <Route path="orders" element={<Orders orders={orders} />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="addresses" element={<Addresses addresses={addresses} />} />
            <Route path="wishlist" element={<div className="text-center py-12">Wishlist is empty</div>} />
            <Route path="referrals" element={<ReferralDashboard user={authUser} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
