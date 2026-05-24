import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, Check, Circle, Trash2, Clock } from 'lucide-react';
import useIdeaStore from '../store/useIdeaStore';
import useTaskStore from '../store/useTaskStore';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { toast } from '../components/ui/Toast';

const PHASES = [
  { id: 'mvp',          label: 'MVP',          color: 'purple' },
  { id: 'improvements', label: 'Improvements', color: 'cyan' },
  { id: 'scaling',      label: 'Scaling',      color: 'green' },
];

export default function TasksView() {
  const ideas = useIdeaStore((s) => s.ideas);
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const [ideaId, setIdeaId] = useState('');
  const [form, setForm]     = useState({ title: '', phase: 'mvp', priority: 'medium', estimatedTime: '' });
  const selectedIdeaId = ideaId || ideas[0]?.id || '';

  const list = tasks[selectedIdeaId] || [];
  const done = list.filter((t) => t.status === 'completed').length;
  const pct  = list.length ? (done / list.length) * 100 : 0;

  const add = () => {
    if (!form.title.trim() || !selectedIdeaId) return;
    addTask(selectedIdeaId, form);
    setForm({ title: '', phase: 'mvp', priority: 'medium', estimatedTime: '' });
    toast('Task added', 'success');
  };

  if (!ideas.length) return <EmptyState icon={CheckSquare} title="No projects" description="Create an idea first." />;

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
            <CheckSquare size={15} className="text-purple" /> Task Progress
          </h3>
          <span className="text-xs text-fg-3">{done}/{list.length}</span>
        </div>
        <ProgressBar value={pct} max={100} color="purple-cyan" showLabel />
      </div>

      {/* Phases */}
      {PHASES.map((phase) => {
        const items = list.filter((t) => t.phase === phase.id);
        if (!items.length && phase.id !== 'mvp') return null;

        return (
          <div key={phase.id}>
            <div className="flex items-center gap-2 mb-3">
              <Badge color={phase.color} size="xs">{phase.label}</Badge>
              <span className="text-xs text-fg-4">{items.length} task{items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              {items.map((t) => (
                <motion.div key={t.id} layout initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all group
                    ${t.status === 'completed'
                      ? 'bg-green/5 border-green/15'
                      : 'bg-surface-2/60 border-edge hover:border-purple/25'}`}>
                  <button onClick={() => toggleTask(selectedIdeaId, t.id)}
                    className={`mt-0.5 shrink-0 cursor-pointer ${t.status === 'completed' ? 'text-green' : 'text-fg-4'}`}>
                    {t.status === 'completed' ? <Check size={17} /> : <Circle size={17} />}
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className={`text-sm font-semibold break-words ${t.status === 'completed' ? 'text-fg-3 line-through font-normal' : 'text-fg'}`}>
                      {t.title}
                    </span>
                    <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                      <Badge color={t.priority} size="xs">{t.priority}</Badge>
                      {t.estimatedTime && (
                        <span className="text-[10px] text-fg-4 flex items-center gap-1 shrink-0 font-medium">
                          <Clock size={10} /> {t.estimatedTime}
                        </span>
                      )}
                      <button onClick={() => { deleteTask(selectedIdeaId, t.id); toast('Removed', 'info'); }}
                        className="text-fg-4 hover:text-red transition-all cursor-pointer p-1 rounded-lg hover:bg-red/10 sm:opacity-0 sm:group-hover:opacity-100">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add form */}
      <div className="p-4 sm:p-5 rounded-xl bg-surface-2/40 border border-edge space-y-3">
        <h4 className="text-xs font-medium text-fg-3 uppercase tracking-wider">Add Task</h4>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Task title…"
          className="w-full min-w-0 text-sm bg-surface-2 border border-edge rounded-xl p-3 sm:p-3.5
            text-fg placeholder:text-fg-4 focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,.10)]" />
        <div className="grid grid-cols-2 sm:flex gap-2 sm:flex-wrap">
          <select value={form.phase} onChange={(e) => setForm({ ...form, phase: e.target.value })}
            className="text-xs bg-surface-2 border border-edge rounded-lg px-3 py-2 text-fg-3 min-w-0">
            {PHASES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="text-xs bg-surface-2 border border-edge rounded-lg px-3 py-2 text-fg-3 min-w-0">
            {['high','medium','low'].map((p) => <option key={p} value={p}>{p[0].toUpperCase()+p.slice(1)}</option>)}
          </select>
          <input value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
            placeholder="Est. time" className="text-xs bg-surface-2 border border-edge rounded-lg px-3 py-2 text-fg-3 min-w-0" />
          <Button onClick={add} icon={Plus} size="sm" className="col-span-2 sm:col-span-1">Add</Button>
        </div>
      </div>
    </div>
  );
}
