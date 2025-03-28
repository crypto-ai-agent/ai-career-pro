import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { upsertProfile } from '../services/database';
import { sendWelcomeEmail } from '../services/email';
import { useToast } from '../hooks/useToast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isVerified: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsVerified(session?.user?.email_confirmed_at != null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
      setLoading(false);
      setInitialized(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsVerified(session?.user?.email_confirmed_at != null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
      if (!initialized) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [initialized]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      setIsAdmin(profile?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;

    // Create initial profile
    if (user) {
      try {
        await upsertProfile({
          id: user.id,
          email: user.email!,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Send welcome email
        await sendWelcomeEmail(email, email.split('@')[0]);
        addToast('success', 'Welcome! Please check your email to verify your account.');
      } catch (err) {
        console.error('Error during signup:', err);
        addToast('error', 'Account created but some setup failed. Please contact support.');
      }
    }
  };

  const resendVerification = async () => {
    if (!user?.email) return;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    addToast('success', 'Verification email sent! Please check your inbox.');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isVerified,
      isAdmin,
      signIn,
      signUp,
      resendVerification,
      signOut,
      resetPassword,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}