import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Orders from './pages/Orders';
import Subscriptions from './pages/Subscriptions';
import Users from './pages/Users';

function AppContent() {
  const { user, isAdmin, loading } = useAuth();

  // Handle OAuth redirect
  useEffect(() => {
    if (window.location.hash) {
      // Clear the hash after Supabase processes it
      setTimeout(() => {
        window.history.replaceState(null, null, window.location.pathname);
      }, 2000);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
