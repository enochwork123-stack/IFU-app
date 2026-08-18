import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { pullAndMergeAnswersFromSupabase } from '../utils/answerSync';

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
      // If the user is an admin by email but their profile in DB is member, promote them
      const isSystemAdmin = currentUser.email && ADMIN_EMAILS.includes(currentUser.email);
      if (isSystemAdmin && p.role !== 'admin') {
        console.log('Promoting admin user to admin role in database...');
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', currentUser.id)
            .select()
            .single();
          if (!error && data) {
            p = data as Profile;
          } else if (error) {
            console.error('Failed to promote user to admin in DB:', error);
          }
        } catch (err) {
          console.error('Unexpected error promoting user to admin in DB:', err);
        }
      }
    }
    return p;
  };

  const loadSession = async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured) {
        const savedMock = window.localStorage.getItem('ifu:mock_auth_user');
        if (savedMock) {
          try {
            const parsed = JSON.parse(savedMock);
            setUser(parsed);
            setProfile({
              id: parsed.id,
              display_name: parsed.user_metadata?.full_name || '同行中的門徒 (Demo)',
              avatar_url: null,
              role: 'admin',
              language: 'ZH',
              created_at: parsed.created_at || new Date().toISOString(),
            });
          } catch {}
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const p = await getOrInitializeProfile(session.user);
        setProfile(p);
        // Silently pull and decrypt any remote answers
        pullAndMergeAnswersFromSupabase(session.user.id).catch((err) =>
          console.warn('Background answer sync error:', err)
        );
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
    if (user && isSupabaseConfigured) {
      const p = await getOrInitializeProfile(user);
      if (p) setProfile(p);
    }
  };

  useEffect(() => {
    loadSession();

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const p = await getOrInitializeProfile(session.user);
        setProfile(p);
        // Silently pull and decrypt any remote answers
        pullAndMergeAnswersFromSupabase(session.user.id).catch((err) =>
          console.warn('Background answer sync error:', err)
        );
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
    if (!isSupabaseConfigured) {
      const mockUser: User = {
        id: 'demo-user-12345',
        email: 'disciple@example.com',
        app_metadata: {},
        user_metadata: { full_name: '同行中的門徒' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;
      setUser(mockUser);
      setProfile({
        id: 'demo-user-12345',
        display_name: '同行中的門徒 (Demo)',
        avatar_url: null,
        role: 'admin',
        language: 'ZH',
        created_at: new Date().toISOString(),
      });
      window.localStorage.setItem('ifu:mock_auth_user', JSON.stringify(mockUser));
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      window.localStorage.removeItem('ifu:mock_auth_user');
      setUser(null);
      setProfile(null);
      return;
    }

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
