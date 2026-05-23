import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import KanbanBoard from '../components/kanban/KanbanBoard';
import IdeaDetail from '../components/ideas/IdeaDetail';

export default function QueueView() {
  const [sel, setSel] = useState(null);
  return (
    <div>
      <KanbanBoard onIdeaClick={(idea) => setSel(idea)} />
      <AnimatePresence>
        {sel && <IdeaDetail idea={sel} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </div>
  );
}
