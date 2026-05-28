import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, FileText, Edit3, Check, X } from 'lucide-react';
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
  const { regeneratePrdSection, updatePrdSection } = useIdeaStore();
  const [busy, setBusy] = useState(null);
  
  // Inline editing state
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

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
    try { 
      await regeneratePrdSection(idea.id, key); 
      toast('Regenerated', 'success'); 
    } catch (err) { 
      toast(err.message || 'Failed to regenerate', 'error'); 
    }
    setBusy(null);
  };

  const startEdit = (key, val, isArr) => {
    setEditingKey(key);
    if (isArr && Array.isArray(val)) {
      setEditValue(val.join('\n'));
    } else {
      setEditValue(val || '');
    }
  };

  const saveEdit = async (key, isArr) => {
    if (saving) return;
    setSaving(true);
    try {
      const finalContent = isArr
        ? editValue.split('\n').map((line) => line.trim()).filter(Boolean)
        : editValue;
      
      await updatePrdSection(idea.id, key, finalContent);
      toast('Saved successfully', 'success');
      setEditingKey(null);
    } catch (err) {
      toast(err.message || 'Failed to save', 'error');
    }
    setSaving(false);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  return (
    <div className="space-y-2.5">
      {SECTIONS.map((s) => {
        const val = prd[s.key];
        const isEditing = editingKey === s.key;
        
        // Show the section if it is being edited, or if it already has value
        const hasContent = val && (!Array.isArray(val) || val.length > 0) && (typeof val !== 'string' || val.trim());
        if (!hasContent && !isEditing) return null;

        return (
          <motion.div key={s.key}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="group p-4 rounded-xl bg-surface-2/40 border border-edge hover:border-edge-light transition-all duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-fg-3 flex items-center gap-1.5 select-none">
                {s.icon} {s.label}
              </span>
              
              {!isEditing && (
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Edit button */}
                  <button onClick={() => startEdit(s.key, val, s.arr)}
                    className="p-1 rounded-md text-fg-4 hover:text-cyan hover:bg-cyan/10 transition-all cursor-pointer"
                    title="Edit manually"
                  >
                    <Edit3 size={12} />
                  </button>
                  
                  {/* AI Regenerate button */}
                  <button onClick={() => regen(s.key)} disabled={busy === s.key}
                    className="p-1 rounded-md text-fg-4 hover:text-purple hover:bg-purple/10 transition-all cursor-pointer animate-none"
                    title="Regenerate with AI"
                  >
                    <RefreshCw size={12} className={busy === s.key ? 'animate-spin' : ''} />
                  </button>
                </div>
              )}
            </div>

            {/* Content or Editor */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={s.arr ? 5 : 4}
                  className="w-full text-xs bg-surface-1 border border-edge rounded-lg p-2.5
                    text-fg placeholder:text-fg-4 transition-all duration-200 focus:border-cyan
                    focus:shadow-[0_0_0_3px_rgba(34,211,238,.05)] resize-y outline-none leading-relaxed"
                  placeholder={s.arr ? "Enter bullet points, one per line..." : `Enter ${s.label.toLowerCase()}...`}
                  autoFocus
                />
                <div className="flex items-center gap-1.5 justify-end select-none">
                  <button onClick={cancelEdit} disabled={saving}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-fg-3
                      bg-surface-3 hover:bg-surface-4 border border-edge rounded-md transition-colors cursor-pointer"
                  >
                    <X size={10} /> Cancel
                  </button>
                  <button onClick={() => saveEdit(s.key, s.arr)} disabled={saving}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-white
                      bg-gradient-to-r from-cyan to-[#0284c7] hover:scale-[1.02] active:scale-[0.98]
                      rounded-md transition-all cursor-pointer shadow-sm"
                  >
                    {saving ? 'Saving...' : <><Check size={10} /> Save</>}
                  </button>
                </div>
              </div>
            ) : (
              /* Static content rendering */
              s.arr && Array.isArray(val) ? (
                <ul className="space-y-1">
                  {val.map((item, i) => (
                    <li key={i} className="text-xs text-fg leading-relaxed flex items-start gap-2">
                      <span className="text-purple mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-fg leading-relaxed whitespace-pre-wrap">{val}</p>
              )
            )}
          </motion.div>
        );
      })}
      {prd.generatedAt && (
        <p className="text-[10px] text-fg-4 text-right pt-1 select-none">
          Generated {new Date(prd.generatedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
