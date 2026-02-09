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
    <div className="min-h-screen bg-[#FDFBF7] relative flex items-center justify-center pt-24 pb-32 md:py-12 px-4 overflow-hidden">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8zm-10-10c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8zm20 0c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8z' fill='%231F1F1F' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden border border-black/10 p-8 md:p-14 relative">

          {/* Logo & Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
              <img src={logoSvg} alt="Fur & Co" className="h-10 mx-auto" />
            </Link>
            <h1 className="text-3xl font-peace-sans text-black mb-2">Welcome Back</h1>
          </div>

          <div className="space-y-8">
            {/* Google Login Button - Standard Branded Style */}
            <button
              onClick={handleGoogleLogin}
              className="w-full h-14 bg-white border border-gray-300 rounded-2xl flex items-center justify-center gap-3 px-4 hover:bg-gray-50 hover:shadow-md transition-all duration-300 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-black/70 font-bold text-sm">Continue with Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/[0.06]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                <span className="bg-white px-6 text-black/20">
                  Or use your email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-white border border-black/10 rounded-xl focus:ring-furco-yellow focus:border-furco-yellow text-black font-semibold placeholder:text-black/20"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">Secret Password</Label>
                  <Link to="/forgot-password" text-xs className="text-[10px] font-black uppercase tracking-widest text-furco-yellow hover:text-black transition-colors">
                    Reset?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-white border border-black/10 rounded-xl focus:ring-furco-yellow focus:border-furco-yellow text-black font-semibold placeholder:text-black/20"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-black text-white hover:bg-furco-yellow hover:text-black rounded-xl text-lg font-bold transition-all duration-300 flex items-center justify-center gap-4 group"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-6 text-center">
              <p className="text-sm font-medium text-black/40">
                New to Fur & Co?{' '}
                <Link to="/signup" className="text-furco-yellow font-bold hover:text-black transition-all underline underline-offset-4 decoration-2">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decorative */}
        <div className="mt-12 flex justify-center gap-6 opacity-5">
          <div className="w-1 h-1 rounded-full bg-black" />
          <div className="w-1 h-1 rounded-full bg-black" />
          <div className="w-1 h-1 rounded-full bg-black" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
