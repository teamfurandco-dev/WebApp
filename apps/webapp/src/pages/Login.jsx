import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Chrome, Facebook, Instagram, Linkedin, ArrowRight, PawPrint } from 'lucide-react';
import logoSvg from '@/assets/logo.svg';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const { switchMode } = useTheme();

  useEffect(() => {
    switchMode('GATEWAY');
  }, [switchMode]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast.success("Welcome back!");
      navigate('/account');
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FDFBF7] relative flex items-center justify-center pt-24 pb-32 md:py-12 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8zm-10-10c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8zm20 0c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8z' fill='%231F1F1F' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-black/5 p-8 md:p-12">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
              <img src={logoSvg} alt="Fur & Co" className="h-8 mx-auto" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-peace-sans font-bold text-black mb-3">Welcome Back</h1>
            <p className="text-black/50 text-sm font-medium tracking-wide">Continue your premium pet care journey</p>
          </div>

          <div className="space-y-8">
            {/* Social Logins - Adaptive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="h-12 md:h-14 rounded-2xl border-black/5 hover:border-furco-yellow hover:bg-furco-yellow/5 transition-all duration-300"
              >
                <Chrome className="w-5 h-5 text-furco-yellow" />
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("Instagram login is coming soon to our premium club.")}
                className="h-12 md:h-14 rounded-2xl border-black/5 hover:border-black/10 transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-pink-600" />
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("LinkedIn login is coming soon to our premium club.")}
                className="h-12 md:h-14 rounded-2xl border-black/5 hover:border-black/10 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("Facebook login is coming soon to our premium club.")}
                className="h-12 md:h-14 rounded-2xl border-black/5 hover:border-black/10 transition-all duration-300"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/5" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
                <span className="bg-white px-4 text-black/30">
                  Authentication via Email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-[#FDFBF7] border-black/5 rounded-2xl focus:ring-furco-yellow focus:border-furco-yellow text-black font-medium"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-black/40">Password</Label>
                  <Link to="/forgot-password" title="Recover Password" className="text-xs font-bold text-furco-yellow hover:text-black transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-[#FDFBF7] border-black/5 rounded-2xl focus:ring-furco-yellow focus:border-furco-yellow text-black font-medium"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-black text-white hover:bg-furco-yellow hover:text-black rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                disabled={loading}
              >
                {loading ? 'Entering...' : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-6 text-center">
              <p className="text-sm font-medium text-black/40">
                Don't have an account?{' '}
                <Link to="/signup" className="text-furco-yellow font-bold hover:text-black transition-all">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decorative */}
        <div className="mt-8 flex justify-center opacity-10">
          <PawPrint className="w-12 h-12 text-black" />
        </div>
      </motion.div>
    </div >
  );
};

export default Login;
