import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EXPRESS_SERVER_URL = import.meta.env.VITE_EXPRESS_SERVER_URL || 'http://localhost:5000';

/**
 * Landing page for OAuth redirect after the server sets the secure auth cookie.
 * It validates the session, then redirects home.
 */
const AuthCallback = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false); // prevent double execution in React StrictMode

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const error = new URLSearchParams(window.location.search).get('error');

    if (error) {
      window.history.replaceState({}, '', window.location.pathname);
      toast.error('OAuth sign-in failed. Please try again.');
      navigate('/auth', { replace: true });
      return;
    }

    window.history.replaceState({}, '', window.location.pathname);

    fetch(`${EXPRESS_SERVER_URL}/api/auth/me`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const cookieToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('auth_token='));

          if (cookieToken) {
            const token = decodeURIComponent(cookieToken.split('=')[1]);
            sessionStorage.setItem('auth_token', token);
          }

          refreshUser().finally(() => {
            toast.success(`Welcome, ${data.user.full_name || data.user.email}!`);
            navigate('/', { replace: true });
          });
        } else {
          toast.error('Sign-in failed. Please try again.');
          navigate('/auth', { replace: true });
        }
      })
      .catch(() => {
        toast.error('Sign-in failed. Please try again.');
        navigate('/auth', { replace: true });
      });
  }, [navigate, refreshUser]);

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-mono">Completing sign-in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;
