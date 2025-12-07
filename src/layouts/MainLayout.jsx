import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Toaster } from '@/components/ui/sonner';

const MainLayout = () => {
  return (
    <div className="w-full flex min-h-screen flex-col bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default MainLayout;
