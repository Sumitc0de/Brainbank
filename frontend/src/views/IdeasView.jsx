import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Lightbulb } from 'lucide-react';
import useIdeaStore from '../store/useIdeaStore';
import IdeaCard from '../components/ideas/IdeaCard';
import IdeaDetail from '../components/ideas/IdeaDetail';
import EmptyState from '../components/ui/EmptyState';

const SORTS = [
  { value: 'priority', label: 'Priority' },
  { value: 'recent',   label: 'Last Active' },
  { value: 'created',  label: 'Created' },
  { value: 'name',     label: 'Name' },
];

const FILTERS = ['all', 'backlog', 'queued', 'building', 'completed'];

export default function IdeasView() {
  const { ideas, searchQuery, setAddModalOpen } = useIdeaStore();
  const [sel, setSel]       = useState(null);
  const [sort, setSort]     = useState('priority');
  const [filter, setFilter] = useState('all');

  const list = useMemo(() => {
    let r = [...ideas];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter((i) => i.title?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q) || i.tags?.some((t) => t.toLowerCase().includes(q)));
    }
    if (filter !== 'all') r = r.filter((i) => i.status === filter);
    const sorters = {
      priority: (a, b) => (b.scores?.total || 0) - (a.scores?.total || 0),
      recent: (a, b) => new Date(b.lastActiveAt || b.updatedAt) - new Date(a.lastActiveAt || a.updatedAt),
      created: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      name: (a, b) => (a.title || '').localeCompare(b.title || ''),
    };
    r.sort(sorters[sort] || sorters.priority);
    return r;
  }, [ideas, searchQuery, sort, filter]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Filter pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-2/60 border border-edge">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer
                ${filter === f
                  ? 'bg-purple/15 text-purple-soft border border-purple/25'
                  : 'text-fg-3 hover:text-fg hover:bg-surface-4/40 border border-transparent'}`}>
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown size={13} className="text-fg-4" />
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="text-xs bg-surface-2 border border-edge rounded-lg px-2.5 py-1.5
              text-fg-3 focus:border-purple cursor-pointer">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <p className="text-xs text-fg-4 mb-4">{list.length} idea{list.length !== 1 ? 's' : ''}</p>

      {list.length === 0 ? (
        <EmptyState icon={Lightbulb} title="No ideas found"
          description={searchQuery ? 'Try a different search.' : 'Add your first idea.'}
          actionLabel="Add Idea" action={() => setAddModalOpen(true)} />
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {list.map((idea) => <IdeaCard key={idea.id} idea={idea} onClick={() => setSel(idea)} />)}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {sel && <IdeaDetail idea={sel} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </div>
  );
}
