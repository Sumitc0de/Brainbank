import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import useIdeaStore from '../store/useIdeaStore';
import useStatsStore from '../store/useStatsStore';
import StatsCards from '../components/analytics/StatsCards';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
import BuildPipeline from '../components/pipeline/BuildPipeline';
import IdeaCard from '../components/ideas/IdeaCard';
import IdeaDetail from '../components/ideas/IdeaDetail';
import EmptyState from '../components/ui/EmptyState';

export default function DashboardView() {
  const { ideas, setActiveView, setAddModalOpen } = useIdeaStore();
  const stats = useStatsStore((s) => s.stats);
  const [sel, setSel] = useState(null);

  const recent = [...ideas]
    .sort((a, b) => new Date(b.lastActiveAt || b.updatedAt) - new Date(a.lastActiveAt || a.updatedAt))
    .slice(0, 4);

  const top = [...ideas]
    .sort((a, b) => (b.scores?.total || 0) - (a.scores?.total || 0))
    .slice(0, 4);

  if (ideas.length === 0 && !stats) {
    return (
      <EmptyState title="Welcome to IdeasHub Quest Camp"
        description="Drop your first idea, score it, and begin the build adventure."
        actionLabel="Start First Quest ✨"
        action={() => setAddModalOpen(true)} />
    );
  }

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />
      <BuildPipeline ideas={ideas} />
      <AnalyticsCharts stats={stats} />

      {/* Recent + Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          { title: 'Recently Active 🕹️', icon: Clock, color: 'text-blue', items: recent, link: 'ideas', linkText: 'View all' },
          { title: 'Top Priority ⚡', icon: Zap, color: 'text-purple', items: top, link: 'queue', linkText: 'View queue' },
        ].map((section) => (
          <motion.div key={section.title}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
                <section.icon size={15} className={section.color} />
                {section.title}
              </h3>
              <button onClick={() => setActiveView(section.link)}
                className="text-xs font-semibold text-fg-3 hover:text-purple flex items-center gap-1 transition-colors cursor-pointer">
                {section.linkText} <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {section.items.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} compact onClick={() => setSel(idea)} />
              ))}
              {section.items.length === 0 && (
                <p className="text-xs text-fg-4 py-6 text-center">No ideas yet</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {sel && <IdeaDetail idea={sel} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </div>
  );
}
