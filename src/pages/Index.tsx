import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Target, 
  Clock, 
  Trophy, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  Terminal, 
  Code2, 
  ArrowUpRight, 
  HelpCircle,
  FileCode,
  Lock,
  GitBranch,
  Smartphone,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Floating elements component for premium dashboard feel
const FloatingCard = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={`absolute z-20 hidden md:block rounded-xl border border-white/[0.06] bg-[#0B0B0F]/80 backdrop-blur-md p-4 shadow-xl pointer-events-none ${className}`}
    animate={{
      y: [0, -6, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  >
    {children}
  </motion.div>
);

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("webdev");
  const [demoState, setDemoState] = useState<"idle" | "generating" | "complete">("idle");
  const [demoLogs, setDemoLogs] = useState<string[]>([]);
  const [activeUseCase, setActiveUseCase] = useState("engineers");
  const [activeFeature, setActiveFeature] = useState("synthesis");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Predefined mock data for simulator
  const demoData = {
    webdev: {
      goal: "Full-Stack Web Dev",
      logs: [
        "Initializing PathGenie AI Engine...",
        "Resolving curriculum target: Next.js + PostgreSQL + Tailwind",
        "Synthesizing 4-week progressive complexity layers...",
        "Integrating event loops, schema models, and JWT modules...",
        "Curating 14 high-fidelity external tutorials...",
        "Building hands-on milestones: E-commerce microservice API",
        "Verification complete. Roadmap generated successfully."
      ],
      weeks: [
        { title: "Week 1: Core Environment & Next.js Basics", desc: "Set up local workspace, learn routing, and build static layouts." },
        { title: "Week 2: Backend Models & DB Integration", desc: "Configure PostgreSQL, run migrations, and build secure REST endpoints." },
        { title: "Week 3: Advanced Hooks & Auth Middleware", desc: "Integrate Supabase JWT, cookies, and context-based user states." },
        { title: "Week 4: Performance, Testing & Deployment", desc: "Write Jest unit checks, run build tests, and ship to Vercel/Render." }
      ]
    },
    ml: {
      goal: "Machine Learning Engineer",
      logs: [
        "Initializing PathGenie AI Engine...",
        "Resolving curriculum target: PyTorch + Linear Algebra + CNNs",
        "Synthesizing 4-week mathematical logic blocks...",
        "Integrating backpropagation, numpy models, and optimizer APIs...",
        "Curating 11 verified research and coding tutorials...",
        "Building hands-on milestones: MNIST handwritten digit classifier",
        "Verification complete. Roadmap generated successfully."
      ],
      weeks: [
        { title: "Week 1: Foundations & NumPy Modeling", desc: "Master matrix operations, gradients, and cost functions in Python." },
        { title: "Week 2: Deep Networks with PyTorch", desc: "Write forward/backward passes, test cross-entropy, and utilize Adam/SGD." },
        { title: "Week 3: Computer Vision & Convolution", desc: "Design CNN architectures, pools, and test spatial feature maps." },
        { title: "Week 4: LLMs & Transformer Models", desc: "Understand attention mechanisms, self-attention equations, and fine-tuning." }
      ]
    },
    mobile: {
      goal: "React Native Developer",
      logs: [
        "Initializing PathGenie AI Engine...",
        "Resolving curriculum target: React Native + Expo + Redux Toolkit",
        "Synthesizing 4-week native components timeline...",
        "Integrating navigation controllers, local storage, and secure credentials...",
        "Curating 12 visual debugging and rendering tutorials...",
        "Building hands-on milestones: Offline-first productivity application",
        "Verification complete. Roadmap generated successfully."
      ],
      weeks: [
        { title: "Week 1: Workspace setup & Core Layouts", desc: "Install Expo CLI, understand Flexbox in Native, and build screens." },
        { title: "Week 2: Navigation & Native Hooks", desc: "Integrate React Navigation (Tab/Stack routers) and device permissions." },
        { title: "Week 3: State Management & Offline Cache", desc: "Configure Redux Toolkit, write RTK queries, and write AsyncStore hooks." },
        { title: "Week 4: Play Store prep & Native Native", desc: "Write bundle profiles, configure credentials, and compile test APKs." }
      ]
    }
  };

  const handleAuthClick = () => {
    if (user) {
      navigate('/generate');
    } else {
      navigate('/auth');
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Run simulation sequence when activeTab changes
  useEffect(() => {
    setDemoState("generating");
    setDemoLogs([]);
    let currentLog = 0;
    const targetLogs = demoData[activeTab].logs;
    
    const interval = setInterval(() => {
      if (currentLog < targetLogs.length) {
        const logValue = targetLogs[currentLog];
        setDemoLogs(prev => [...prev, logValue]);
        currentLog++;
      } else {
        clearInterval(interval);
        setDemoState("complete");
      }
    }, 450);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location]);

  const faqData = [
    {
      q: "How do I create my first roadmap?",
      a: "Simply sign up for a free account, type in your specific learning goal (e.g. 'Advanced PyTorch' or 'SvelteKit Web App'), define your weekly hours, and let PathGenie formulate a structured 4-week timeline packed with curated tasks and resources."
    },
    {
      q: "Can I customize the generated paths?",
      a: "Yes. Once generated, your roadmaps are interactive. You can check off completed tasks, customize titles, add personal reference links, and track your overall progression inside your workspace."
    },
    {
      q: "What benefits does the Pro plan offer?",
      a: "Pro unlocks unlimited AI generations, advanced progress analytics, public sharing configurations to build your portfolio, and priority access to state-of-the-art model checkpoints."
    },
    {
      q: "Is there support for local programming bootcamps?",
      a: "PathGenie is perfect for student developers, engineers upskilling for promotions, and bootcamp organizers who need customized, fast-scaling curricula tailored for technical teams."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <SEO 
        title="PathGenie - AI-Powered Learning Roadmaps"
        description="Transform your learning journey with structured, personalized 4-week roadmaps built using advanced AI."
        keywords="AI learning roadmap, personalized education, skill development, break tutorial hell"
        url="/"
      />
      
      {/* Premium Cursor & Background Glows */}
      <CursorGlow />
      <AnimatedBackground />
      
      {/* Global Navbar */}
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      <main className="relative z-10">
        
        {/* SECTION 1: HERO SECTION */}
        <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* LEFT SIDE: Value Prop & CTAs */}
            <div className="lg:col-span-5 text-left flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] mb-8 w-fit"
              >
                <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
                <span className="text-xs text-slate-300 font-mono">pathgenie-cli v1.4 active</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 font-display"
              >
                Build systematic mastery <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  driven by AI
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed font-normal max-w-lg"
              >
                Break the cycle of tutorial hell. PathGenie analyzes your target outcome, builds structured 4-week checklists, and tracks your path step-by-step.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Button 
                  onClick={handleAuthClick} 
                  className="w-full sm:w-auto px-6 py-5 rounded-lg bg-white text-black font-semibold hover:bg-slate-200 transition-all duration-200 text-sm flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-white/5"
                >
                  {user ? "Go to Workspace" : "Get Started Free"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => handleScrollToSection('demo')}
                  className="w-full sm:w-auto px-6 py-5 rounded-lg bg-[#0B0B0F]/80 hover:bg-[#121217] border border-white/[0.08] text-slate-300 font-semibold transition-all duration-200 text-sm flex items-center justify-center hover:scale-[1.02]"
                >
                  View Interactive Demo
                </Button>
              </motion.div>
            </div>

            {/* RIGHT SIDE: Product Mockups & Terminal */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              
              {/* Core Terminal Window Mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-xl bg-[#09090D] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden relative"
              >
                {/* Header buttons */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#050508] border-b border-white/[0.04]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">pathgenie-compiler --target="production"</span>
                  <div className="w-8" />
                </div>
                
                {/* Terminal Content */}
                <div className="p-6 font-mono text-xs text-left text-slate-300 min-h-[280px] space-y-2.5 select-none">
                  <div className="flex gap-2 text-slate-500">
                    <span>$</span>
                    <span className="text-white">pathgenie deploy --goal="Distributed Systems in Go"</span>
                  </div>
                  <div className="text-purple-400">[info] Initializing system curriculum analyzer...</div>
                  <div className="text-blue-400">[ready] Graphing linear algebra & scheduler loops...</div>
                  <div className="text-emerald-400">[success] Compiled 18 learning steps in 4.2s</div>
                  
                  <div className="h-[1px] bg-white/[0.04] my-4" />
                  
                  {/* Visual Step Log */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 text-[9px] font-bold">W1</span>
                      <span className="text-slate-300">Go Concurrency Basics (Channels, Goroutines)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 text-[9px] font-bold">W2</span>
                      <span className="text-slate-300">Raft Consensus Algorithm Fundamentals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 text-[9px] font-bold">W3</span>
                      <span className="text-slate-300">RPC Layering & Distributed Key-Value Stores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 text-[9px] font-bold">W4</span>
                      <span className="text-slate-300">Load Balancing & Network Fault Testing</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating UI Elements */}
              <FloatingCard delay={0.5} className="top-[-20px] right-[-10px] w-48">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Synchronized</div>
                    <div className="text-xs font-semibold text-white">Supabase DB Sync</div>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard delay={1.5} className="bottom-[-10px] left-[-30px] w-56">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Current Progress</span>
                    <span className="text-xs font-semibold text-white">4-Week Path Completed</span>
                  </div>
                  <span className="text-sm font-bold text-purple-400">75%</span>
                </div>
                <div className="w-full bg-white/[0.04] h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full w-[75%]" />
                </div>
              </FloatingCard>

              <FloatingCard delay={2.5} className="bottom-[40px] right-[-20px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white font-mono">18 API modules configured</span>
                </div>
              </FloatingCard>

            </div>

          </div>
        </section>

        {/* SECTION 2: TRUSTED BY / SOCIAL PROOF */}
        <section className="py-10 border-y border-white/[0.04] bg-[#050507]/40 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase mb-5 font-mono">ENGINEERED FOR DEV WORKFLOWS AT</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:opacity-50 transition-opacity duration-300">
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((company) => (
                <span key={company} className="text-sm sm:text-base font-bold text-slate-400 tracking-wider font-mono">{company}</span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: PRODUCT SHOWCASE */}
        <section className="py-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 font-display">
              Curriculums centered on execution
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              No generic playlists. We compile structural learning nodes that map theoretical lessons to hands-on programming projects.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-[#0B0B0F] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.04] bg-black/40">
              <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
              <span className="text-[10px] text-slate-500 font-mono ml-4">Workspace Preview (Active Module)</span>
            </div>
            
            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 text-left bg-black/10">
              <div className="md:col-span-5 space-y-4">
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-xs text-purple-400 font-mono uppercase tracking-wider mb-1">Module 1.2</div>
                  <h4 className="text-sm font-semibold text-white">Event Loop & Microtasks</h4>
                  <p className="text-xs text-slate-500 mt-1">Understanding call stacks, task queues, and performance profiling.</p>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.01] border border-white/[0.04] opacity-50">
                  <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Module 1.3</div>
                  <h4 className="text-sm font-semibold text-white">Stream Buffering APIs</h4>
                  <p className="text-xs text-slate-500 mt-1">Handling raw TCP stream segments directly inside node structures.</p>
                </div>
              </div>
              <div className="md:col-span-7 bg-[#050507] border border-white/[0.06] rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
                    <span className="text-xs font-semibold text-white font-mono">Resource Checklist</span>
                    <span className="text-[10px] text-emerald-400 font-mono">2 of 3 Checked</span>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                      <div className="w-4 h-4 rounded border border-purple-500 bg-purple-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-purple-400" />
                      </div>
                      <span>Read V8 Event Loop Specification Docs</span>
                    </label>
                    <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                      <div className="w-4 h-4 rounded border border-purple-500 bg-purple-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-purple-400" />
                      </div>
                      <span>Code single call microtask micro-benchmarks</span>
                    </label>
                    <label className="flex items-center gap-3 text-xs text-slate-500 cursor-pointer">
                      <div className="w-4 h-4 rounded border border-white/[0.08] flex items-center justify-center" />
                      <span>Review task execution visual maps</span>
                    </label>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/[0.04] mt-6 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Target Hours: 3.5 hrs</span>
                  <span className="text-purple-400 hover:underline cursor-pointer flex items-center gap-0.5">Explore Resource <ArrowUpRight className="w-3 h-3" /></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE FEATURE EXPLORER */}
        {!user && (
          <section id="features" className="py-28 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.04]">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-[10px] font-mono tracking-wider uppercase text-purple-400">Workspace Engine</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-4 font-display">
                Engineered for systematic mastery
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Click through our core developer primitives to see how PathGenie converts aspirations into structured production workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
              {/* Left Side: Navigation Primitives */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-4">
                {[
                  {
                    id: "synthesis",
                    title: "AI Synthesis Engine",
                    desc: "Outlines multi-week curriculums featuring progressive complexity, balancing logic checkpoints and coding milestones.",
                    badge: "Synthesis"
                  },
                  {
                    id: "checkpoints",
                    title: "Interactive Checkpoints",
                    desc: "Interactive status boxes, tracking metrics, and weekly checkpoint checklist structures.",
                    badge: "Checklists"
                  },
                  {
                    id: "aggregator",
                    title: "Resource Aggregator",
                    desc: "Maps documentation URLs, source code examples, and tutorial videos directly to your learning nodes.",
                    badge: "Curation"
                  },
                  {
                    id: "sharing",
                    title: "Public Share Portfolios",
                    desc: "Publish your learning progress. Share custom landing pages with peer developers and technical recruiters.",
                    badge: "Portfolios"
                  }
                ].map(feature => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`p-6 rounded-xl border text-left transition-all duration-300 focus:outline-none flex flex-col justify-between min-h-[120px] ${
                      activeFeature === feature.id
                        ? "bg-[#0B0B0F] border-purple-500/30 text-white shadow-xl shadow-purple-500/[0.02]"
                        : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:border-white/[0.08] hover:bg-white/[0.02]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold font-display">{feature.title}</span>
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                          activeFeature === feature.id
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-white/[0.03] text-slate-500 border border-white/[0.06]"
                        }`}>
                          {feature.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Side: High-Fidelity Workspace Mock */}
              <div className="lg:col-span-7 bg-[#09090C] border border-white/[0.06] rounded-xl flex flex-col overflow-hidden min-h-[420px] relative shadow-2xl">
                
                {/* Header browser-bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#050508] border-b border-white/[0.04]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">
                    {activeFeature === "synthesis" && "compiler --synthesis-engine"}
                    {activeFeature === "checkpoints" && "workspace --progress-manager"}
                    {activeFeature === "aggregator" && "aggregator --resource-curator"}
                    {activeFeature === "sharing" && "share --deploy-portfolio"}
                  </span>
                  <div className="w-8" />
                </div>

                {/* Workspace Body */}
                <div className="p-8 flex-1 flex flex-col justify-center items-center bg-[#07070A]/50">
                  <AnimatePresence mode="wait">
                    {/* Synthesis View */}
                    {activeFeature === "synthesis" && (
                      <motion.div
                        key="synthesis"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-sm space-y-4 text-left font-mono"
                      >
                        <div className="p-4 rounded-lg bg-black/40 border border-white/[0.05]">
                          <div className="text-[10px] text-purple-400 mb-1">PROMPT_INPUT</div>
                          <div className="text-xs text-white">"Advanced Rust Systems Programming"</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/20 border border-white/[0.03] space-y-2">
                          <div className="text-[10px] text-slate-500">SYNTHESIZED_WEEKLY_OUTLINE</div>
                          <div className="h-1 bg-white/[0.04] w-full rounded" />
                          <div className="space-y-1.5 text-[10px] text-slate-400">
                            <div>➜ W1: Memory Safety & Lifetimes</div>
                            <div>➜ W2: Concurrency & Rayon Loops</div>
                            <div>➜ W3: Dynamic Libraries & FFI</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Checkpoints View */}
                    {activeFeature === "checkpoints" && (
                      <motion.div
                        key="checkpoints"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-sm space-y-4 text-left"
                      >
                        <div className="flex justify-between items-center bg-[#0B0B0F]/80 p-4 border border-white/[0.06] rounded-lg">
                          <div>
                            <div className="text-xs font-bold text-white">Week 1 Milestone</div>
                            <div className="text-[10px] text-slate-500 mt-1">Concurreny pipelines</div>
                          </div>
                          {/* Circle Progress Indicator */}
                          <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="w-10 h-10 transform -rotate-90">
                              <circle cx="20" cy="20" r="16" className="stroke-white/[0.06] fill-none" strokeWidth="3" />
                              <circle cx="20" cy="20" r="16" className="stroke-purple-500 fill-none" strokeWidth="3" strokeDasharray="100" strokeDashoffset="33" />
                            </svg>
                            <span className="absolute text-[9px] font-mono text-purple-400 font-bold">66%</span>
                          </div>
                        </div>

                        <div className="space-y-2 bg-[#0B0B0F]/40 p-4 border border-white/[0.03] rounded-lg">
                          <label className="flex items-center gap-3 text-[11px] text-slate-300">
                            <div className="w-4 h-4 rounded border border-purple-500 bg-purple-500/10 flex items-center justify-center">
                              <Check className="w-3 h-3 text-purple-400" />
                            </div>
                            <span>Write Rayon concurrent iterators</span>
                          </label>
                          <label className="flex items-center gap-3 text-[11px] text-slate-300">
                            <div className="w-4 h-4 rounded border border-purple-500 bg-purple-500/10 flex items-center justify-center">
                              <Check className="w-3 h-3 text-purple-400" />
                            </div>
                            <span>Resolve thread race safety checks</span>
                          </label>
                          <label className="flex items-center gap-3 text-[11px] text-slate-500">
                            <div className="w-4 h-4 rounded border border-white/[0.08] flex items-center justify-center" />
                            <span>Validate lock concurrency bottlenecks</span>
                          </label>
                        </div>
                      </motion.div>
                    )}

                    {/* Aggregator View */}
                    {activeFeature === "aggregator" && (
                      <motion.div
                        key="aggregator"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-sm space-y-3.5 text-left"
                      >
                        <div className="p-3 bg-black/40 border border-white/[0.06] rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-red-400 text-xs">📹</span>
                            <div>
                              <div className="text-[11px] font-bold text-white">Rust Lifetimes Deep-Dive</div>
                              <div className="text-[9px] text-slate-500">YouTube Tutorial • 45 mins</div>
                            </div>
                          </div>
                          <span className="text-[9px] text-purple-400 hover:underline cursor-pointer">Open Video ↗</span>
                        </div>

                        <div className="p-3 bg-black/40 border border-white/[0.06] rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400 text-xs">📖</span>
                            <div>
                              <div className="text-[11px] font-bold text-white">Official Rayon Crates Guide</div>
                              <div className="text-[9px] text-slate-500">Documentation Module</div>
                            </div>
                          </div>
                          <span className="text-[9px] text-purple-400 hover:underline cursor-pointer">Open Docs ↗</span>
                        </div>

                        <div className="p-3 bg-black/40 border border-white/[0.06] rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 text-xs">💻</span>
                            <div>
                              <div className="text-[11px] font-bold text-white">Mutex vs RwLock Samples</div>
                              <div className="text-[9px] text-slate-500">GitHub Code Gist</div>
                            </div>
                          </div>
                          <span className="text-[9px] text-purple-400 hover:underline cursor-pointer">Open Code ↗</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Sharing View */}
                    {activeFeature === "sharing" && (
                      <motion.div
                        key="sharing"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-sm space-y-4 text-center"
                      >
                        <div className="p-4 bg-black/40 border border-white/[0.06] rounded-xl text-left space-y-3">
                          <div className="text-[10px] text-slate-500 font-mono">PORTFOLIO_DEPLOYED_URL</div>
                          <div className="bg-[#050508] border border-white/[0.04] p-2.5 rounded font-mono text-[11px] text-slate-300 flex justify-between items-center select-all">
                            <span>pathgenie.to/rust-systems</span>
                            <span className="text-purple-400 text-[9px] uppercase font-bold tracking-wider">Copy URL</span>
                          </div>
                          <div className="h-[1px] bg-white/[0.04] my-2" />
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                            <span>Views: <strong className="text-emerald-400">142</strong></span>
                            <span>Status: <strong className="text-purple-400">Public</strong></span>
                          </div>
                        </div>

                        <Button className="w-full bg-[#050508] hover:bg-[#0D0D12] text-white border border-white/[0.08] font-bold text-xs py-2 rounded-lg transition-colors">
                          Share Portfolio Link
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: INTERACTIVE PRODUCT DEMO */}
        <section id="demo" className="py-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.04]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-mono tracking-wider uppercase text-purple-400">Simulator Terminal</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-4 font-display">
              See the generator in action
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Select a learning track below and watch our AI compiler construct a high-performance roadmap in real-time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side selectors */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              {[
                { id: "webdev", label: "Full-Stack Web Dev", subtitle: "NextJS & Databases" },
                { id: "ml", label: "Machine Learning", subtitle: "PyTorch & Convolution" },
                { id: "mobile", label: "React Native Dev", subtitle: "Expo Mobile Apps" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none ${
                    activeTab === item.id
                      ? "bg-[#0B0B0F] border-purple-500/30 text-white shadow-xl shadow-purple-500/5"
                      : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:border-white/[0.08] hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.subtitle}</div>
                </button>
              ))}
            </div>

            {/* Right side Simulator Output */}
            <div className="lg:col-span-8 bg-[#09090C] border border-white/[0.06] rounded-xl flex flex-col min-h-[350px]">
              <div className="flex items-center justify-between px-4 py-3 bg-[#050508] border-b border-white/[0.04] text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-500">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>pathgenie-compiler --goal="{demoData[activeTab].goal}"</span>
                </div>
                {demoState === "generating" ? (
                  <span className="text-purple-400 animate-pulse text-[10px]">Processing...</span>
                ) : (
                  <span className="text-emerald-400 text-[10px]">Done</span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                
                {/* Simulated Logs */}
                <div className="space-y-1.5 font-mono text-[11px] text-left text-slate-400">
                  {demoLogs.map((log, i) => (
                    <div key={i} className={i === demoLogs.length - 1 && demoState === "generating" ? "text-purple-400" : ""}>
                      {log && (log.startsWith("✔") || log.startsWith("Verification") || log.startsWith("[success]")) ? (
                        <span className="text-emerald-400">{log}</span>
                      ) : log && log.startsWith("[ready]") ? (
                        <span className="text-blue-400">{log}</span>
                      ) : (
                        <span>{log}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Animated Curriculum Result */}
                <AnimatePresence mode="wait">
                  {demoState === "complete" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 pt-5 border-t border-white/[0.04] space-y-3.5 text-left"
                    >
                      {demoData[activeTab].weeks.map((week, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <span className="w-5 h-5 rounded-full bg-purple-500/5 border border-purple-500/25 flex items-center justify-center text-[10px] font-mono text-purple-400 shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white leading-none">{week.title}</div>
                            <div className="text-[11px] text-slate-500 mt-1 leading-normal">{week.desc}</div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </section>

        {/* SECTION 6: THE LEARNING PARADIGM COMPARISON */}
        <section className="py-28 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.04]">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[10px] font-mono tracking-wider uppercase text-purple-400">The Learning Paradigm</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-4 font-display">
              Break the loop of tutorial hell
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Why passive course consumption fails and how structured, active building compiles actual knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Passive Consumption Loop */}
            <div className="lg:col-span-6 rounded-2xl border border-white/[0.04] bg-[#09090C]/40 p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[460px] text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.02] rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-red-500 bg-red-500/10 border border-red-500/15 px-2.5 py-1 rounded-full font-semibold">
                  Passive Consumption (The Loop)
                </span>
                <h3 className="text-xl font-bold text-white mt-4 mb-2 font-display">Endless Video Streaming</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  Watching hours of video content feels like learning. But without writing code or hitting walls, knowledge fades, leading to developer paralysis.
                </p>
              </div>

              {/* Animated SVG Loop Diagram */}
              <div className="my-10 relative flex justify-center items-center h-48">
                <svg className="w-40 h-40 transform -rotate-90 select-none pointer-events-none" viewBox="0 0 100 100">
                  {/* Loop path */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="stroke-red-500/10 fill-none"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="stroke-red-500/40 fill-none"
                    strokeWidth="1.5"
                    strokeDasharray="30 150"
                    strokeLinecap="round"
                    style={{
                      animation: 'spin-slow 12s linear infinite',
                      transformOrigin: 'center'
                    }}
                  />
                </svg>
                
                {/* Loop text nodes */}
                <div className="absolute inset-0 flex flex-col justify-between items-center py-2">
                  <div className="bg-[#0D0D12] border border-red-500/20 px-2.5 py-1 rounded text-[10px] font-mono text-red-400 shadow-md">
                    1. Watch Course
                  </div>
                  <div className="bg-[#0D0D12] border border-red-500/20 px-2.5 py-1 rounded text-[10px] font-mono text-red-400 shadow-md">
                    3. Blank Screen Panic
                  </div>
                </div>
                
                <div className="absolute inset-0 flex justify-between items-center px-2">
                  <div className="bg-[#0D0D12] border border-red-500/20 px-2.5 py-1 rounded text-[10px] font-mono text-red-400 shadow-md">
                    4. Search New Tutorial
                  </div>
                  <div className="bg-[#0D0D12] border border-red-500/20 px-2.5 py-1 rounded text-[10px] font-mono text-red-400 shadow-md">
                    2. False Confidence
                  </div>
                </div>

                <div className="absolute text-center">
                  <div className="text-xl font-bold text-red-500/90 font-mono">∞</div>
                  <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">Repeating Loop</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 border-t border-white/[0.04] pt-4 font-mono flex items-center justify-between">
                <span>Result: Tutorial Paralysis</span>
                <span className="text-red-400 font-semibold">0% Core Competence</span>
              </div>
            </div>

            {/* Active Construction Path */}
            <div className="lg:col-span-6 rounded-2xl border border-purple-500/15 bg-[#0B0B0F]/70 p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[460px] text-left shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.03] rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-purple-400 bg-purple-500/10 border border-purple-500/15 px-2.5 py-1 rounded-full font-semibold">
                  Active Construction (PathGenie)
                </span>
                <h3 className="text-xl font-bold text-white mt-4 mb-2 font-display">Milestone-Driven Learning</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  Define your goal, receive a structured multi-week syllabus, and build projects. Complete challenges to unlock next stages with code validation.
                </p>
              </div>

              {/* Animated Progress Timeline representation */}
              <div className="my-8 relative flex flex-col gap-3.5 pl-6 border-l border-purple-500/20">
                {[
                  { title: "Define Target Outcome", desc: "Rust database engine", active: true },
                  { title: "Syllabus Synthesis", desc: "Weeks structured by complexity", active: true },
                  { title: "Hands-on Project Execution", desc: "Build key-value store milestones", active: true },
                  { title: "Push Portfolio & Verify", desc: "GitHub integration and peer access", active: false }
                ].map((step, idx) => (
                  <div key={idx} className="relative text-left">
                    <span className={`absolute left-[-31px] top-0.5 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                      step.active 
                        ? "bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/30" 
                        : "bg-[#09090C] border-white/[0.1] text-slate-500"
                    }`}>
                      {step.active ? "✓" : idx + 1}
                    </span>
                    <div>
                      <div className={`text-[11px] font-bold ${step.active ? "text-white" : "text-slate-500"}`}>{step.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 border-t border-white/[0.04] pt-4 font-mono flex items-center justify-between">
                <span>Result: Verified Portfolio</span>
                <span className="text-purple-400 font-semibold">Job-Ready Skills</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: TECHNICAL CAPABILITIES */}
        <section className="py-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.04]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left">
              <span className="text-[10px] font-mono tracking-wider uppercase text-purple-400">Technical Integration</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-4 font-display">
                Engineered for engineers
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Generate program curricula via our unified TypeScript SDK, sync databases using secure Supabase triggers, and export templates directly to JSON.
              </p>
              <div className="space-y-3">
                {[
                  "Strict schema-backed output modules",
                  "TypeScript SDK configuration models",
                  "Secure PostgreSQL storage syncing"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#09090C] border border-white/[0.06] rounded-xl p-6 text-left relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>pathgenie-client.ts</span>
                </div>
                <span className="text-[10px] text-slate-600 font-mono">TypeScript</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed select-all">
{`import { PathGenie } from "@pathgenie/sdk";

const generator = new PathGenie({ apiKey: process.env.API_KEY });

const roadmap = await generator.roadmaps.create({
  goal: "Distributed Databases in Rust",
  schedule: { hoursPerWeek: 12, weeks: 4 },
  experience: "Intermediate",
  exportFormat: "JSON"
});

console.log(\`Generated \${roadmap.steps.length} modules!\`);`}
              </pre>
            </div>

          </div>
        </section>

        {/* SECTION 8: USE CASES */}
        <section className="py-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.04]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 font-display">
              Tailored workflows for learning paths
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Different goals require different structures. Select your path details to see customization features.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tabs Header */}
            <div className="flex justify-center border-b border-white/[0.04] mb-8">
              {[
                { id: "engineers", label: "Software Engineers" },
                { id: "designers", label: "UI/UX Designers" },
                { id: "students", label: "University Students" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveUseCase(tab.id)}
                  className={`px-6 py-3 text-xs font-semibold border-b-2 transition-all focus:outline-none ${
                    activeUseCase === tab.id
                      ? "border-purple-500 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 rounded-xl border border-white/[0.04] bg-white/[0.01] text-left">
              {activeUseCase === "engineers" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-purple-400" />
                      Upskill with Technical Rigor
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Build production systems, setup Docker run environments, deploy backend REST services, and learn database query indexing patterns directly through automated steps.
                    </p>
                    <span className="text-[10px] bg-purple-500/5 text-purple-400 border border-purple-500/10 px-2 py-0.5 rounded font-mono">CLI Mapped API Docs</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400" /> Docker containers and networks
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400" /> PostgreSQL clustering patterns
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400" /> Secure Redis configurations
                    </div>
                  </div>
                </div>
              )}
              {activeUseCase === "designers" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-400" />
                      Design & Prototyping Workflows
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Map visual UI layouts, configure design tokens, script micro-animations with Framer Motion, and learn component hierarchy strategies.
                    </p>
                    <span className="text-[10px] bg-blue-500/5 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded font-mono">Figma Integration Ready</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Advanced Figma layout grids
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Framer Motion spring controls
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400" /> Interactive prototyping tokens
                    </div>
                  </div>
                </div>
              )}
              {activeUseCase === "students" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-pink-400" />
                      Pass CS Exams & Build Portfolios
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Master basic algorithms (sorting, binary search), implement raw Python scripts, and compile custom projects to showcase on GitHub.
                    </p>
                    <span className="text-[10px] bg-pink-500/5 text-pink-400 border border-pink-500/10 px-2 py-0.5 rounded font-mono">Student Friendly Rates</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-pink-400" /> Data structures (Trees, HashMaps)
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-pink-400" /> Clean script architectures
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-pink-400" /> GitHub commits optimization
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>


        {/* SECTION 11: FAQ */}
        <section id="faq" className="py-24 relative z-10 max-w-3xl mx-auto px-4 border-t border-white/[0.04]">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-wider uppercase text-purple-400">Common Inquiries</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2 mb-4 font-display">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-white/[0.04] bg-[#0B0B0F]/30 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-white hover:bg-white/[0.01] transition-all"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${openFaq === idx ? "rotate-90" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/[0.02]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 12: FINAL CTA */}
        {!user && (
          <section className="py-24 relative z-10 max-w-5xl mx-auto px-4">
            <div className="relative overflow-hidden bg-[#0B0B0F]/60 border border-white/[0.04] rounded-2xl p-10 sm:p-16 text-center shadow-2xl">
              
              {/* Internal glowing loop */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-500/10 blur-[90px] -z-10 rounded-full animate-aurora" />
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 font-display">
                Take control of your learning paths
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
                Join ambitious developers, designers, and students upskilling their portfolios with structured AI roadmaps.
              </p>
              
              <Button 
                onClick={handleAuthClick}
                className="bg-white hover:bg-slate-200 text-black px-8 py-3.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-[1.02]"
              >
                Start Generating Now
                <ArrowRight className="w-4 h-4 shrink-0 ml-1" />
              </Button>
            </div>
          </section>
        )}


        
      </main>

      {/* Shared global Footer */}
      <Footer />
    </div>
  );
};

export default Index;
