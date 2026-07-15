import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Roadmaps from "./pages/Roadmaps";
import Generate from "./pages/Generate";
import RoadmapView from "./pages/RoadmapView";
import Pricing from "./pages/Pricing";
import Community from "./pages/Community";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null, showDetails: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050507] text-[#A1A1AA] flex flex-col items-center justify-center p-6 selection:bg-purple-500/20 relative font-sans">
          {/* Backdrop Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full max-w-md bg-[#09090C] border border-white/[0.06] rounded-2xl p-8 shadow-2xl relative z-10 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400 text-lg">
              ⚠️
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white font-display">Something went wrong</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected rendering error occurred inside the workspace. Please reload the page or click below to recover.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  this.setState({ hasError: false, error: null, showDetails: false });
                  window.location.reload();
                }} 
                className="w-full py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-slate-200 transition-colors duration-200 text-xs shadow-lg shadow-white/5"
              >
                Reload Application
              </button>
              
              <button 
                onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                className="w-full py-2.5 rounded-lg bg-[#0B0B0F]/80 hover:bg-[#121217] border border-white/[0.08] text-slate-400 font-semibold transition-colors duration-200 text-xs"
              >
                {this.state.showDetails ? "Hide technical details" : "Show technical details"}
              </button>
            </div>

            {this.state.showDetails && (
              <div className="text-left font-mono text-[10px] space-y-2 mt-4">
                <div className="p-3 bg-black/40 border border-white/[0.05] rounded-lg text-red-400 break-all">
                  <strong>Error:</strong> {this.state.error?.message}
                </div>
                <pre className="p-3 bg-black/60 border border-white/[0.03] rounded-lg text-slate-500 overflow-auto max-h-40 leading-normal select-all">
                  {this.state.error?.stack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>            <Routes>
              <Route path="/" element={<ErrorBoundary><Index /></ErrorBoundary>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/roadmaps" element={<Roadmaps />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/roadmap/:id" element={<RoadmapView />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/community" element={<Community />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
