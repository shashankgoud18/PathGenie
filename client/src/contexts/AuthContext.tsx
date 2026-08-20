import React, { createContext, useContext, useEffect, useState } from 'react';

const EXPRESS_SERVER_URL = import.meta.env.VITE_EXPRESS_SERVER_URL || 'http://localhost:5000';

const TOKEN_STORAGE_KEY = 'auth_token';

const getCookieToken = () => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${TOKEN_STORAGE_KEY}=`));

  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const getStoredToken = () => sessionStorage.getItem(TOKEN_STORAGE_KEY) || getCookieToken();
const setStoredToken = (token: string | null) => {
  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    document.cookie = `${TOKEN_STORAGE_KEY}=${encodeURIComponent(token)}; path=/; samesite=lax`;
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  token: string | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'github') => void;
  signOut: () => Promise<void>;
  updateProfile: (data: { fullName?: string; avatarUrl?: string }) => Promise<{ error: any }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function formatUser(rawUser: any): User {
  return {
    ...rawUser,
    user_metadata: {
      full_name: rawUser.full_name,
      avatar_url: rawUser.avatar_url,
    },
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async (jwtToken: string) => {
    try {
      const res = await fetch(`${EXPRESS_SERVER_URL}/api/auth/me`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const formatted = formatUser(data.user);
        setUser(formatted);
        setSession({ access_token: jwtToken, user: formatted });
      } else {
        setStoredToken(null);
        setToken(null);
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      console.error('Error verifying auth token:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = getStoredToken();
    if (savedToken) {
      setStoredToken(savedToken);
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // ── Email / Password ────────────────────────────────────────────────────

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const res = await fetch(`${EXPRESS_SERVER_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();
      if (!res.ok) return { error: { message: data.error || 'Failed to sign up' } };

      setStoredToken(data.token);
      setToken(data.token);
      const formatted = formatUser(data.user);
      setUser(formatted);
      setSession({ access_token: data.token, user: formatted });
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'Registration request failed' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${EXPRESS_SERVER_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { error: { message: data.error || 'Invalid credentials' } };

      setStoredToken(data.token);
      setToken(data.token);
      const formatted = formatUser(data.user);
      setUser(formatted);
      setSession({ access_token: data.token, user: formatted });
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'Login request failed' } };
    }
  };

  // ── OAuth ───────────────────────────────────────────────────────────────
  // Redirects the browser to the server OAuth endpoint. The server handles
  // the provider exchange and redirects back to /auth/callback after setting
  // a secure auth cookie.

  const signInWithOAuth = (provider: 'google' | 'github') => {
    window.location.href = `${EXPRESS_SERVER_URL}/api/auth/${provider}`;
  };

  // ── Sign out ────────────────────────────────────────────────────────────

  const signOut = async () => {
    setStoredToken(null);
    localStorage.removeItem('subscription_status');
    setToken(null);
    setUser(null);
    setSession(null);
  };

  // ── Profile management ──────────────────────────────────────────────────

  const updateProfile = async (data: { fullName?: string; avatarUrl?: string }) => {
    try {
      const currentToken = getStoredToken();
      if (!currentToken) return { error: { message: 'Not authenticated' } };

      const res = await fetch(`${EXPRESS_SERVER_URL}/api/auth/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ fullName: data.fullName, avatarUrl: data.avatarUrl }),
      });
      const resData = await res.json();
      if (!res.ok) return { error: { message: resData.error || 'Failed to update profile' } };

      const formatted = formatUser(resData.user);
      setUser(formatted);
      setSession((prev) =>
        prev ? { ...prev, user: formatted } : { access_token: currentToken, user: formatted }
      );
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'Update failed' } };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const currentToken = getStoredToken();
      if (!currentToken) return { error: { message: 'Not authenticated' } };

      const res = await fetch(`${EXPRESS_SERVER_URL}/api/auth/change-password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const resData = await res.json();
      if (!res.ok) return { error: { message: resData.error || 'Failed to change password' } };
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'Password change failed' } };
    }
  };

  const refreshUser = async () => {
    const currentToken = getStoredToken();
    if (currentToken) {
      setStoredToken(currentToken);
      setToken(currentToken);
      await fetchCurrentUser(currentToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token,
        loading,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
        updateProfile,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
