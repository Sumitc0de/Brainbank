import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { 
  Sparkles, Terminal, LogIn, Cpu, Award, HelpCircle, Crown, 
  Star, Layers, CheckCircle2, ChevronRight, MessageSquare,
  ShieldCheck, Zap, Lock, DollarSign
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

// Animation presets
const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LoginView() {
  const { loginWithGoogle, loading, error: authError } = useAuthStore();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast('Welcome to Brainbank!', 'success');
    } catch (err) {
      toast(err.message || 'Google authentication failed.', 'error');
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
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden select-none font-sans text-fg pb-16 scroll-smooth"
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
            <a href="#pricing" className="hover:text-purple transition-colors">Pricing</a>
            <a href="#reviews" className="hover:text-purple transition-colors">Reviews</a>
          </nav>

          <button 
            type="button"
            onClick={scrollToAuth}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple hover:bg-purple-deep text-white font-bold text-xs shadow-md transition-colors cursor-pointer animate-pulse-glow"
          >
            <LogIn size={12} />
            Start Building
          </button>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-[90vh] flex items-center max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Side Info */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
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
              Brainbank is the ultimate gamified workspace for serious founders. Structure startup ideas, prioritize pipelines with ICE analysis, generate complete AI PRDs, and level up your launcher profile.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="button"
                onClick={scrollToAuth}
                className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-purple hover:bg-purple-deep text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Get Started Free
                <ChevronRight size={16} />
              </button>
              <a 
                href="#features" 
                className="px-5 py-3.5 rounded-xl border border-edge bg-surface-2/60 hover:bg-surface-3/60 text-fg-2 hover:text-fg font-bold text-sm transition-all shadow-card"
              >
                Explore Features
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs font-semibold text-fg-3">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green" /> Free developer tier</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green" /> Immediate AI deliverables</span>
            </div>
          </motion.div>

          {/* Right Side Visual Mockup (Interactive gamified level preview card) */}
          <motion.div 
            className="lg:col-span-5 w-full flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative w-full max-w-sm rounded-3xl border border-edge bg-surface-2/80 p-6 shadow-elevated backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-edge/60">
                <div className="flex items-center gap-2">
                  <Crown size={15} className="text-purple animate-pulse" />
                  <span className="text-xs font-bold text-fg">Startup Dashboard</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-green/10 border border-green/20 text-green font-bold uppercase">Online</span>
              </div>

              {/* Level status progress bar mockup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-fg">Level 4: Builder</h4>
                    <p className="text-[10px] text-fg-3">Active Quest pipeline</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-purple font-bold flex items-center gap-1"><Zap size={11} /> 350 XP</span>
                  </div>
                </div>

                {/* Mock progress bar */}
                <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden border border-edge/40">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple via-purple-soft to-green" style={{ width: '65%' }} />
                </div>

                {/* Project metrics */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-edge bg-surface-0/60 p-3 shadow-card">
                    <p className="text-[10px] text-fg-3">Active Ideas</p>
                    <p className="text-lg font-black text-fg mt-0.5">8</p>
                  </div>
                  <div className="rounded-xl border border-edge bg-surface-0/60 p-3 shadow-card">
                    <p className="text-[10px] text-fg-3">PRDs Completed</p>
                    <p className="text-lg font-black text-fg mt-0.5">5</p>
                  </div>
                </div>

                {/* Latest quest log */}
                <div className="rounded-xl border border-edge bg-surface-0/70 p-3 space-y-2 shadow-card">
                  <p className="text-[10px] font-bold text-fg-3 uppercase tracking-wider">Latest Action Logs</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate text-fg font-medium">1. Dynamic ICE Scoring</span>
                    <span className="text-purple font-bold">+5 XP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate text-fg font-medium">2. AI Copilot Drafted Spec</span>
                    <span className="text-purple font-bold">+10 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
        <motion.div 
          className="text-center space-y-3 max-w-2xl mx-auto mb-16"
          {...fadeInUp}
        >
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
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          {FEATURES.map((item) => (
            <motion.div 
              key={item.title} 
              variants={fadeInUp}
              className="flex items-start gap-4 p-5 rounded-2xl border border-edge bg-surface-2/65 backdrop-blur-sm shadow-card transition-all duration-300 hover:border-purple/30 hover:bg-surface-2 hover:scale-[1.01]"
            >
              <div className="p-3 rounded-xl bg-surface-0 border border-edge shrink-0 text-fg">
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
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section id="pricing" className="min-h-[85vh] flex flex-col justify-center max-w-5xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
        <motion.div 
          className="text-center space-y-3 max-w-2xl mx-auto mb-16"
          {...fadeInUp}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-soft/30 bg-purple-soft/10 text-purple-soft text-[11px] font-bold uppercase tracking-wider">
            <DollarSign size={11} />
            Subscription Tiers
          </div>
          <h2 className="text-3xl font-extrabold text-fg sm:text-4xl">
            Sleek pricing. Simple options.
          </h2>
          <p className="text-sm text-fg-3">
            Choose the best plan to scope your quests. Start for free and upgrade as your projects scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          {PRICING_PLANS.map((plan, idx) => (
            <motion.div
              key={idx}
              {...fadeInUp}
              className={`relative rounded-3xl border p-8 flex flex-col justify-between shadow-card backdrop-blur-sm ${
                plan.popular 
                  ? 'border-purple/40 bg-white/70 shadow-elevated scale-[1.02] md:scale-[1.03]' 
                  : 'border-edge bg-surface-2/65'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple to-purple-soft text-white text-[9px] font-black uppercase tracking-wider">
                  Popular Option
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-fg">{plan.name}</h3>
                  <p className="text-xs text-fg-3 mt-1 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-fg">$</span>
                  <span className="text-5xl font-black text-fg leading-none">{plan.price}</span>
                  <span className="text-xs font-semibold text-fg-3">/ month</span>
                </div>

                <ul className="space-y-3 pt-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-fg-2 font-medium">
                      <CheckCircle2 size={14} className="text-green mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={scrollToAuth}
                className={`w-full py-3 rounded-xl font-bold text-xs mt-8 transition-all active:scale-[0.98] shadow-md cursor-pointer ${
                  plan.popular
                    ? 'bg-purple hover:bg-purple-deep text-white'
                    : 'bg-surface-3 hover:bg-surface-4 text-fg border border-edge'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section id="reviews" className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
        <motion.div 
          className="text-center space-y-3 max-w-2xl mx-auto mb-16"
          {...fadeInUp}
        >
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {REVIEWS.map((item, idx) => (
            <motion.div 
              key={idx}
              {...fadeInUp}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col justify-between p-6 rounded-2xl border border-edge bg-surface-2/65 backdrop-blur-sm shadow-card"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-0.5 text-amber">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-fg-2 leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

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
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION / AUTH GATED SECTION ================= */}
      <section id="auth-section" className="min-h-[75vh] flex items-center justify-center max-w-4xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
        <motion.div 
          className="w-full rounded-3xl border border-edge bg-surface-2/80 p-8 sm:p-12 backdrop-blur-xl shadow-elevated text-center space-y-8 relative overflow-hidden"
          {...fadeInUp}
        >
          {/* Subtle Glows */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-purple/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-green/10 rounded-full blur-xl pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-3">
            <div className="inline-flex h-11 w-11 rounded-2xl bg-gradient-to-tr from-purple via-purple-soft to-green flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple/25 mx-auto">
              <Crown size={18} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-fg">Ready to build your next venture?</h2>
            <p className="text-xs text-fg-3">
              Join founders mapping out concepts, generating rich specs, and earning building XP on Brainbank. Sign in now to sync your quest.
            </p>
          </div>

          <div className="max-w-xs mx-auto space-y-4">
            {/* Pure Proper Google Login Button */}
            <div className="flex justify-center w-full shadow-md rounded-full bg-white relative">
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

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-fg-4 font-semibold">
              <Lock size={9} className="text-green" />
              <span>Secure stateless Google OAuth 2.0 validation</span>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-xs text-fg-3 animate-pulse">
                <LogIn size={12} className="animate-bounce text-purple" />
                Synchronizing founder dashboard...
              </div>
            )}

            {authError && (
              <div className="text-xs text-red bg-red/10 border border-red/20 rounded-xl p-3 text-center leading-relaxed">
                ⚠️ {authError}
              </div>
            )}
          </div>

          {/* Setup tips */}
          <div className="text-[10px] text-fg-4 flex items-center justify-center gap-1.5">
            <ShieldCheck size={12} className="text-green" />
            <span>Developer credentials configured and verified</span>
          </div>

        </motion.div>
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
