import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Mail, Lock, User, Github } from 'lucide-react';
import { toast } from 'sonner';

const GoogleIcon = () => (
  <svg className="w-3.5 h-3.5 mr-2 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signIn, signUp, signInWithOAuth, user } = useAuth();
  const navigate = useNavigate();

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };


  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message || "Error signing in");
    } else {
      toast.success("Welcome back! Signed in successfully.");
      navigate('/');
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast.error(error.message || "Error creating account");
    } else {
      toast.success("Account created! Please check your email to verify your account.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans flex items-center justify-center p-6 overflow-hidden">
      <CursorGlow />
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-sm">
        
        {/* Header & Back button */}
        <div className="text-center mb-8 relative">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute -top-16 left-0 border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2 transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2.5 mb-3 mt-4">
            <div className="w-8 h-8 bg-white/[0.02] border border-white/[0.08] rounded-lg flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight font-display">PathGenie</span>
          </div>
          <p className="text-slate-500 text-xs font-mono">Accelerate your skill acquisition with structured AI paths</p>
        </div>

        {/* Auth Tabs Container */}
        <Card className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] shadow-2xl rounded-xl overflow-hidden p-1.5">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/[0.01] border border-white/[0.06] rounded-lg p-0.5">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-white/[0.04] data-[state=active]:text-white text-slate-500 font-semibold text-xs rounded-md py-1.5 focus:outline-none"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="data-[state=active]:bg-white/[0.04] data-[state=active]:text-white text-slate-500 font-semibold text-xs rounded-md py-1.5 focus:outline-none"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-1">
              <CardHeader className="text-center pb-4 pt-3">
                <CardTitle className="text-white text-base font-bold font-display">Welcome back</CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Sign in to continue your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-3 pb-3">
                <form onSubmit={handleSignIn} className="space-y-3.5">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="email" className="text-slate-400 text-xs font-mono font-semibold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-600" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-4.5 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="password" className="text-slate-400 text-xs font-mono font-semibold">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-600" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-4.5 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white hover:bg-slate-200 text-black font-semibold text-xs py-2 rounded-lg transition-all hover:scale-[1.01] mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup" className="mt-1">
              <CardHeader className="text-center pb-4 pt-3">
                <CardTitle className="text-white text-base font-bold font-display">Create your account</CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Start your structured 4-week learning path today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-3 pb-3">
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="fullName" className="text-slate-400 text-xs font-mono font-semibold">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-600" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Alex Rivera"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-9 bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-4.5 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="signup-email" className="text-slate-400 text-xs font-mono font-semibold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-600" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-4.5 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="signup-password" className="text-slate-400 text-xs font-mono font-semibold">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-600" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-4.5 rounded-lg"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white hover:bg-slate-200 text-black font-semibold text-xs py-2 rounded-lg transition-all hover:scale-[1.01] mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                  <p className="text-[10px] text-slate-500 text-center leading-relaxed mt-4">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>

          {/* OAuth Separator */}
          <div className="relative my-4 px-3">
            <div className="absolute inset-0 flex items-center px-3">
              <span className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-[#0B0B0F] px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 px-3 pb-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth('google')}
              className="bg-[#0B0B0F]/80 hover:bg-[#121217] border border-white/[0.08] text-slate-300 font-semibold text-xs py-2 rounded-lg transition-all flex items-center justify-center hover:scale-[1.01]"
              disabled={isLoading}
            >
              <GoogleIcon />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth('github')}
              className="bg-[#0B0B0F]/80 hover:bg-[#121217] border border-white/[0.08] text-slate-300 font-semibold text-xs py-2 rounded-lg transition-all flex items-center justify-center hover:scale-[1.01]"
              disabled={isLoading}
            >
              <Github className="w-3.5 h-3.5 mr-2 text-slate-400" />
              GitHub
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
