import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { FlaskConical, Plus, Check, Circle, Trash2, GripVertical, Pencil, X } from 'lucide-react';
import useIdeaStore from '../store/useIdeaStore';
import useResearchStore from '../store/useResearchStore';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { toast } from '../components/ui/Toast';

const CATEGORIES = [
  'Competitor Analysis',
  'Market Validation',
  'Monetization Research',
  'Pricing Research',
  'UI Inspiration',
  'Other'
];

export default function ResearchView() {
  const ideas = useIdeaStore((s) => s.ideas);
  const { research, initResearchForIdea, toggleResearch, addResearch, deleteResearch, reorderResearch, updateResearch } = useResearchStore();
  const [ideaId, setIdeaId] = useState('');
  const [title, setTitle]   = useState('');
  const [editingResearchId, setEditingResearchId] = useState(null);
  const [editResearchForm, setEditResearchForm] = useState({ title: '', category: '' });
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

  const startEditResearch = (item) => {
    setEditingResearchId(item.id);
    setEditResearchForm({
      title: item.title,
      category: item.category || 'Other'
    });
  };

  const saveEditResearch = (itemId) => {
    if (!editResearchForm.title.trim()) return;
    updateResearch(selectedIdeaId, itemId, editResearchForm);
    setEditingResearchId(null);
    toast('Research item updated', 'success');
  };

  if (!ideas.length) return <EmptyState icon={FlaskConical} title="No projects" description="Create an idea first." />;

  return (
    <div className="max-w-3xl space-y-6 min-w-0">
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
      <Reorder.Group
        as="div"
        axis="y"
        values={items}
        onReorder={(newOrder) => reorderResearch(selectedIdeaId, newOrder)}
        className="space-y-2"
      >
        {items.map((r) => (
          <Reorder.Item
            key={r.id}
            value={r}
            as="div"
            className="relative select-none"
          >
            <motion.div layout initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all group
                ${r.status === 'completed'
                  ? 'bg-green/5 border-green/15'
                  : 'bg-surface-2/60 border-edge hover:border-cyan/25'}`}>
              
              {/* Drag Handle */}
              <div className="mt-1 shrink-0 text-fg-4 group-hover:text-fg-3 transition-colors cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-surface-3">
                <GripVertical size={14} />
              </div>

              <button onClick={() => toggleResearch(selectedIdeaId, r.id)}
                className={`mt-0.5 shrink-0 cursor-pointer ${r.status === 'completed' ? 'text-green' : 'text-fg-4'}`}>
                {r.status === 'completed' ? <Check size={17} /> : <Circle size={17} />}
              </button>
              
              {editingResearchId === r.id ? (
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="space-y-2">
                    <input
                      value={editResearchForm.title}
                      onChange={(e) => setEditResearchForm({ ...editResearchForm, title: e.target.value })}
                      placeholder="Research title…"
                      className="w-full text-sm bg-surface-3 border border-edge rounded-lg px-3 py-1.5 text-fg focus:border-cyan"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={editResearchForm.category}
                      onChange={(e) => setEditResearchForm({ ...editResearchForm, category: e.target.value })}
                      className="text-xs bg-surface-3 border border-edge rounded-lg px-2.5 py-1 text-fg-3 cursor-pointer"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => saveEditResearch(r.id)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors cursor-pointer"
                        title="Save"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingResearchId(null)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-surface-4 text-fg-3 hover:text-fg hover:bg-surface-4/80 transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className={`text-sm font-semibold break-words ${r.status === 'completed' ? 'text-fg-3 line-through font-normal' : 'text-fg'}`}>
                    {r.title}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-fg-3 px-2 py-0.5 rounded bg-surface-4/60 border border-edge/30">
                      {r.category}
                    </span>
                    <button onClick={() => startEditResearch(r)}
                      className="text-fg-4 hover:text-cyan transition-all cursor-pointer p-1 rounded-lg hover:bg-cyan/10 sm:opacity-0 sm:group-hover:opacity-100">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => { deleteResearch(selectedIdeaId, r.id); toast('Removed', 'info'); }}
                      className="text-fg-4 hover:text-red transition-all cursor-pointer p-1 rounded-lg hover:bg-red/10 sm:opacity-0 sm:group-hover:opacity-100">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add research item…"
          className="flex-1 min-w-0 text-sm bg-surface-2 border border-edge rounded-xl p-3 sm:p-3.5
            text-fg placeholder:text-fg-4 focus:border-cyan focus:shadow-[0_0_0_3px_rgba(34,211,238,.10)]" />
        <Button onClick={add} variant="cyan" icon={Plus} className="shrink-0 self-end sm:self-auto">Add</Button>
      </div>
    </div>
  );
}
