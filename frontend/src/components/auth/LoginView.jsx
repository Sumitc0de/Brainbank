import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { 
  Sparkles, Terminal, LogIn, Cpu, Award, HelpCircle, Crown, 
  Star, Layers, ShieldCheck, CheckCircle2, ChevronRight, MessageSquare
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { toast } from '../ui/Toast';

const FEATURES = [
  {
    title: "AI PRD Copilot",
    desc: "Draft complete product spec sheets, core features, user pain points, and technology recommendations in seconds with LLM assistance.",
    icon: Cpu,
    color: "text-purple",
    badge: "AI Powered",
  },
  {
    title: "ICE Priority Scoring",
    desc: "Calculate dynamic ICE scores (Impact, Confidence, Ease) combined with skill mappings to instantly rank high-value opportunities.",
    icon: Layers,
    color: "text-purple-soft",
    badge: "Prioritization",
  },
  {
    title: "XP & Leveling System",
    desc: "Earn builder experience points (XP) as you refine specs and complete milestones. Level up from Concept to Unicorn Founder.",
    icon: Award,
    color: "text-green",
    badge: "Gamification",
  },
  {
    title: "Cloud Asset Storage",
    desc: "Securely upload screenshots, UI wireframes, logos, and research PDFs straight to Cloudinary with real-time download parameters.",
    icon: Terminal,
    color: "text-blue",
    badge: "Media Vault",
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

export default function LoginView() {
  const { loginWithGoogle, bypassWithMock, loading, error: authError } = useAuthStore();
  const [showDeveloperBypass, setShowDeveloperBypass] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast('Welcome to Brainbank!', 'success');
    } catch (err) {
      toast(err.message || 'Google authentication failed.', 'error');
    }
  };

  const handleMockBypass = async () => {
    try {
      await bypassWithMock();
      toast('Developer bypass active. Sandbox mode initiated!', 'success');
    } catch (err) {
      toast(err.message || 'Developer bypass failed.', 'error');
    }
  };

  const loginBackgroundStyle = {
    background: `
      linear-gradient(135deg, rgba(255, 247, 223, .96), rgba(255, 241, 209, .92)),
      repeating-linear-gradient(90deg, rgba(45,111,41,.035) 0 1px, transparent 1px 38px),
      repeating-linear-gradient(0deg, rgba(223,32,70,.025) 0 1px, transparent 1px 38px)
    `,
  };

  const scrollToAuth = () => {
    document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden select-none font-sans text-fg pb-16"
      style={loginBackgroundStyle}
    >
      {/* Warm Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple/6 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-soft/6 blur-[120px] pointer-events-none" />
      
      {/* ================= HEADER NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-edge/40 bg-surface-2/72 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-br from-purple via-purple-soft to-green flex items-center justify-center shadow-md">
              <Crown size={14} className="text-white" />
            </div>
            <span className="text-sm font-black text-gradient tracking-tight">Brainbank</span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-fg-2">
            <a href="#features" className="hover:text-purple transition-colors">Features</a>
            <a href="#reviews" className="hover:text-purple transition-colors">Reviews</a>
            <button 
              onClick={() => setShowDeveloperBypass(!showDeveloperBypass)}
              className="hover:text-purple transition-colors text-left flex items-center gap-1"
            >
              🔧 Dev Mode
            </button>
          </nav>

          <button 
            type="button"
            onClick={scrollToAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <LogIn size={12} />
            Sign In
          </button>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Info */}
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple/30 bg-purple/10 text-purple text-xs font-bold uppercase tracking-wider shadow-glow-purple/20">
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
            The Founder OS
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-fg leading-[1.15]">
            Shape your ideas, <br />
            <span className="bg-gradient-to-r from-purple via-purple-soft to-green bg-clip-text text-transparent">
              build your future.
            </span>
          </h1>
          
          <p className="text-fg-2 text-base sm:text-lg max-w-lg leading-relaxed">
            Brainbank is a premium gamified founder workspace. Capture startup thoughts, score them with ICE priority models, draft detailed AI PRDs, and earn developer level milestones on a beautifully responsive dashboard.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button 
              type="button"
              onClick={scrollToAuth}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-purple hover:bg-purple-deep text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Start Your Build Quest
              <ChevronRight size={16} />
            </button>
            <a 
              href="#features" 
              className="px-5 py-3 rounded-xl border border-edge bg-surface-2/60 hover:bg-surface-3/60 text-fg-2 hover:text-fg font-bold text-sm transition-all shadow-card"
            >
              Explore Features
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs font-semibold text-fg-3">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green" /> Free developer tier</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green" /> Immediate AI deliverables</span>
          </div>
        </div>

        {/* Right Side Glass Auth Card */}
        <div id="auth-section" className="md:col-span-5 w-full scroll-mt-24">
          <div className="w-full rounded-3xl border border-edge bg-surface-2/85 p-6 sm:p-8 backdrop-blur-xl shadow-elevated space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-purple via-purple-soft to-green mx-auto flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple/25">
                <Crown size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-fg pt-1">Sync Your Workspace</h2>
              <p className="text-xs text-fg-3">Sign in securely with Google to load your developer level</p>
            </div>

            {/* Auth Actions */}
            <div className="space-y-4 pt-1">
              
              {/* Proper Clean Google Login Button */}
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast('Google Sign-In was cancelled or failed.', 'error')}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="pill"
                  width="320px"
                />
              </div>

              {/* Developer Bypass Option */}
              {showDeveloperBypass && (
                <div className="space-y-3 pt-2">
                  <div className="relative flex items-center justify-center py-2 text-xs">
                    <span className="absolute inset-x-0 h-px bg-edge" />
                    <span className="relative px-3 bg-surface-2 text-fg-3 font-semibold text-[10px] uppercase tracking-wider">Dev Mode Bypass</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleMockBypass}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-edge bg-surface-1 hover:bg-surface-3 text-fg font-bold text-xs cursor-pointer shadow-card transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Terminal size={14} className="text-purple-soft animate-pulse" />
                    Bypass Mock Login (Developer)
                  </button>

                  <p className="text-[10px] text-fg-4 text-center leading-relaxed">
                    🔧 Developer option allows testing database mapping, JWT handling, and attachments on local environments without Google Client credentials.
                  </p>
                </div>
              )}

              {/* Loader */}
              {loading && (
                <div className="flex items-center justify-center gap-2 text-xs text-fg-3 animate-pulse">
                  <LogIn size={12} className="animate-bounce text-purple" />
                  Verifying account credentials...
                </div>
              )}

              {/* Auth error feedback */}
              {authError && (
                <div className="text-xs text-red bg-red/10 border border-red/20 rounded-xl p-3 text-center leading-relaxed">
                  ⚠️ {authError}
                </div>
              )}
            </div>

            {/* Footer help */}
            <div className="border-t border-edge pt-4 text-center">
              <span 
                onClick={() => toast('Ensure VITE_GOOGLE_CLIENT_ID (frontend) and GOOGLE_CLIENT_ID (backend) match your Google Cloud Console Client credentials.', 'info')}
                className="inline-flex items-center gap-1.5 text-[9px] text-fg-4 hover:text-purple cursor-pointer"
              >
                <HelpCircle size={10} />
                Need help setting up Google Client IDs?
              </span>
            </div>

          </div>
        </div>

      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 scroll-mt-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-green/30 bg-green/10 text-green text-[11px] font-bold uppercase tracking-wider">
            <Layers size={11} />
            Fully Integrated Features
          </div>
          <h2 className="text-3xl font-extrabold text-fg sm:text-4xl">
            Everything you need to ship.
          </h2>
          <p className="text-sm text-fg-3">
            Say goodbye to disorganized spreadsheets. Brainbank integrates idea validation, priority analysis, documentation, and cloud resources in one beautifully cohesive flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((item) => (
            <div 
              key={item.title} 
              className="flex items-start gap-4 p-5 rounded-2xl border border-edge bg-surface-2/65 backdrop-blur-sm shadow-card transition-all duration-300 hover:border-purple/30 hover:bg-surface-2"
            >
              <div className={`p-3 rounded-xl bg-surface-0 border border-edge shrink-0 text-fg`}>
                <item.icon size={20} className={item.color} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-fg">{item.title}</h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md border border-edge bg-surface-3/30 text-fg-3 uppercase">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-fg-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section id="reviews" className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 scroll-mt-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-soft/30 bg-purple-soft/10 text-purple-soft text-[11px] font-bold uppercase tracking-wider">
            <MessageSquare size={11} />
            Founder Testimonials
          </div>
          <h2 className="text-3xl font-extrabold text-fg sm:text-4xl">
            Loved by builders like you.
          </h2>
          <p className="text-sm text-fg-3">
            See how entrepreneurs and makers are utilizing Brainbank to organize their building quest pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((item, idx) => (
            <div 
              key={idx}
              className="flex flex-col justify-between p-6 rounded-2xl border border-edge bg-surface-2/65 backdrop-blur-sm shadow-card"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-fg-2 leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              {/* User Profiling */}
              <div className="flex items-center gap-3 pt-6 border-t border-edge/40 mt-6">
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
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="max-w-6xl mx-auto px-6 pt-24 border-t border-edge/60 mt-24 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple via-purple-soft to-green flex items-center justify-center">
            <Crown size={11} className="text-white" />
          </div>
          <span className="text-xs font-black text-gradient tracking-tight">Brainbank</span>
        </div>
        <p className="text-[10px] text-fg-4">
          © {new Date().getFullYear()} Brainbank OS. Shape your thoughts, build your future. Made for indie builders.
        </p>
      </footer>

    </div>
  );
}
