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

export default function App() {
  const fetchIdeas = useIdeaStore((s) => s.fetchIdeas);
  const fetchStats = useStatsStore((s) => s.fetchStats);
  const ideas = useIdeaStore((s) => s.ideas);
  const token = useAuthStore((s) => s.token);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchIdeas();
      fetchStats();
    }
  }, [token, fetchIdeas, fetchStats]);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token, ideas, fetchStats]);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'mock-google-client-id';

  if (!token) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <LoginView />
        <ToastContainer />
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="flex h-screen bg-surface-0 text-fg overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <MainWorkspace onMenuToggle={() => setSidebarOpen(true)} />

        {/* Overlays */}
        <AddIdeaModal />
        <ToastContainer />
      </div>
    </GoogleOAuthProvider>
  );
}
