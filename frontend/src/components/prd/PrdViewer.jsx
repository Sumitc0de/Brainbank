import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, FileText } from 'lucide-react';
import useIdeaStore from '../../store/useIdeaStore';
import { toast } from '../ui/Toast';

const SECTIONS = [
  { key: 'problemStatement',      label: 'Problem Statement',  icon: '🎯' },
  { key: 'targetAudience',        label: 'Target Audience',    icon: '👥' },
  { key: 'userPainPoints',        label: 'User Pain Points',   icon: '💢', arr: true },
  { key: 'coreFeatures',          label: 'Core Features',      icon: '⚡', arr: true },
  { key: 'mvpScope',              label: 'MVP Scope',          icon: '🚀' },
  { key: 'futureScope',           label: 'Future Scope',       icon: '🔮' },
  { key: 'monetizationStrategy',  label: 'Monetization',       icon: '💰' },
  { key: 'techStackSuggestion',   label: 'Tech Stack',         icon: '🛠️' },
];

export default function PrdViewer({ idea }) {
  const { regeneratePrdSection } = useIdeaStore();
  const [busy, setBusy] = useState(null);
  const prd = idea?.prd;

  if (!prd?.problemStatement && !prd?.problem) {
    return (
      <div className="py-10 rounded-xl bg-surface-2/40 border border-edge text-center">
        <FileText size={24} className="mx-auto text-fg-4 mb-2" />
        <p className="text-sm text-fg-3">No PRD generated yet.</p>
        <p className="text-xs text-fg-4 mt-1">Click "Generate" to get started.</p>
      </div>
    );
  }

  const regen = async (key) => {
    setBusy(key);
    try { await regeneratePrdSection(idea.id, key); toast('Regenerated', 'success'); }
    catch { toast('Failed', 'error'); }
    setBusy(null);
  };

  return (
    <div className="space-y-2.5">
      {SECTIONS.map((s) => {
        const val = prd[s.key];
        if (!val || (Array.isArray(val) && val.length === 0)) return null;
        if (typeof val === 'string' && !val.trim()) return null;

        return (
          <motion.div key={s.key}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="group p-4 rounded-xl bg-surface-2/40 border border-edge hover:border-edge-light transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-fg-3 flex items-center gap-1.5">
                {s.icon} {s.label}
              </span>
              <button onClick={() => regen(s.key)} disabled={busy === s.key}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-fg-4
                  hover:text-purple hover:bg-purple/10 transition-all cursor-pointer">
                <RefreshCw size={12} className={busy === s.key ? 'animate-spin' : ''} />
              </button>
            </div>

            {s.arr && Array.isArray(val) ? (
              <ul className="space-y-1">
                {val.map((item, i) => (
                  <li key={i} className="text-xs text-fg leading-relaxed flex items-start gap-2">
                    <span className="text-purple mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-fg leading-relaxed">{val}</p>
            )}
          </motion.div>
        );
      })}
      {prd.generatedAt && (
        <p className="text-[10px] text-fg-4 text-right pt-1">
          Generated {new Date(prd.generatedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
