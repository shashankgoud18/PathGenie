import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import CursorGlow from "@/components/CursorGlow";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-hidden p-6">
      <CursorGlow />
      <AnimatedBackground />
      
      <div className="text-center relative z-10 max-w-sm bg-[#0B0B0F]/60 border border-white/[0.04] p-8 rounded-xl backdrop-blur-xl">
        <h1 className="text-5xl font-bold text-white mb-2 font-display">404</h1>
        <p className="text-sm text-slate-400 mb-6">Oops! The page you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate('/')} 
          className="w-full bg-white hover:bg-slate-200 text-black px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
