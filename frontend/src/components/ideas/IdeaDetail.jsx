import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Sparkles, Save, Target, ChevronDown, ChevronUp } from 'lucide-react';
import useIdeaStore from '../../store/useIdeaStore';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ScoreSlider from '../ui/ScoreSlider';
import ProgressBar from '../ui/ProgressBar';
import PrdViewer from '../prd/PrdViewer';
import { toast } from '../ui/Toast';

const STATUSES = ['backlog', 'queued', 'building', 'completed'];
const STAGES   = ['raw', 'validated', 'mvp', 'scaling'];

export default function IdeaDetail({ idea, onClose }) {
  const { updateIdea, deleteIdea, generatePrd } = useIdeaStore();

  const [edit, setEdit] = useState({
    title: idea.title,
    description: idea.description || '',
    status: idea.status,
    stage: idea.stage,
    scores: { ...idea.scores },
  });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [showScores, setShowScores] = useState(false);

  const score    = edit.scores?.total || 0;
  const priority = score >= 8 ? 'high' : score >= 5 ? 'medium' : 'low';

  const setScore = (k, v) => {
    const s = { ...edit.scores, [k]: v };
    const { impact, effort, skill, demand, money } = s;
    s.total = Math.round((((impact + demand + money) / (effort + 1)) * (skill / 10)) * 100) / 100;
    setEdit({ ...edit, scores: s });
  };

  const save = async () => {
    setSaving(true);
    try { await updateIdea(idea.id, edit); toast('Saved', 'success'); }
    catch (err) { toast(err.message || 'Save failed', 'error'); }
    setSaving(false);
  };

  const genPrd = async () => {
    setGenerating(true);
    try { await generatePrd(idea.id); toast('PRD generated!', 'success'); }
    catch (err) { toast(err.message || 'Generation failed', 'error'); }
    setGenerating(false);
  };

  const del = async () => {
    try { await deleteIdea(idea.id); toast('Deleted', 'info'); onClose(); }
    catch (err) { toast(err.message || 'Delete failed', 'error'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end">

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-xl h-full overflow-y-auto bg-surface-1 border-l border-edge"
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4
          bg-surface-1/90 backdrop-blur-lg border-b border-edge">
          <div className="flex items-center gap-2">
            <Badge color={priority} dot>{priority}</Badge>
            <Badge color={idea.status}>{idea.status}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" onClick={del} icon={Trash2}>Delete</Button>
            <button onClick={onClose}
              className="p-2 rounded-lg text-fg-3 hover:text-fg hover:bg-surface-4/40 transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <input value={edit.title}
            onChange={(e) => setEdit({ ...edit, title: e.target.value })}
            className="w-full text-xl font-bold bg-transparent text-fg border-none outline-none
              placeholder:text-fg-4"
            placeholder="Idea title…" />

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-fg-3 uppercase tracking-wider mb-2 block">Description</label>
            <textarea value={edit.description}
              onChange={(e) => setEdit({ ...edit, description: e.target.value })}
              rows={3}
              className="w-full text-sm bg-surface-2 border border-edge rounded-xl p-4
                text-fg resize-none placeholder:text-fg-4
                focus:border-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,.10)]"
              placeholder="Describe your idea…" />
          </div>

          {/* Status / Stage */}
          <div className="grid grid-cols-2 gap-4">
            {[['Status', edit.status, STATUSES, (v) => setEdit({ ...edit, status: v })],
              ['Stage', edit.stage, STAGES, (v) => setEdit({ ...edit, stage: v })]
            ].map(([label, val, opts, set]) => (
              <div key={label}>
                <label className="text-xs font-medium text-fg-3 uppercase tracking-wider mb-2 block">{label}</label>
                <select value={val} onChange={(e) => set(e.target.value)}
                  className="w-full text-sm bg-surface-2 border border-edge rounded-xl p-2.5
                    text-fg focus:border-purple">
                  {opts.map((o) => <option key={o} value={o}>{o[0].toUpperCase() + o.slice(1)}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Scores accordion */}
          <div className="rounded-xl bg-surface-2/60 border border-edge overflow-hidden">
            <button onClick={() => setShowScores(!showScores)}
              className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer">
              <span className="flex items-center gap-2 text-sm font-medium text-fg">
                <Target size={15} className="text-purple" />
                Priority Score
                <span className="text-purple font-bold tabular-nums">{score.toFixed(1)}</span>
              </span>
              {showScores ? <ChevronUp size={16} className="text-fg-3" /> : <ChevronDown size={16} className="text-fg-3" />}
            </button>

            {showScores && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                className="px-5 pb-4 space-y-3 border-t border-edge pt-4">
                <ScoreSlider label="Impact" value={edit.scores.impact} onChange={(v) => setScore('impact', v)} />
                <ScoreSlider label="Demand" value={edit.scores.demand} onChange={(v) => setScore('demand', v)} />
                <ScoreSlider label="Money"  value={edit.scores.money}  onChange={(v) => setScore('money', v)} />
                <ScoreSlider label="Effort" value={edit.scores.effort} onChange={(v) => setScore('effort', v)} />
                <ScoreSlider label="Skill"  value={edit.scores.skill}  onChange={(v) => setScore('skill', v)} />
                <div className="pt-3 border-t border-edge">
                  <div className="flex justify-between text-xs text-fg-3 mb-1">
                    <span>Score</span>
                    <span className="font-medium text-fg tabular-nums">{score.toFixed(1)} / 15</span>
                  </div>
                  <ProgressBar value={score} max={15} color="purple-cyan" />
                </div>
              </motion.div>
            )}
          </div>

          {/* PRD */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
                <Sparkles size={15} className="text-purple" />
                AI Product Requirement Doc
              </h3>
              <Button variant="secondary" size="sm" onClick={genPrd} disabled={generating} icon={Sparkles}>
                {generating ? 'Generating…' : idea.prd?.problemStatement ? 'Regenerate' : 'Generate'}
              </Button>
            </div>

            {generating ? (
              <div className="p-8 rounded-xl bg-surface-2/60 border border-purple/20
                flex items-center justify-center gap-3">
                <motion.div animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Sparkles size={18} className="text-purple" />
                </motion.div>
                <span className="text-sm text-fg-2">AI is crafting your PRD…</span>
              </div>
            ) : (
              <PrdViewer idea={idea} />
            )}
          </div>

          {/* Tags */}
          {idea.tags?.length > 0 && (
            <div>
              <label className="text-xs font-medium text-fg-3 uppercase tracking-wider mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {idea.tags.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-surface-3/60 text-fg-2 border border-edge">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Save */}
          <div className="sticky bottom-0 pt-4 pb-2 bg-surface-1">
            <Button onClick={save} disabled={saving} icon={Save} className="w-full" size="lg">
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
