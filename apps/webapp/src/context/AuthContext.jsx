import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, logActivity } from '@/lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user with backend database
  const syncUserWithBackend = async (session) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        syncUserWithBackend(session);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user && _event === 'SIGNED_IN') {
        await syncUserWithBackend(session);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (result.data?.user) {
      await logActivity(result.data.user.id, 'signup', 'user', result.data.user.id);
    }
    
    return result;
  };

  const signIn = async (email, password) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (result.data?.user) {
      await logActivity(result.data.user.id, 'login', 'session');
    }

    return result;
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/WebApp/`, // Adjust based on your deployment
      },
    });
  };

  const signOut = async () => {
    if (user) {
      await logActivity(user.id, 'logout', 'session');
    }
    return await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
