import { useEffect, useState } from 'react';
import useIdeaStore from './store/useIdeaStore';
import useStatsStore from './store/useStatsStore';
import Sidebar from './components/layout/Sidebar';
import MainWorkspace from './components/layout/MainWorkspace';
import AddIdeaModal from './components/ideas/AddIdeaModal';
import { ToastContainer } from './components/ui/Toast';

export default function App() {
  const fetchIdeas = useIdeaStore((s) => s.fetchIdeas);
  const fetchStats = useStatsStore((s) => s.fetchStats);
  const ideas = useIdeaStore((s) => s.ideas);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchIdeas();
    fetchStats();
  }, [fetchIdeas, fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [ideas, fetchStats]);

  return (
    <div className="flex h-screen bg-surface-0 text-fg overflow-hidden">
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
