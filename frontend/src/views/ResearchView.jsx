import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Plus, Check, Circle, Trash2 } from 'lucide-react';
import useIdeaStore from '../store/useIdeaStore';
import useResearchStore from '../store/useResearchStore';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { toast } from '../components/ui/Toast';

export default function ResearchView() {
  const ideas = useIdeaStore((s) => s.ideas);
  const { research, initResearchForIdea, toggleResearch, addResearch, deleteResearch } = useResearchStore();
  const [ideaId, setIdeaId] = useState('');
  const [title, setTitle]   = useState('');
  const selectedIdeaId = ideaId || ideas[0]?.id || '';

  useEffect(() => { if (selectedIdeaId) initResearchForIdea(selectedIdeaId); }, [selectedIdeaId, initResearchForIdea]);

  const items = research[selectedIdeaId] || [];
  const done  = items.filter((r) => r.status === 'completed').length;
  const pct   = items.length ? (done / items.length) * 100 : 0;

  const add = () => {
    if (!title.trim() || !selectedIdeaId) return;
    addResearch(selectedIdeaId, { title: title.trim() }); setTitle('');
    toast('Added', 'success');
  };

  if (!ideas.length) return <EmptyState icon={FlaskConical} title="No projects" description="Create an idea first." />;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Selector */}
      <div>
        <label className="text-xs font-medium text-fg-3 uppercase tracking-wider mb-2 block">Project</label>
        <select value={selectedIdeaId} onChange={(e) => setIdeaId(e.target.value)}
          className="w-full max-w-md text-sm bg-surface-2 border border-edge rounded-xl p-3
            text-fg focus:border-purple">
          {ideas.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
        </select>
      </div>

      {/* Progress */}
      <div className="p-5 rounded-2xl bg-surface-2/60 backdrop-blur border border-edge">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
            <FlaskConical size={15} className="text-cyan" /> Research Progress
          </h3>
          <span className="text-xs text-fg-3">{done}/{items.length}</span>
        </div>
        <ProgressBar value={pct} max={100} color="cyan" showLabel />
      </div>

      {/* List */}
      <div className="space-y-2">
        {items.map((r) => (
          <motion.div key={r.id} layout initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all group
              ${r.status === 'completed'
                ? 'bg-green/5 border-green/15'
                : 'bg-surface-2/60 border-edge hover:border-cyan/25'}`}>
            <button onClick={() => toggleResearch(selectedIdeaId, r.id)}
              className={`shrink-0 cursor-pointer ${r.status === 'completed' ? 'text-green' : 'text-fg-4'}`}>
              {r.status === 'completed' ? <Check size={17} /> : <Circle size={17} />}
            </button>
            <span className={`text-sm flex-1 ${r.status === 'completed' ? 'text-fg-3 line-through' : 'text-fg'}`}>
              {r.title}
            </span>
            <span className="text-[10px] text-fg-4 px-1.5 py-0.5 rounded bg-surface-4/40">{r.category}</span>
            <button onClick={() => { deleteResearch(selectedIdeaId, r.id); toast('Removed', 'info'); }}
              className="opacity-0 group-hover:opacity-100 text-fg-4 hover:text-red transition-all cursor-pointer">
              <Trash2 size={13} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add */}
      <div className="flex gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add research item…"
          className="flex-1 text-sm bg-surface-2 border border-edge rounded-xl p-3.5
            text-fg placeholder:text-fg-4 focus:border-cyan focus:shadow-[0_0_0_3px_rgba(34,211,238,.10)]" />
        <Button onClick={add} variant="cyan" icon={Plus}>Add</Button>
      </div>
    </div>
  );
}
