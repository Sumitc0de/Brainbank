import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Sparkles, Terminal, LogIn, Cpu, Award, HelpCircle, Crown } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { toast } from '../ui/Toast';

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

  // Duplicate the exact beautiful warm gamified grid background used in the app body
  const loginBackgroundStyle = {
    background: `
      linear-gradient(135deg, rgba(255, 247, 223, .96), rgba(255, 241, 209, .92)),
      repeating-linear-gradient(90deg, rgba(45,111,41,.035) 0 1px, transparent 1px 38px),
      repeating-linear-gradient(0deg, rgba(223,32,70,.025) 0 1px, transparent 1px 38px)
    `,
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 select-none font-sans"
      style={loginBackgroundStyle}
    >
      
      {/* Cohesive warm glows matching the sunset theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple/8 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-soft/8 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
      
      {/* Main Container */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 py-12">
        
        {/* Left Branding Side (Wow factor) */}
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple/30 bg-purple/10 text-purple text-xs font-bold uppercase tracking-wider shadow-glow-purple/20">
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
            The Founder OS
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-fg leading-[1.1]">
            Shape your ideas, <br />
            <span className="bg-gradient-to-r from-purple via-purple-soft to-green bg-clip-text text-transparent">
              build your future.
            </span>
          </h1>
          
          <p className="text-fg-2 text-base sm:text-lg max-w-lg leading-relaxed">
            Brainbank is the ultimate gamified workspace for entrepreneurs. Move from concept to validated MVP, draft instant AI-assisted PRDs, prioritize with impact-effort analysis, and level up your startup execution.
          </p>

          {/* Core Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-xl">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-edge bg-surface-2/65 backdrop-blur-sm shadow-card">
              <div className="p-2 rounded-xl bg-purple/10 text-purple shrink-0">
                <Cpu size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-fg">AI PRD Copilot</h4>
                <p className="text-xs text-fg-3 mt-1 leading-relaxed">Instant, structured spec sheets drafted by LLMs.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-edge bg-surface-2/65 backdrop-blur-sm shadow-card">
              <div className="p-2 rounded-xl bg-purple-soft/10 text-purple-soft shrink-0">
                <Award size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-fg">Gamified XP Metrics</h4>
                <p className="text-xs text-fg-3 mt-1 leading-relaxed">Earn experience points as you refine products and close tasks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Auth Card (Glassmorphism card matching light theme) */}
        <div className="md:col-span-5 w-full">
          <div className="w-full rounded-3xl border border-edge bg-surface-2/85 p-6 sm:p-8 backdrop-blur-xl shadow-elevated space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple via-purple-soft to-green mx-auto flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple/25">
                <Crown size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-fg pt-2">Welcome to Brainbank</h2>
              <p className="text-xs text-fg-3">Sign in to sync your dashboard and start building</p>
            </div>

            {/* Auth Actions */}
            <div className="space-y-4 pt-2">
              
              {/* Google Login Provider */}
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
                    <span className="relative px-3 bg-surface-2 text-fg-3 font-semibold text-[11px] uppercase tracking-wider">Or Local Development</span>
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
                    🌟 Select "Bypass Mock Login" to test JWT features, database scoping, and attachment integrations without Google Cloud credentials.
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
                onClick={() => toast('Configure VITE_GOOGLE_CLIENT_ID in your frontend .env and GOOGLE_CLIENT_ID in backend .env', 'info')}
                className="inline-flex items-center gap-1.5 text-[10px] text-fg-4 hover:text-purple cursor-pointer"
              >
                <HelpCircle size={10} />
                Need help setting up Google Client IDs?
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
