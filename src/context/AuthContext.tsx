import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'member' | 'admin';
  language: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['enochwork123@gmail.com', 'lawfelix2002@gmail.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const createProfileOnTheFly = async (currentUser: User): Promise<Profile | null> => {
    try {
      const isSystemAdmin = currentUser.email && ADMIN_EMAILS.includes(currentUser.email);
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: currentUser.id,
          display_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'New disciple',
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null,
          email: currentUser.email,
          role: isSystemAdmin ? 'admin' : 'member',
        })
        .select()
        .single();
      
      if (!error && data) {
        return data as Profile;
      }
      if (error) {
        console.error('Error creating profile on the fly:', error);
      }
    } catch (err) {
      console.error('Unexpected error creating profile on the fly:', err);
    }
    return null;
  };

  const fetchProfileWithRetry = async (userId: string, retries = 3, delay = 500): Promise<Profile | null> => {
    for (let i = 0; i < retries; i++) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (!error && data) {
          return data as Profile;
        }
      } catch (err) {
        console.error('Error in fetchProfile:', err);
      }
      
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return null;
  };

  const getOrInitializeProfile = async (currentUser: User): Promise<Profile | null> => {
    let p = await fetchProfileWithRetry(currentUser.id);
    if (!p) {
      console.log('Profile missing. Attempting to create on the fly...');
      p = await createProfileOnTheFly(currentUser);
    } else {
      const isSystemAdmin = currentUser.email && ADMIN_EMAILS.includes(currentUser.email);
      const googleAvatar = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null;
      const googleName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || null;
      
      const needsSync = (googleAvatar && p.avatar_url !== googleAvatar) || (googleName && p.display_name !== googleName);
      
      if (needsSync || (isSystemAdmin && p.role !== 'admin')) {
        console.log('Syncing user profile with latest Google metadata...');
        const updates: Record<string, any> = {};
        if (isSystemAdmin && p.role !== 'admin') {
          updates.role = 'admin';
        }
        if (googleAvatar && p.avatar_url !== googleAvatar) {
          updates.avatar_url = googleAvatar;
        }
        if (googleName && p.display_name !== googleName) {
          updates.display_name = googleName;
        }
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', currentUser.id)
            .select()
            .single();
          if (!error && data) {
            p = data as Profile;
          } else if (error) {
            console.error('Failed to sync profile in DB:', error);
          }
        } catch (err) {
          console.error('Unexpected error syncing profile in DB:', err);
        }
      }
    }
    return p;
  };

  const loadSession = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const p = await getOrInitializeProfile(session.user);
        setProfile(p);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error('Error loading session:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await getOrInitializeProfile(user);
      if (p) setProfile(p);
    }
  };

  useEffect(() => {
    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const p = await getOrInitializeProfile(session.user);
        setProfile(p);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin' || !!(user?.email && ADMIN_EMAILS.includes(user.email));

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
