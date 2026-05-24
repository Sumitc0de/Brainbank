import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { 
  Sparkles, Terminal, LogIn, Cpu, Award, HelpCircle, Crown, 
  Star, Layers, CheckCircle2, ChevronRight, MessageSquare,
  ShieldCheck, Zap, Lock, DollarSign, ArrowRight, ArrowDown,
  UploadCloud, FileText, Image as ImageIcon, Download, 
  CheckSquare, ListTodo, Compass, Rocket, Search, Eye, Sun, Moon
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { toast } from '../ui/Toast';

const TRUST_LOGOS = [
  { name: "Y Combinator", label: "YC" },
  { name: "Vercel", label: "▲ Vercel" },
  { name: "Linear", label: "⧉ Linear" },
  { name: "Stripe", label: "stripe" },
  { name: "Notion", label: "Notion" }
];

const FEATURES = [
  {
    title: "AI PRD Generator",
    desc: "Draft instantly structured spec sheets, monetization suggested streams, MVP breakdowns, and technical stacks via natural language LLM models.",
    icon: Cpu,
    color: "from-purple to-purple-soft",
    badge: "AI Powered",
  },
  {
    title: "Research Tracking",
    desc: "Execute a structural competitor and market validation quest. Store notes and validate monetization routes step-by-step.",
    icon: Search,
    color: "from-blue to-cyan",
    badge: "Strategic",
  },
  {
    title: "Upload UI Inspirations",
    desc: "Keep screenshots, landing layouts, and visual references organized under your active projects with quick previews.",
    icon: ImageIcon,
    color: "from-rose to-purple-soft",
    badge: "Assets",
  },
  {
    title: "Upload Logo Designs",
    desc: "Organize branding assets, vector logos, and SVG assets side-by-side with your primary product plans.",
    icon: Crown,
    color: "from-amber to-purple-soft",
    badge: "Identity",
  },
  {
    title: "Upload PRD PDFs",
    desc: "Attach external specifications, research documents, and market decks straight to the project cloud vault.",
    icon: FileText,
    color: "from-purple to-rose",
    badge: "Documents",
  },
  {
    title: "Todo & Execution Tracking",
    desc: "Actionable local checklists built directly into your active workspace. Break down complex builds into small milestones.",
    icon: CheckSquare,
    color: "from-green to-amber",
    badge: "Milestones",
  },
  {
    title: "Build Pipeline",
    desc: "Keep your entire startup pipeline organized on a responsive Kanban-style Quest Board from Backlog to completed Launch.",
    icon: Compass,
    color: "from-blue to-green",
    badge: "Pipeline",
  },
  {
    title: "Feature Planning",
    desc: "Prioritize build items using the custom gamified priority scoring matrix (Impact, Confidence, Ease). Focus on what matters.",
    icon: Layers,
    color: "from-purple to-rose",
    badge: "Prioritization",
  }
];

const REVIEWS = [
  {
    name: "Sumit Vishwa",
    role: "Founder, Brainbank",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "Brainbank transformed how I prioritize raw ideas. The automatic AI PRD copilot has saved me dozens of hours of planning, keeping me structured and aligned."
  },
  {
    name: "Aria Chen",
    role: "Indie Creator & Hacker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "The gamified XP level tracking is addictive. I've launched more feature-complete MVPs this month than I did all of last year. Absolute game-changer!"
  },
  {
    name: "Marcus Thorne",
    role: "Co-Founder, Elevate App",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    text: "Being able to drag ideas across our Kanban pipeline, score them dynamically, and upload product assets to a secure cloud is purely satisfying."
  }
];

const TIMELINE_STAGES = [
  { name: "Capture", icon: Crown, desc: "Log ideas instantly before they fade.", glow: "shadow-purple/10 text-purple" },
  { name: "Research", icon: Search, desc: "Map competitors and validate markets.", glow: "shadow-blue/10 text-blue" },
  { name: "Plan", icon: Layers, desc: "Prioritize features with ICE models.", glow: "shadow-amber/10 text-amber" },
  { name: "Build", icon: Cpu, desc: "Draft AI PRDs and track active tasks.", glow: "shadow-green/10 text-green" },
  { name: "Launch", icon: Rocket, desc: "Ship complete MVPs and earn levels.", glow: "shadow-cyan/10 text-rose" }
];

const PRICING_PLANS = [
  {
    name: "Hobbyist",
    price: "0",
    desc: "Perfect for testing raw ideas and mapping out initial features.",
    features: [
      "Up to 5 active startup ideas",
      "Standard AI PRD generation",
      "ICE priority matrix scoring",
      "Basic file attachments (up to 5MB)",
      "Standard local save files"
    ],
    cta: "Start Building Free",
    popular: false,
  },
  {
    name: "Founder / Pro",
    price: "12",
    desc: "Built for active builders launching and scaling multiple ventures.",
    features: [
      "Unlimited startup ideas",
      "Advanced Groq-powered PRDs",
      "Priority queue & auto-promotions",
      "Premium Cloudinary attachments (up to 20MB)",
      "Instant PDF spec sheet downloads",
      "Priority feature roadmap requests"
    ],
    cta: "Unlock Founder Tier",
    popular: true,
  }
];

// Clean entrance transitions
const fadeInUpProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function LoginView() {
  const { loginWithGoogle, loading, error: authError, theme, toggleTheme } = useAuthStore();
  const [activeResearchTab, setActiveResearchTab] = useState(0);
  
  // Interactive Upload Simulator State
  const [simulatedFiles, setSimulatedFiles] = useState([
    { name: "landing_hero_mockup.png", type: "image", size: "1.4 MB", progress: 100 },
    { name: "product_specification_v2.pdf", type: "pdf", size: "2.8 MB", progress: 100 }
  ]);
  const [uploadingSim, setUploadingSim] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast('Welcome to Brainbank!', 'success');
    } catch (err) {
      toast(err.message || 'Google authentication failed.', 'error');
    }
  };

  const startUploadSimulation = () => {
    if (uploadingSim) return;
    setUploadingSim(true);
    const newFile = { name: "brand_logo_proposal.svg", type: "image", size: "480 KB", progress: 5 };
    setSimulatedFiles(prev => [...prev, newFile]);

    let currentProgress = 5;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setUploadingSim(false);
        toast("Vector SVG Logo uploaded successfully!", "success");
      }
      setSimulatedFiles(prev => 
        prev.map(f => f.name === "brand_logo_proposal.svg" ? { ...f, progress: currentProgress } : f)
      );
    }, 150);
  };

  const scrollToAuth = () => {
    document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen w-full overflow-y-auto overflow-x-hidden select-none font-sans bg-[linear-gradient(135deg,rgba(255,247,223,0.98),rgba(255,241,209,0.95))] text-fg pb-6 scroll-smooth">
      
      {/* Cinematic warm grid overlay */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(45,111,41,0.02)_0_1px,transparent_1px_40px),repeating-linear-gradient(0deg,rgba(223,32,70,0.015)_0_1px,transparent_1px_40px)] pointer-events-none" />

      {/* Cinematic warm peach/purple mesh glow backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[55%] rounded-full bg-purple-soft/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[55%] h-[40%] rounded-full bg-purple/6 blur-[130px] pointer-events-none" />

      {/* ================= HEADER NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-edge/60 bg-surface-2/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-purple via-purple-soft to-green flex items-center justify-center shadow-lg shadow-purple/10">
              <Crown size={14} className="text-white" />
            </div>
            <span className="text-sm font-black tracking-tight bg-gradient-to-r from-fg to-fg-2 bg-clip-text text-transparent">Brainbank</span>
          </div>

          <nav className="hidden sm:flex items-center gap-8 text-xs font-semibold text-fg-2">
            <a href="#features" className="hover:text-purple transition-colors">Features</a>
            <a href="#workflow" className="hover:text-purple transition-colors">Workflow</a>
            <a href="#reviews" className="hover:text-purple transition-colors">Reviews</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-edge/60 bg-surface-2/45 hover:bg-surface-2 hover:border-edge text-fg transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} className="text-purple-soft" /> : <Moon size={15} className="text-fg-2" />}
            </button>

            <button 
              type="button"
              onClick={scrollToAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-fg hover:bg-fg-2 text-surface-2 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <LogIn size={12} />
              Start Building
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-[92vh] flex items-center max-w-6xl mx-auto px-6 py-12 md:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Side Info */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple/20 bg-purple/5 text-purple text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={11} className="text-purple animate-pulse" />
              The AI Founder Operating System
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-fg leading-[1.1]">
              Your second brain <br />
              <span className="bg-gradient-to-r from-purple via-purple-soft to-green bg-clip-text text-transparent">
                for building startups.
              </span>
            </h1>
            
            <p className="text-fg-2 text-base sm:text-lg max-w-lg leading-relaxed">
              Capture ideas, organize research, upload assets, generate PRDs, and track execution — all in one intelligent, gamified-themed workspace. Built exclusively for serious builders.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="button"
                onClick={scrollToAuth}
                className="flex items-center gap-1.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple to-purple-soft text-white hover:from-purple-deep hover:to-purple font-bold text-sm shadow-lg shadow-purple/15 transition-all active:scale-[0.98] cursor-pointer"
              >
                Start Building Free
                <ChevronRight size={16} />
              </button>
              <button 
                type="button"
                onClick={scrollToAuth}
                className="px-6 py-3.5 rounded-xl border border-edge bg-surface-2/60 hover:bg-surface-2 text-fg font-bold text-sm transition-all shadow-card cursor-pointer"
              >
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-edge/60 max-w-lg">
              <p className="text-[10px] text-fg-4 uppercase tracking-widest font-bold">Trusted by builders at</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-fg-3 text-sm font-semibold">
                {TRUST_LOGOS.map(logo => (
                  <span key={logo.name} className="hover:text-fg transition-colors cursor-default">{logo.label}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side Visual Mockup */}
          <motion.div 
            className="lg:col-span-5 w-full flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          >
            <div className="relative w-full max-w-sm rounded-3xl border border-edge bg-surface-2/80 p-6 shadow-elevated backdrop-blur-xl">
              
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-edge/60">
                <div className="flex items-center gap-2">
                  <Crown size={15} className="text-purple animate-pulse" />
                  <span className="text-[11px] font-black tracking-wider text-fg uppercase">Brainbank OS</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple/10 border border-purple/20 text-purple font-bold uppercase">Level 4: Builder</span>
              </div>

              {/* Mock Dashboard widgets */}
              <div className="space-y-4">
                
                {/* Simulated Quest queue item */}
                <div className="rounded-xl border border-edge bg-surface-1/40 p-3.5 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg font-bold">🧠 AI Social Media App</span>
                    <span className="text-purple font-mono font-bold">ICE: 8.4</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden border border-edge/60">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple to-purple-soft" style={{ width: '84%' }} />
                  </div>
                  <p className="text-[10px] text-fg-2 leading-normal">
                    AI agent generating marketing copy and cross-posting automatically.
                  </p>
                </div>

                {/* Simulated attachments lists */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-edge bg-surface-2 p-2.5 shadow-card flex items-center gap-2">
                    <ImageIcon size={13} className="text-purple" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-fg font-bold truncate">logo_idea.svg</p>
                      <p className="text-[8px] text-fg-3">420 KB</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-edge bg-surface-2 p-2.5 shadow-card flex items-center gap-2">
                    <FileText size={13} className="text-blue" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-fg font-bold truncate">prd_draft.pdf</p>
                      <p className="text-[8px] text-fg-3">1.8 MB</p>
                    </div>
                  </div>
                </div>

                {/* Simulated live telemetry log */}
                <div className="rounded-xl border border-edge/60 bg-surface-0/60 p-3 space-y-1.5 font-mono text-[9px] text-fg-3">
                  <div className="flex items-center gap-1.5 text-fg-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple animate-ping" />
                    <span>SYSTEM ONLINE</span>
                  </div>
                  <p className="truncate"><span className="text-purple">►</span> AI PRD generator compiling...</p>
                  <p className="truncate"><span className="text-blue">►</span> Mapped 3 competitor specifications</p>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES GRID SECTION ================= */}
      <section id="features" className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
        <motion.div 
          className="text-center space-y-3 max-w-2xl mx-auto mb-16"
          {...fadeInUpProps}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple/30 bg-purple/5 text-purple text-[11px] font-bold uppercase tracking-wider">
            <Layers size={11} />
            Fully Integrated SaaS Features
          </div>
          <h2 className="text-3xl font-extrabold text-fg sm:text-4xl">
            Intelligent building features.
          </h2>
          <p className="text-sm text-fg-2 leading-relaxed">
            Brainbank houses all research, AI copy, prioritization lists, and asset uploads in one extremely responsive single-page panel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((item, idx) => (
            <motion.div 
              key={item.title} 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.45, ease: "easeOut" }}
              className="group p-5 rounded-2xl border border-edge bg-surface-2/40 backdrop-blur-sm shadow-card flex flex-col justify-between hover:border-edge-light hover:bg-surface-2/80 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-surface-0 border border-edge flex items-center justify-center text-fg">
                  <item.icon size={18} className="text-purple" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-fg uppercase tracking-wider">{item.title}</h3>
                  <p className="text-[11px] text-fg-2 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <span className="text-[8px] font-bold mt-4 px-2 py-0.5 rounded border border-edge bg-surface-0 text-fg-3 w-max uppercase">
                {item.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= RESEARCH WORKFLOW SECTION ================= */}
      <section id="workflow" className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-edge/60 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <motion.div 
            className="lg:col-span-5 space-y-6"
            {...fadeInUpProps}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue/30 bg-blue/5 text-blue text-[11px] font-bold uppercase tracking-wider">
              <Search size={11} />
              Intelligent Research Pipeline
            </div>
            <h2 className="text-3xl font-extrabold text-fg sm:text-4xl leading-tight">
              Validate ideas systematically.
            </h2>
            <p className="text-sm text-fg-2 leading-relaxed">
              Researching is an execution quest, not an afterthought. Brainbank guides you through a strict startup validation funnel to ensure your concepts hold weight.
            </p>

            {/* Checklists indicator mockup */}
            <div className="space-y-3 pt-2">
              {[
                "Scope core competitors and identify unique angles.",
                "Detail platforms, launch stages, and target users.",
                "Generate fully actionable specification roadmaps."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-fg-2 font-medium">
                  <CheckCircle2 size={14} className="text-purple mt-0.5 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Workflow Cards */}
          <div className="lg:col-span-7 w-full space-y-3">
            {[
              { id: "01", step: "Idea Capture", desc: "Instantly draft raw titles and description templates.", active: true },
              { id: "02", step: "Competitor Research", desc: "Map rival products and specify your market angle.", active: false },
              { id: "03", step: "Market Validation", desc: "Analyze launch platform demands and target models.", active: false },
              { id: "04", step: "Monetization Strategy", desc: "Formulate freemium or premium business blueprints.", active: false },
              { id: "05", step: "Feature Planning & Build", desc: "Draft high-fidelity AI specifications and ship.", active: false }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                  step.active 
                    ? 'border-purple/40 bg-purple/5 shadow-md animate-pulse' 
                    : 'border-edge bg-surface-2/30 opacity-75 hover:opacity-100 hover:border-edge-light'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    step.active ? 'bg-purple/20 text-purple' : 'bg-surface-3 text-fg-3'
                  }`}>
                    {step.id}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-fg uppercase tracking-wider">{step.step}</h4>
                    <p className="text-[10px] text-fg-2 mt-1">{step.desc}</p>
                  </div>
                </div>
                {step.active && (
                  <span className="text-[9px] font-bold text-purple uppercase tracking-wider flex items-center gap-1 shrink-0">
                    Active Step <ChevronRight size={10} className="animate-ping" />
                  </span>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= UPLOAD & MEDIA MANAGEMENT SECTION ================= */}
      <section className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-edge/60 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Interactive Simulator Card */}
          <motion.div 
            className="lg:col-span-6 w-full"
            {...fadeInUpProps}
          >
            <div className="rounded-3xl border border-edge bg-surface-2/60 p-6 shadow-elevated backdrop-blur-xl space-y-5">
              
              {/* Interactive simulated drop surface */}
              <div 
                onClick={startUploadSimulation}
                className={`relative overflow-hidden rounded-2xl border border-dashed border-edge bg-surface-1/45 p-6 text-center cursor-pointer transition-all duration-300 hover:border-purple/40 hover:bg-surface-1/70`}
              >
                <UploadCloud size={28} className="mx-auto mb-2 text-purple animate-bounce" />
                <p className="text-xs font-bold text-fg">Simulate Drag & Drop Upload</p>
                <p className="text-[10px] text-fg-3 mt-1">Accepts UI screenshots, Logos, and PDFs</p>
                <button 
                  type="button" 
                  className="mt-3.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-edge text-[10px] text-fg-2 font-bold hover:bg-surface-1 transition-colors"
                >
                  Browse Files
                </button>
              </div>

              {/* Simulated files uploaded queue */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-fg-3 uppercase tracking-wider">Asset Queue</p>
                {simulatedFiles.map((file, idx) => (
                  <div key={idx} className="rounded-xl border border-edge bg-surface-1/40 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-surface-2 border border-edge text-fg-2 shrink-0">
                        {file.type === 'pdf' ? <FileText size={13} className="text-rose" /> : <ImageIcon size={13} className="text-purple" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-fg truncate leading-none mb-1">{file.name}</p>
                        <p className="text-[9px] text-fg-3 leading-none">{file.size}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {file.progress < 100 ? (
                        <span className="text-[10px] font-mono text-purple font-bold animate-pulse">{file.progress}%</span>
                      ) : (
                        <div className="flex items-center gap-1 text-[9px] text-fg-3 font-bold">
                          <CheckCircle2 size={11} className="text-green" />
                          <span>Stored</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>

          {/* Right Text */}
          <motion.div 
            className="lg:col-span-6 space-y-6 text-left"
            {...fadeInUpProps}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose/30 bg-rose/5 text-rose text-[11px] font-bold uppercase tracking-wider">
              <UploadCloud size={11} />
              Cloud Asset Storage
            </div>
            <h2 className="text-3xl font-extrabold text-fg sm:text-4xl leading-tight">
              A unified vault for startup artifacts.
            </h2>
            <p className="text-sm text-fg-2 leading-relaxed">
              Never search through emails or download folders for product specs again. Upload and centralize landing layout references, vectorized SVG logos, competitor decks, and PRDs alongside your execution dashboard.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {["Screenshots", "Research PDFs", "SVG Logos", "Wireframe Mockups"].map(badge => (
                <span key={badge} className="text-[10px] font-bold px-3 py-1 rounded-full border border-edge bg-surface-2 text-fg-3 uppercase tracking-wide">
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= AI PRD GENERATOR SECTION ================= */}
      <section className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-edge/60 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <motion.div 
            className="lg:col-span-5 space-y-6 text-left"
            {...fadeInUpProps}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple/30 bg-purple/5 text-purple text-[11px] font-bold uppercase tracking-wider">
              <Cpu size={11} className="text-purple" />
              AI Spec Synthesizer
            </div>
            <h2 className="text-3xl font-extrabold text-fg sm:text-4xl leading-tight">
              Generate complete PRDs instantly with AI.
            </h2>
            <p className="text-sm text-fg-2 leading-relaxed">
              Draft comprehensive Product Requirement Documents on the fly. Let LLM pipelines suggest full problem statements, target audiences, MVP scope, suggested monetization streams, and robust tech-stack recommendations.
            </p>

            <div className="rounded-2xl border border-edge bg-surface-2/60 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-purple animate-spin" />
                <span className="text-xs font-bold text-fg">Instant AI deliverables</span>
              </div>
              <p className="text-xs text-fg-2 leading-relaxed">
                All generated spec sheets are completely editable right in the dashboard panel so you retain absolute product ownership.
              </p>
            </div>
          </motion.div>

          {/* Right Visual Terminal Panel */}
          <motion.div 
            className="lg:col-span-7 w-full"
            {...fadeInUpProps}
          >
            <div className="rounded-3xl border border-edge bg-surface-2/60 overflow-hidden shadow-elevated backdrop-blur-xl">
              
              {/* Terminal header */}
              <div className="bg-surface-3 border-b border-edge px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green" />
                </div>
                <span className="text-[10px] font-mono text-fg-3">brainbank-prd-synthesizer.sh</span>
                <span className="w-8 h-2" />
              </div>

              {/* Terminal body */}
              <div className="p-6 font-mono text-xs text-fg-2 space-y-4 max-h-[360px] overflow-y-auto bg-surface-0/60">
                <div className="space-y-1">
                  <p className="text-fg-3"># Initializing LLM specification builder...</p>
                  <p className="text-fg">$ compile --title "FounderOS" --type "web-app"</p>
                </div>

                <div className="space-y-2 border-l-2 border-purple/40 pl-3">
                  <p className="text-purple font-bold">1. PROBLEM STATEMENT</p>
                  <p className="text-[11px] text-fg-3 leading-relaxed">
                    Founders struggle to centralize visual research, PRDs, task pipelines, and dynamic prioritization indexes in a single workspace, leading to fragmented execution pipelines.
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-blue/40 pl-3">
                  <p className="text-blue font-bold">2. CORE MVP SCOPE</p>
                  <p className="text-[11px] text-fg-3 leading-relaxed">
                    Stateless dashboard panel scoping custom project kanbans, Cloudinary logo/PDF files upload, ICE matrix score tracking, and automated AI specifications generation.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-fg-3"># Generating monetization suggested matrices...</p>
                  <p className="text-green font-bold">► Blueprints completed successfully. Level +1 (Earned 10 XP)</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= TODO & BUILD TRACKING SECTION ================= */}
      <section className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-edge/60 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Kanban Task Cards */}
          <div className="lg:col-span-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Mock active task card */}
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.45, ease: "easeOut" }}
                className="p-5 rounded-2xl border border-edge bg-surface-2/60 backdrop-blur-sm space-y-4 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple/10 border border-purple/20 text-purple uppercase">Active Build</span>
                  <span className="text-[10px] font-mono text-fg-3">#42</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-fg uppercase tracking-wider">Integrate API Gateway</h4>
                  <p className="text-[10px] text-fg-2 mt-1">Enable secure auth middleware scoping</p>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden border border-edge/60">
                  <div className="h-full rounded-full bg-purple" style={{ width: '75%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-fg-2 font-medium">
                  <span className="flex items-center gap-1"><CheckSquare size={10} className="text-green" /> 3/4 Complete</span>
                  <span>75%</span>
                </div>
              </motion.div>

              {/* Mock queue card */}
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
                className="p-5 rounded-2xl border border-edge bg-surface-2/60 backdrop-blur-sm space-y-4 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber/10 border border-amber/20 text-amber uppercase">Queued</span>
                  <span className="text-[10px] font-mono text-fg-3">#43</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-fg uppercase tracking-wider">Cloudinary Destruction</h4>
                  <p className="text-[10px] text-fg-2 mt-1">Configure asset uploader deletions</p>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden border border-edge/60">
                  <div className="h-full rounded-full bg-amber" style={{ width: '20%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-fg-2 font-medium">
                  <span className="flex items-center gap-1"><CheckSquare size={10} className="text-fg-3" /> 1/5 Complete</span>
                  <span>20%</span>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Right Text */}
          <motion.div 
            className="lg:col-span-6 space-y-6 text-left"
            {...fadeInUpProps}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-green/30 bg-green/5 text-green text-[11px] font-bold uppercase tracking-wider">
              <CheckSquare size={11} />
              Build & Execution Tracking
            </div>
            <h2 className="text-3xl font-extrabold text-fg sm:text-4xl leading-tight">
              Maintain speed. BrainBank helps you ship.
            </h2>
            <p className="text-sm text-fg-2 leading-relaxed">
              Ideas are useless without execution. Keep your priorities structured on local task cards. Brainbank scopes progress bars, priority indexes, and gamified levels so you retain high-speed build momentum.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple animate-ping shrink-0" />
              <p className="text-xs text-fg-2 font-semibold uppercase tracking-wider">Complete milestones, level up, and launch.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= BRAINBANK WORKFLOW TIMELINE ================= */}
      <section className="min-h-[75vh] flex flex-col justify-center max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-edge/60 scroll-mt-20">
        <motion.div 
          className="text-center space-y-3 max-w-2xl mx-auto mb-20"
          {...fadeInUpProps}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple/30 bg-purple/5 text-purple text-[11px] font-bold uppercase tracking-wider">
            <Rocket size={11} />
            Operating funnels
          </div>
          <h2 className="text-3xl font-extrabold text-fg sm:text-4xl">
            The signature workflow pipeline.
          </h2>
          <p className="text-sm text-fg-2 leading-relaxed">
            Move from abstract thought to completed execution using the strict five-step operational pipeline.
          </p>
        </motion.div>

        {/* Desktop timeline connector layout */}
        <div className="hidden md:flex items-stretch justify-between gap-4 relative w-full pt-8">
          <div className="absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-purple via-purple-soft to-green/40 z-0" />
          
          {TIMELINE_STAGES.map((stage, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
              className="flex-1 text-center space-y-4 z-10"
            >
              <div className={`h-11 w-11 rounded-2xl bg-surface-2 border border-edge shadow-md mx-auto flex items-center justify-center ${stage.glow}`}>
                <stage.icon size={16} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-fg uppercase tracking-wider">{stage.name}</h4>
                <p className="text-[10px] text-fg-3 max-w-[140px] mx-auto leading-relaxed">{stage.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile vertical timeline connectors layout */}
        <div className="flex md:hidden flex-col gap-8 items-center w-full pt-4">
          {TIMELINE_STAGES.map((stage, idx) => (
            <div key={idx} className="text-center space-y-3 flex flex-col items-center">
              <div className={`h-11 w-11 rounded-2xl bg-surface-2 border border-edge shadow-md flex items-center justify-center ${stage.glow}`}>
                <stage.icon size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-fg uppercase tracking-wider">{stage.name}</h4>
                <p className="text-[10px] text-fg-3 max-w-[200px] leading-relaxed">{stage.desc}</p>
              </div>
              {idx < TIMELINE_STAGES.length - 1 && (
                <ArrowDown size={14} className="text-fg-3 animate-bounce pt-2" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section id="pricing" className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-zinc-950 py-24 border-y border-zinc-900 scroll-mt-20 overflow-hidden text-zinc-100 flex flex-col justify-center items-center">
        
        {/* Cinematic dark theme mesh glow backdrops */}
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-purple/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[20%] w-[50%] h-[40%] rounded-full bg-purple-soft/5 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a04_1px,transparent_1px),linear-gradient(to_bottom,#27272a08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 w-full relative z-10">
          <motion.div 
            className="text-center space-y-3 max-w-2xl mx-auto mb-20"
            {...fadeInUpProps}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple/30 bg-purple/5 text-purple text-[11px] font-bold uppercase tracking-wider">
              <DollarSign size={11} />
              Subscription Tiers
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Sleek pricing. Simple options.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Choose the best plan to scope your startup quests. Start for free and upgrade as your projects scale.
            </p>
          </motion.div>

          {/* 3-Column Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full max-w-5xl mx-auto">
            
            {/* PLAN 1 - FREE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.5, ease: "easeOut" }}
              className="relative rounded-3xl border border-zinc-900 bg-zinc-950/40 p-6 lg:p-7 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-zinc-800/80 hover:bg-zinc-900/20"
            >
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 id="5jlwm8" className="text-xl font-black text-white">Free</h3>
                  <p id="2mjlwm" className="text-[11px] text-zinc-400 leading-relaxed">Perfect for storing and testing startup ideas.</p>
                </div>

                <div id="7jlwm2" className="flex items-baseline gap-1 pt-1 text-white">
                  <span className="text-3xl font-extrabold">₹0</span>
                  <span className="text-xs font-semibold text-zinc-500"> / month</span>
                </div>

                <div className="border-t border-zinc-900/60 my-1" />

                {/* Visual Limit Indicator */}
                <div className="px-2.5 py-2 rounded-lg bg-zinc-900/40 border border-zinc-900 space-y-1">
                  <div className="flex justify-between text-[9px] text-zinc-400 font-medium">
                    <span className="flex items-center gap-1"><Sparkles size={9} className="text-purple" /> Daily AI Requests</span>
                    <span>2 / 10 used</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple" style={{ width: '20%' }} />
                  </div>
                </div>

                {/* Compact Unified Features list */}
                <ul className="space-y-2.5 text-xs font-medium pl-0.5">
                  <li className="flex items-start gap-2.5 text-zinc-300">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>Up to 5 active ideas</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-300">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>10 AI requests/day (Basic PRD)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-300">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>Limited AI chatbot access</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-300">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>Up to 5 uploads total (5MB limit)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-300">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>Basic research & todo tracking</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-600">
                    <span className="text-zinc-700 shrink-0 text-xs mt-0.5 leading-none">❌</span>
                    <span className="line-through text-zinc-500">No advanced AI workflows</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={scrollToAuth}
                id="vjlwm7"
                className="w-full py-2.5 rounded-xl font-bold text-xs mt-6 transition-all active:scale-[0.98] shadow-md cursor-pointer bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-800 text-zinc-300 hover:from-zinc-800 hover:to-zinc-700 hover:text-white"
              >
                Start Free
              </button>
            </motion.div>

            {/* PLAN 2 - PRO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="relative rounded-3xl border border-purple/30 bg-zinc-950/50 p-6 lg:p-7 flex flex-col justify-between shadow-[0_0_30px_rgba(147,51,234,0.05)] transition-all duration-300 hover:scale-[1.01] hover:border-purple/50 hover:bg-zinc-900/30"
            >
              <span id="pkjlwm" className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-purple text-white text-[9px] font-black uppercase tracking-wider shadow-md z-20">
                MOST POPULAR
              </span>

              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 id="e4jlwm" className="text-lg font-black text-white">Pro</h3>
                  <p id="mjlwm3" className="text-[11px] text-zinc-400 leading-relaxed">Built for founders actively validating and building products.</p>
                </div>

                <div id="zjlwm4" className="flex items-baseline gap-1 pt-1 text-white">
                  <span className="text-3xl font-extrabold">₹9</span>
                  <span className="text-xs font-semibold text-zinc-500"> / month</span>
                </div>

                <div className="border-t border-zinc-900/60 my-1" />

                {/* Visual Limit Indicator */}
                <div className="px-2.5 py-2 rounded-lg bg-zinc-900/40 border border-zinc-900 space-y-1">
                  <div className="flex justify-between text-[9px] text-zinc-400 font-medium">
                    <span className="flex items-center gap-1"><Sparkles size={9} className="text-purple animate-pulse" /> Daily AI Requests</span>
                    <span>42 / 100 used</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple" style={{ width: '42%' }} />
                  </div>
                </div>

                {/* Compact Unified Features list */}
                <ul className="space-y-2.5 text-xs font-medium pl-0.5">
                  <li className="flex items-start gap-2.5 text-zinc-200">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>Up to 12 active startup ideas</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-200">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>100 AI requests/day (Enhanced PRD)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-200">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>AI chatbot assistant & Suggestions</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-200">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>Up to 50 uploads (15MB limit)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-200">
                    <CheckCircle2 size={13} className="text-purple mt-0.5 shrink-0" />
                    <span>Cloud media storage & PDF exports</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-zinc-600">
                    <span className="text-zinc-700 shrink-0 text-xs mt-0.5 leading-none">❌</span>
                    <span className="line-through text-zinc-500">No unlimited uploads</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={scrollToAuth}
                id="jlwm9a"
                className="w-full py-2.5 rounded-xl font-bold text-xs mt-6 transition-all active:scale-[0.98] shadow-md shadow-purple/10 hover:shadow-purple/20 cursor-pointer bg-gradient-to-r from-purple to-purple-soft hover:from-purple-deep hover:to-purple text-white"
              >
                Upgrade to Pro
              </button>
            </motion.div>

            {/* PLAN 3 - ULTRA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
              className="relative rounded-3xl border border-purple-soft/45 bg-zinc-900/20 p-6 lg:p-7 flex flex-col justify-between shadow-[0_0_35px_rgba(168,85,247,0.1)] scale-[1.01] md:scale-[1.02] lg:scale-[1.03] transition-all duration-300 hover:scale-[1.02] md:hover:scale-[1.03] lg:hover:scale-[1.04] hover:border-purple-soft/60 hover:bg-zinc-900/35 hover:shadow-[0_0_45px_rgba(251,146,60,0.12)]"
            >
              <span id="jjlwm5" className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-soft via-purple to-orange-400 text-white text-[9px] font-black uppercase tracking-wider shadow-lg z-20">
                BEST VALUE
              </span>

              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 id="rjlwm8" className="text-lg font-black text-white flex items-center gap-1.5">
                    Ultra <Crown size={14} className="text-purple-soft animate-bounce" />
                  </h3>
                  <p id="6jlwm1" className="text-[11px] text-zinc-300 leading-relaxed">The complete AI founder operating system for serious builders.</p>
                </div>

                <div id="4jlwm0" className="flex items-baseline gap-1 pt-1 text-white">
                  <span className="text-3xl font-extrabold">₹99</span>
                  <span className="text-xs font-semibold text-zinc-400"> / month</span>
                </div>

                <div className="border-t border-zinc-850 my-1" />

                {/* Visual Limit Indicator */}
                <div className="px-2.5 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <div className="flex justify-between text-[9px] text-zinc-300 font-semibold">
                    <span className="flex items-center gap-1"><Sparkles size={9} className="text-purple-soft animate-spin" /> Daily AI Requests</span>
                    <span className="text-purple-soft flex items-center gap-0.5 animate-pulse">112 / 1,000 used</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple via-purple-soft to-orange-400" style={{ width: '11.2%' }} />
                  </div>
                </div>

                {/* Compact Unified Features list */}
                <ul className="space-y-2.5 text-xs font-medium pl-0.5">
                  <li className="flex items-start gap-2.5 text-white">
                    <CheckCircle2 size={13} className="text-purple-soft mt-0.5 shrink-0" />
                    <span>Up to 100 active startup ideas</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white">
                    <CheckCircle2 size={13} className="text-purple-soft mt-0.5 shrink-0" />
                    <span>1,000 AI requests/day (Priority queue)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white">
                    <CheckCircle2 size={13} className="text-purple-soft mt-0.5 shrink-0" />
                    <span>AI breakdowns, roadmaps & tasking</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white">
                    <CheckCircle2 size={13} className="text-purple-soft mt-0.5 shrink-0" />
                    <span>Up to 500 uploads (100MB limit per file)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white">
                    <CheckCircle2 size={13} className="text-purple-soft mt-0.5 shrink-0" />
                    <span>Premium branding, logo & UI boards cloud</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white">
                    <CheckCircle2 size={13} className="text-purple-soft mt-0.5 shrink-0" />
                    <span>Advanced analytics, processing & exports</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={scrollToAuth}
                id="jlwm0u"
                className="w-full py-2.5 rounded-xl font-bold text-xs mt-6 transition-all active:scale-[0.98] shadow-lg shadow-purple-soft/10 hover:shadow-purple-soft/20 cursor-pointer bg-gradient-to-r from-purple-soft via-purple to-orange-400 text-white hover:from-purple hover:via-purple-soft hover:to-orange-400"
              >
                Unlock Ultra
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section id="reviews" className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-edge/60 scroll-mt-20">
        <motion.div 
          className="text-center space-y-3 max-w-2xl mx-auto mb-16"
          {...fadeInUpProps}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-soft/30 bg-purple-soft/5 text-purple-soft text-[11px] font-bold uppercase tracking-wider">
            <MessageSquare size={11} />
            Founder Testimonials
          </div>
          <h2 className="text-3xl font-extrabold text-fg sm:text-4xl">
            Loved by builders like you.
          </h2>
          <p className="text-sm text-fg-2 leading-relaxed">
            See how entrepreneurs and makers are utilizing Brainbank to organize their building quest pipeline.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {REVIEWS.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col justify-between p-6 rounded-2xl border border-edge bg-surface-2/40 backdrop-blur-sm shadow-card hover:border-edge-light transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-0.5 text-amber">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-amber" />
                  ))}
                </div>
                <p className="text-xs text-fg-2 leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-edge/60 mt-6">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-9 h-9 rounded-full object-cover border border-purple/20 shrink-0" 
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-fg truncate">{item.name}</p>
                  <p className="text-[10px] text-fg-3 truncate">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION / AUTH GATED SECTION ================= */}
      <section id="auth-section" className="min-h-[65vh] flex items-center justify-center max-w-lg mx-auto px-6 py-12 scroll-mt-20">
        <motion.div 
          className="w-full rounded-3xl border border-edge bg-surface-2/60 p-8 sm:p-10 backdrop-blur-xl shadow-elevated text-center space-y-6 relative overflow-hidden"
          {...fadeInUpProps}
        >
          {/* Subtle Glows */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-purple/5 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-purple-soft/5 rounded-full blur-xl pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-3">
            <div className="inline-flex h-11 w-11 rounded-2xl bg-gradient-to-tr from-purple via-purple-soft to-green flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple/20 mx-auto">
              <Crown size={18} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-fg">Ready to build your next venture?</h2>
            <p className="text-xs text-fg-2 leading-relaxed">
              Join founders mapping out concepts, generating rich specs, and earning building XP on Brainbank. Sign in now to sync your quest.
            </p>
          </div>

          {/* Premium Feature Micro-Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 py-1 text-[9px] text-fg-3 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-0 border border-edge/60">
              <Sparkles size={10} className="text-purple animate-pulse" />
              <span>AI Specs</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-0 border border-edge/60">
              <ImageIcon size={10} className="text-blue" />
              <span>Asset Vault</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-0 border border-edge/60">
              <CheckSquare size={10} className="text-green" />
              <span>ICE Quests</span>
            </span>
          </div>

          <div className="max-w-xs mx-auto space-y-4 pt-2">
            {/* Pure Clean Google Login Button matching Premium Warm Theme UI */}
            <div className="flex justify-center w-full max-w-[280px] mx-auto shadow-sm rounded-full overflow-hidden border border-edge/60 bg-white hover:border-purple/40 hover:shadow-md transition-all duration-300">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast('Google Sign-In was cancelled or failed.', 'error')}
                theme="outline"
                size="large"
                text="continue_with"
                shape="pill"
                width="280px"
              />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-fg-3 font-semibold pt-1">
              <Lock size={9} className="text-purple" />
              <span>Secure stateless Google OAuth 2.0 validation</span>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-xs text-fg-2 animate-pulse">
                <LogIn size={12} className="animate-bounce text-purple" />
                Synchronizing founder dashboard...
              </div>
            )}

            {authError && (
              <div className="text-xs text-rose bg-rose/10 border border-rose/20 rounded-xl p-3 text-center leading-relaxed font-semibold">
                ⚠️ {authError}
              </div>
            )}
          </div>

          {/* Setup tips */}
          <div className="text-[10px] text-fg-3 flex items-center justify-center gap-1.5 pt-2 border-t border-edge/40">
            <ShieldCheck size={12} className="text-purple" />
            <span>Developer credentials configured and verified</span>
          </div>

        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="max-w-6xl mx-auto px-6 py-4 border-t border-edge/60 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-fg-3">
        <div className="w-10 sm:w-20" />
        <div className="text-center sm:translate-x-12">
          © {new Date().getFullYear()} Brainbank OS. Shape your thoughts, build your future. Made for indie builders.
        </div>
        <div>
          <a 
            href="https://github.com/sumitc0de" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 hover:text-purple font-bold transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span>Created by @sumitc0de</span>
          </a>
        </div>
      </footer>

    </div>
  );
}
