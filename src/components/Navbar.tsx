import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  User,
  LogOut,
  Map,
  CreditCard,
  Crown,
  Menu,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  onAuthClick: () => void;
  onScrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick, onScrollToSection }) => {
  const { user, signOut, loading } = useAuth();
  const { isProUser } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const handlePricingClick = () => {
    navigate("/pricing");
  };

  const handleCommunityClick = () => {
    if (isProUser) {
      navigate("/community");
    } else {
      navigate("/pricing");
    }
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((name: string) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    return (
      user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/60 backdrop-blur-xl border-b border-white/[0.04] py-3' 
        : 'bg-transparent border-b border-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and User Status */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center gap-2.5 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 group">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/[0.08] shadow-md group-hover:border-purple-500/30 transition-all duration-300 bg-white/[0.02] flex items-center justify-center">
                  <img
                    src="/favicon.png"
                    alt="PathGenie Logo"
                    className="w-5 h-5 object-contain"
                  />
                </div>

                <span className="text-lg font-bold text-white tracking-tight font-display group-hover:text-purple-200 transition-colors duration-300">
                  PathGenie
                </span>
              </div>
            </Link>

            {/* User tier badge right next to logo */}
            {user && (
              <div className="flex items-center">
                {isProUser ? (
                  <span className="bg-amber-500/5 text-amber-400 border border-amber-500/20 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded shadow-[0_0_12px_rgba(245,158,11,0.05)]">
                    Pro
                  </span>
                ) : (
                  <span className="bg-purple-500/5 text-purple-400 border border-purple-500/20 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded">
                    Free
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {user ? (
              <>
                {/* My Roadmaps Button */}
                <Link to="/roadmaps">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-white/[0.04] font-medium transition-all duration-200 rounded-lg px-4 py-2 border border-transparent focus:ring-1 focus:ring-white/20"
                  >
                    <Map className="w-3.5 h-3.5 mr-2 text-slate-500" />
                    My Roadmaps
                  </Button>
                </Link>

                {/* Browse Community Button */}
                <Button
                  onClick={handleCommunityClick}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-white/[0.04] font-medium transition-all duration-200 rounded-lg px-4 py-2 border border-transparent focus:ring-1 focus:ring-white/20"
                >
                  <Users className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  Browse Community
                </Button>

                {/* Upgrade to Pro Button for free users only */}
                {!isProUser && (
                  <Button
                    onClick={handlePricingClick}
                    variant="ghost"
                    size="sm"
                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/5 border border-amber-500/10 rounded-lg px-4 py-2 font-medium transition-all duration-200 focus:ring-1 focus:ring-amber-500/30"
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-2" />
                    Upgrade to Pro
                  </Button>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-1 rounded-full hover:bg-white/5 focus:ring-1 focus:ring-white/20 transition-all duration-200"
                    >
                      <Avatar className="h-7 w-7 ring-1 ring-white/10 hover:ring-purple-500/30 transition-all duration-200">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-60 bg-[#0B0B0F] border border-white/[0.06] shadow-2xl p-1.5 rounded-lg backdrop-blur-xl"
                    align="end"
                  >
                    <DropdownMenuLabel className="text-white px-2 py-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs leading-none text-slate-500 mt-1">
                          {user.email}
                        </p>
                        {isProUser && (
                          <div className="flex items-center mt-1.5">
                            <Crown className="w-3 h-3 mr-1 text-amber-400" />
                            <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">
                              Pro Member
                            </span>
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/[0.04] my-1" />
                    <DropdownMenuItem
                      onClick={() => navigate("/roadmaps")}
                      className="text-slate-300 focus:text-white focus:bg-white/[0.04] cursor-pointer rounded px-2 py-1.5 transition-all duration-150"
                    >
                      <Map className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      My Roadmaps
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleCommunityClick}
                      className="text-slate-300 focus:text-white focus:bg-white/[0.04] cursor-pointer rounded px-2 py-1.5 transition-all duration-150"
                    >
                      <Users className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      Browse Community
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handlePricingClick}
                      className="text-slate-300 focus:text-white focus:bg-white/[0.04] cursor-pointer rounded px-2 py-1.5 transition-all duration-150"
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      {isProUser ? "Manage Subscription" : "Upgrade to Pro"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.04] my-1" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-400 focus:text-red-300 focus:bg-red-500/5 cursor-pointer rounded px-2 py-1.5 transition-all duration-150"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Navigation Links for Non-Authenticated Users */}
                <button
                  onClick={() => onScrollToSection("features")}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer font-medium px-3.5 py-1.5 rounded-lg hover:bg-white/[0.03] text-sm focus:outline-none focus:ring-1 focus:ring-white/10 duration-200 relative group"
                >
                  Features
                </button>

                <button
                  onClick={handlePricingClick}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer font-medium px-3.5 py-1.5 rounded-lg hover:bg-white/[0.03] text-sm focus:outline-none focus:ring-1 focus:ring-white/10 duration-200 relative group"
                >
                  Pricing
                </button>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    onClick={onAuthClick}
                    className="text-slate-300 hover:text-white hover:bg-white/[0.04] font-medium rounded-lg text-sm px-4 py-2 focus:ring-1 focus:ring-white/20 transition-all duration-200"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={onAuthClick}
                    className="bg-white hover:bg-slate-200 text-black font-semibold text-sm px-4 py-2 rounded-lg shadow-lg shadow-white/5 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Get Started
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#0B0B0F]/95 backdrop-blur-2xl border-white/[0.08] w-80">
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center">
                    <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-bold">PathGenie</span>
                  </SheetTitle>
                  <SheetDescription className="text-slate-400">
                    AI-powered learning roadmaps
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-4">
                  {user ? (
                    <>
                      {/* User Info */}
                      <div className="flex items-center space-x-3 p-3 bg-white/[0.02] rounded-xl border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
                        <Avatar className="h-10 w-10 ring-1 ring-white/10">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-slate-400 text-xs truncate max-w-[150px]">{user.email}</p>
                          {isProUser ? (
                            <div className="flex items-center mt-1">
                              <Crown className="w-3 h-3 mr-1 text-amber-400" />
                              <span className="text-[10px] text-amber-400 font-medium">
                                Pro Member
                              </span>
                            </div>
                          ) : (
                            <Badge className="bg-purple-600/20 text-purple-400 border border-purple-500/20 text-[10px] font-medium mt-1 py-0 px-1.5 rounded">
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="space-y-1">
                        <Button
                          onClick={() => navigate("/roadmaps")}
                          variant="ghost"
                          className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg py-2 transition-all duration-300"
                        >
                          <Map className="w-4 h-4 mr-3" />
                          My Roadmaps
                        </Button>
                        <Button
                          onClick={handleCommunityClick}
                          variant="ghost"
                          className={`w-full justify-start rounded-lg py-2 transition-all duration-300 ${
                            isProUser
                              ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/5"
                              : "text-purple-400 hover:text-purple-300 hover:bg-purple-500/5"
                          }`}
                        >
                          <Users className="w-4 h-4 mr-3" />
                          Browse Community
                        </Button>
                        {!isProUser && (
                          <Button
                            onClick={handlePricingClick}
                            variant="ghost"
                            className="w-full justify-start text-amber-400 hover:text-amber-300 hover:bg-amber-500/5 rounded-lg py-2 transition-all duration-300"
                          >
                            <CreditCard className="w-4 h-4 mr-3" />
                            Upgrade to Pro
                          </Button>
                        )}
                        <Button
                          onClick={handleSignOut}
                          variant="ghost"
                          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg py-2 transition-all duration-300"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Navigation for non-authenticated users */}
                      <div className="space-y-1">
                        <Button
                          onClick={() => onScrollToSection("features")}
                          variant="ghost"
                          className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg py-2 transition-all duration-300"
                        >
                          Features
                        </Button>

                        <Button
                          onClick={handlePricingClick}
                          variant="ghost"
                          className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg py-2 transition-all duration-300"
                        >
                          Pricing
                        </Button>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                        <Button
                          variant="outline"
                          onClick={onAuthClick}
                          className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white font-medium bg-black/20 backdrop-blur-sm rounded-lg transition-all duration-300"
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={onAuthClick}
                          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium shadow-lg transition-all duration-300 rounded-lg hover:shadow-purple-900/30"
                        >
                          Get Started
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
