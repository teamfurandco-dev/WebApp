import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';

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
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" className="ml-auto">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const Orders = ({ orders }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Order History</h2>
    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      orders.map((order) => (
        <Card key={order.id}>
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
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-secondary/20 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{item.price}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
      {addresses.map((addr) => (
        <Card key={addr.id}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {addr.type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {addr.street}<br />
              {addr.city}, {addr.state} - {addr.zip}
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const Profile = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, ordersData] = await Promise.all([
          api.getUserProfile(),
          api.getOrders()
        ]);
        setUser(userData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="container py-12">Loading Profile...</div>;
  if (!user) return <div className="container py-12">Please login to view profile.</div>;

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-2">
          <SidebarLink to="/account" icon={User} label="Profile" active={location.pathname === '/account'} />
          <SidebarLink to="/account/orders" icon={Package} label="Orders" active={location.pathname === '/account/orders'} />
          <SidebarLink to="/account/addresses" icon={MapPin} label="Addresses" active={location.pathname === '/account/addresses'} />
          <SidebarLink to="/account/wishlist" icon={Heart} label="Wishlist" active={location.pathname === '/account/wishlist'} />
          <Separator className="my-2" />
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </aside>

        {/* Content */}
        <div className="md:col-span-3">
          <Routes>
            <Route index element={<ProfileDashboard user={user} />} />
            <Route path="orders" element={<Orders orders={orders} />} />
            <Route path="addresses" element={<Addresses addresses={user.addresses} />} />
            <Route path="wishlist" element={<div className="text-center py-12">Wishlist is empty</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
