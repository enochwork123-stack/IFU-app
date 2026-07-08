import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const SYSTEM_ADMIN_EMAILS = ['enochwork123@gmail.com', 'lawfelix2002@gmail.com'];

export interface AuthProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  email: string | null;
  role: 'member' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isSystemAdminEmail(email?: string | null): boolean {
  return Boolean(email && SYSTEM_ADMIN_EMAILS.includes(email.toLowerCase()));
}

function fallbackProfile(user: User, role: 'member' | 'admin' = 'member') {
  return {
    id: user.id,
    displayName:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      '同行中的門徒',
    avatarUrl:
      user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    email: user.email ?? null,
    role: isSystemAdminEmail(user.email) ? 'admin' : role,
  } satisfies AuthProfile;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (currentUser: User): Promise<AuthProfile> => {
    const fallback = fallbackProfile(currentUser);

    if (!supabase) {
      return fallback;
    }

    const defaultRole = isSystemAdminEmail(currentUser.email)
      ? 'admin'
      : 'member';

    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, email, role')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (existing) {
        const role =
          existing.role === 'admin' || isSystemAdminEmail(currentUser.email)
            ? 'admin'
            : 'member';

        if (role === 'admin' && existing.role !== 'admin') {
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', currentUser.id);
        }

        return {
          id: currentUser.id,
          displayName: existing.display_name || fallback.displayName,
          avatarUrl: existing.avatar_url || fallback.avatarUrl,
          email: existing.email || fallback.email,
          role,
        };
      }

      const { data: created } = await supabase
        .from('profiles')
        .insert({
          id: currentUser.id,
          display_name: fallback.displayName,
          avatar_url: fallback.avatarUrl,
          email: currentUser.email,
          role: defaultRole,
        })
        .select('id, display_name, avatar_url, email, role')
        .single();

      if (created) {
        return {
          id: currentUser.id,
          displayName: created.display_name || fallback.displayName,
          avatarUrl: created.avatar_url || fallback.avatarUrl,
          email: created.email || fallback.email,
          role:
            created.role === 'admin' || isSystemAdminEmail(currentUser.email)
              ? 'admin'
              : 'member',
        };
      }
    } catch (error) {
      console.error('Error loading auth profile:', error);
    }

    return fallbackProfile(currentUser, defaultRole);
  };

  const applySessionUser = async (nextUser: User | null) => {
    setUser(nextUser);
    setProfile(nextUser ? await loadProfile(nextUser) : null);
  };

  const refreshProfile = async () => {
    if (user) {
      setProfile(await loadProfile(user));
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted) {
        await applySessionUser(session?.user ?? null);
        setLoading(false);
      }
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await applySessionUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error('Google 登入尚未設定 Supabase 環境變數。');
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    if (!supabase) {
      setUser(null);
      setProfile(null);
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setProfile(null);
  };

  const isAdmin = Boolean(
    profile?.role === 'admin' || isSystemAdminEmail(user?.email),
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        isConfigured: isSupabaseConfigured,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
