import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UnlimitedFurProvider } from '@/context/UnlimitedFurContext';
import Home from '@/pages/Home';
import ProductList from '@/pages/ProductList';
import ProductDetailOptimized from '@/pages/ProductDetailOptimized';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Profile from '@/pages/Profile';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Unlimited from '@/pages/Unlimited';
import Niche from '@/pages/Niche';

// Unlimited Fur pages
import BudgetSelection from '@/pages/unlimited-fur/BudgetSelection';
import PetProfileSelection from '@/pages/unlimited-fur/PetProfileSelection';
import CategorySelection from '@/pages/unlimited-fur/CategorySelection';
import Shopping from '@/pages/unlimited-fur/Shopping';
import UnlimitedCheckout from '@/pages/unlimited-fur/Checkout';
import MyMonthlyPlan from '@/pages/unlimited-fur/MyMonthlyPlan';
import MonthlySuccess from '@/pages/unlimited-fur/MonthlySuccess';
import BundleSuccess from '@/pages/unlimited-fur/BundleSuccess';

// Mock context for unlimited fur (frontend-only)
import { MockUnlimitedFurProvider } from '@/context/MockUnlimitedFurContext';

// Placeholder pages
const NotFound = () => <div className="container py-10 text-center text-xl">404 - Page Not Found</div>;

function App() {
  return (
    <Router basename="/WebApp">
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="product/:id" element={<ProductDetailOptimized />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="account/*" element={<Profile />} />
                  <Route path="about" element={<About />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:id" element={<BlogPost />} />
                  <Route path="unlimited" element={<Unlimited />} />
                  <Route path="niche" element={<Niche />} />

                  {/* Unlimited Fur Routes */}
                  <Route path="unlimited-fur/*" element={
                    <UnlimitedFurProvider>
                      <Routes>
                        <Route path="monthly/budget" element={<BudgetSelection />} />
                        <Route path="monthly/pet-profile" element={<PetProfileSelection />} />
                        <Route path="monthly/categories" element={<CategorySelection />} />
                        <Route path="monthly/shopping" element={<Shopping />} />
                        <Route path="monthly/checkout" element={<UnlimitedCheckout />} />
                        <Route path="monthly/my-plan" element={<MyMonthlyPlan />} />
                        <Route path="monthly/success" element={<MonthlySuccess />} />


                        <Route path="bundle/budget" element={<BudgetSelection />} />
                        <Route path="bundle/pet-profile" element={<PetProfileSelection />} />
                        <Route path="bundle/categories" element={<CategorySelection />} />
                        <Route path="bundle/shopping" element={<Shopping />} />
                        <Route path="bundle/checkout" element={<UnlimitedCheckout />} />
                        <Route path="bundle/success" element={<BundleSuccess />} />
                      </Routes>
                    </UnlimitedFurProvider>
                  } />


                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </ThemeProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;