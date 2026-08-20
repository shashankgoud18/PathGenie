import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ArrowLeft, User, Lock, Camera, Crown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/layout/AnimatedBackground';
import CursorGlow from '@/components/layout/CursorGlow';
import { useSubscription } from '@/hooks/useSubscription';
import SEO from '@/components/layout/SEO';

const Profile = () => {
  const { user, updateProfile, changePassword, loading } = useAuth();
  const { isProUser, subscription } = useSubscription();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({
    fullName: user?.full_name || user?.user_metadata?.full_name || '',
    avatarUrl: user?.avatar_url || user?.user_metadata?.avatar_url || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getUserInitials = () => {
    const name = profileForm.fullName || user.email || '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const { error } = await updateProfile({
      fullName: profileForm.fullName,
      avatarUrl: profileForm.avatarUrl,
    });
    if (error) {
      toast.error(error.message || 'Failed to update profile');
    } else {
      toast.success('Profile updated successfully!');
    }
    setProfileLoading(false);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    const { error } = await changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );
    if (error) {
      toast.error(error.message || 'Failed to change password');
    } else {
      toast.success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
    setPasswordLoading(false);
  };

  const subExpiry = subscription?.subscription_end
    ? new Date(subscription.subscription_end).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <SEO
        title="Profile Settings - PathGenie"
        description="Manage your PathGenie account settings, profile details, and password."
        url="/profile"
        noIndex
      />
      <CursorGlow />
      <AnimatedBackground />
      <Navbar onAuthClick={() => navigate('/auth')} onScrollToSection={(s) => navigate(`/#${s}`)} />

      <div className="pt-28 pb-20 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <Button
            onClick={() => navigate('/roadmaps')}
            variant="ghost"
            size="sm"
            className="mb-8 border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to Workspace
          </Button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-16 w-16 ring-2 ring-purple-500/30">
              <AvatarImage src={profileForm.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xl font-bold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white font-display">
                {profileForm.fullName || 'Your Profile'}
              </h1>
              <p className="text-slate-400 text-xs font-mono mt-0.5">{user.email}</p>
              {isProUser && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-amber-400 font-mono">
                    Pro Member{subExpiry ? ` · renews ${subExpiry}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <section className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-6 sm:p-8 mb-6 backdrop-blur-xl shadow-2xl text-left">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2 font-display">
              <User className="w-4 h-4 text-purple-400" />
              Profile Details
            </h2>
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-mono font-semibold">Full Name</Label>
                <Input
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="Your full name"
                  className="bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:ring-1 focus:ring-purple-500/50 text-sm rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-mono font-semibold flex items-center gap-1.5">
                  <Camera className="w-3 h-3" />
                  Avatar URL
                </Label>
                <Input
                  value={profileForm.avatarUrl}
                  onChange={(e) => setProfileForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  className="bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:ring-1 focus:ring-purple-500/50 text-sm rounded-lg"
                />
                <p className="text-[10px] text-slate-500 font-mono">
                  Paste any public image URL. Changes reflect immediately in the navbar.
                </p>
              </div>
              <Button
                type="submit"
                disabled={profileLoading}
                className="bg-white hover:bg-slate-200 text-black font-semibold text-xs py-2 px-5 rounded-lg transition-all hover:scale-[1.01]"
              >
                {profileLoading ? 'Saving…' : 'Save Profile'}
              </Button>
            </form>
          </section>

          {/* Change Password */}
          <section className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-left">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2 font-display">
              <Lock className="w-4 h-4 text-purple-400" />
              Change Password
            </h2>
            <form onSubmit={handlePasswordSave} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-mono font-semibold">Current Password</Label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:ring-1 focus:ring-purple-500/50 text-sm rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-mono font-semibold">New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className="bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:ring-1 focus:ring-purple-500/50 text-sm rounded-lg"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-mono font-semibold">Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Repeat new password"
                  className="bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:ring-1 focus:ring-purple-500/50 text-sm rounded-lg"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                OAuth accounts (Google/GitHub) cannot set a password here — use your provider's security settings.
              </p>
              <Button
                type="submit"
                disabled={passwordLoading}
                className="bg-white hover:bg-slate-200 text-black font-semibold text-xs py-2 px-5 rounded-lg transition-all hover:scale-[1.01]"
              >
                {passwordLoading ? 'Updating…' : 'Update Password'}
              </Button>
            </form>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
