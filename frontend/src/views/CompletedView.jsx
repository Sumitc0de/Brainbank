import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, PartyPopper, Zap } from 'lucide-react';
import useIdeaStore from '../store/useIdeaStore';
import IdeaCard from '../components/ideas/IdeaCard';
import IdeaDetail from '../components/ideas/IdeaDetail';
import EmptyState from '../components/ui/EmptyState';

export default function CompletedView() {
  const ideas = useIdeaStore((s) => s.ideas);
  const [sel, setSel] = useState(null);

  const done = ideas.filter((i) => i.status === 'completed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const xp = done.reduce((s, i) => s + (i.xp || 0), 0);

  if (!done.length) return (
    <EmptyState icon={Trophy} title="No completed ideas yet"
      description="Ship your first project and it'll appear here. Keep building!" />
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-surface-2/60 backdrop-blur border border-edge text-center">
        <PartyPopper size={26} className="mx-auto text-amber mb-3" />
        <h3 className="text-lg font-bold text-fg mb-1">
          {done.length} Project{done.length !== 1 ? 's' : ''} Shipped! 🎉
        </h3>
        <p className="text-sm text-fg-3 flex items-center justify-center gap-1">
          <Zap size={14} className="text-amber" /> {xp} XP earned
        </p>
      </motion.div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {done.map((i) => <IdeaCard key={i.id} idea={i} onClick={() => setSel(i)} />)}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {sel && <IdeaDetail idea={sel} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </div>
  );
}
