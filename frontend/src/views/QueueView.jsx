import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import KanbanBoard from '../components/kanban/KanbanBoard';
import IdeaDetail from '../components/ideas/IdeaDetail';
import PriorityQueueRow from '../components/kanban/PriorityQueueRow';
import useIdeaStore from '../store/useIdeaStore';

export default function QueueView() {
  const [sel, setSel] = useState(null);
  const ideas = useIdeaStore((s) => s.ideas);
  const liveIdea = ideas.find((i) => i.id === sel?.id) || sel;

  return (
    <div>
      <KanbanBoard 
        onIdeaClick={(idea) => setSel(idea)} 
        renderAfter={<PriorityQueueRow onIdeaClick={(idea) => setSel(idea)} />}
      />
      <AnimatePresence>
        {sel && <IdeaDetail idea={liveIdea} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </div>
  );
}
