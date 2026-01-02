import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import MobileBottomNav from '@/components/common/MobileBottomNav';
import { Toaster } from '@/components/ui/sonner';

const MainLayout = () => {
  return (
    <div className="w-full flex min-h-screen flex-col bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-1 w-full pt-22 md:pt-24 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <Toaster />
    </div>
  );
};

export default MainLayout;
