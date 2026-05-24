import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import useIdeaStore from './store/useIdeaStore';
import useStatsStore from './store/useStatsStore';
import useAuthStore from './store/useAuthStore';
import Sidebar from './components/layout/Sidebar';
import MainWorkspace from './components/layout/MainWorkspace';
import AddIdeaModal from './components/ideas/AddIdeaModal';
import LoginView from './components/auth/LoginView';
import { ToastContainer } from './components/ui/Toast';
import { Loader2 } from 'lucide-react';

export default function App() {
  const fetchIdeas = useIdeaStore((s) => s.fetchIdeas);
  const fetchStats = useStatsStore((s) => s.fetchStats);
  const ideas = useIdeaStore((s) => s.ideas);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const checkSession = useAuthStore((s) => s.checkSession);
  const theme = useAuthStore((s) => s.theme);
  const syncDOM = useAuthStore((s) => s.syncDOM);
  const compactMode = useAuthStore((s) => s.compactMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  // Check user session once on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    syncDOM();
  }, [syncDOM, theme]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchIdeas();
      fetchStats();
    }
  }, [isAuthenticated, fetchIdeas, fetchStats]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, ideas, fetchStats]);

  // Premium loader to prevent splash flicker
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-surface-0 text-fg relative overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[55%] rounded-full bg-purple-soft/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[20%] w-[55%] h-[40%] rounded-full bg-purple/6 blur-[130px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <img
              src={theme === 'dark' ? '/logo.png' : '/logo1.png'}
              alt="Brainbank Logo"
              className="w-14 h-14 object-contain rounded-xl shadow-lg animate-pulse"
            />
            <div className="absolute -inset-2 rounded-full border border-purple-soft/20 animate-ping pointer-events-none" />
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-fg-3 uppercase pt-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-purple" />
            <span>Synchronizing workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginView = (
      <>
        <LoginView googleConfigured={Boolean(googleClientId)} />
        <ToastContainer />
      </>
    );

    return googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        {loginView}
      </GoogleOAuthProvider>
    ) : (
      loginView
    );
  }

  return (
    <div className={`flex h-screen bg-surface-0 text-fg overflow-hidden ${compactMode ? 'compact-layout' : ''}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <MainWorkspace onMenuToggle={() => setSidebarOpen(true)} />

      {/* Overlays */}
      <AddIdeaModal />
      <ToastContainer />
    </div>
  );
}
