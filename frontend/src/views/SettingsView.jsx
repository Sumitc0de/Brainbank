import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, Clipboard, Download, Info, Palette, RefreshCw, Server, Sun,
  ShieldCheck, Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';
import useIdeaStore from '../store/useIdeaStore';
import useResearchStore from '../store/useResearchStore';
import useTaskStore from '../store/useTaskStore';
import { toast } from '../components/ui/Toast';

const cardMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function SettingsView() {
  const ideas = useIdeaStore((s) => s.ideas);
  const tasks = useTaskStore((s) => s.tasks);
  const research = useResearchStore((s) => s.research);
  const [apiUrl, setApiUrl] = useState(
    () => localStorage.getItem('ideashub_backend_url') || 'http://localhost:5000'
  );
  const [copied, setCopied] = useState(false);

  const counts = useMemo(() => {
    const taskCount = Object.values(tasks || {}).flat().length;
    const researchCount = Object.values(research || {}).flat().length;
    return [
      { label: 'Ideas', value: ideas.length },
      { label: 'Tasks', value: taskCount },
      { label: 'Research', value: researchCount },
    ];
  }, [ideas, tasks, research]);

  const saveApiUrl = () => {
    localStorage.setItem('ideashub_backend_url', apiUrl.trim() || 'http://localhost:5000');
    toast('Backend URL saved', 'success');
  };

  const copyApiUrl = async () => {
    await navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    toast('Backend URL copied', 'success');
    window.setTimeout(() => setCopied(false), 1600);
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      ideas,
      tasks,
      research,
      preferences: {
        backendUrl: apiUrl,
        theme: 'dark',
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ideashub-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast('Workspace export created', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {counts.map((item) => (
          <div key={item.label} className="rounded-xl border border-edge bg-surface-2/55 p-4">
            <p className="text-xs text-fg-3">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_.85fr] gap-5">
        <motion.section
          {...cardMotion}
          transition={{ delay: 0.02 }}
          className="rounded-xl bg-surface-2/65 border border-edge overflow-hidden"
        >
          <SectionHeader icon={Server} title="API Portal 🧩" tone="text-purple" />
          <div className="p-5 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-fg-3 uppercase tracking-widest mb-2 block">
                Backend URL
              </label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="min-w-0 w-full rounded-lg border border-edge bg-surface-0 px-3 py-2.5 text-sm text-fg placeholder:text-fg-4"
                  placeholder="http://localhost:5000"
                />
                <button
                  type="button"
                  onClick={copyApiUrl}
                  aria-label="Copy backend URL"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-edge bg-surface-3/60 text-fg-2 hover:text-fg hover:bg-surface-4/60 transition-colors"
                >
                  {copied ? <Check size={16} /> : <Clipboard size={16} />}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={saveApiUrl} icon={Check}>Save URL</Button>
              <Button
                type="button"
                variant="secondary"
                icon={RefreshCw}
                onClick={() => setApiUrl('http://localhost:5000')}
              >
                Reset
              </Button>
            </div>
            <p className="text-xs leading-relaxed text-fg-3">
              In development the frontend still proxies API calls through Vite. This preference keeps the
              endpoint visible and ready for production wiring.
            </p>
          </div>
        </motion.section>

        <motion.section
          {...cardMotion}
          transition={{ delay: 0.08 }}
          className="rounded-xl bg-surface-2/65 border border-edge overflow-hidden"
        >
          <SectionHeader icon={Palette} title="Theme Palette 🎨" tone="text-blue" />
          <div className="p-5 space-y-4">
            <div className="rounded-xl border border-purple/25 bg-purple/10 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-0 border border-edge">
                  <Sun size={18} className="text-purple-soft" />
                </span>
                <div>
                  <p className="text-sm font-bold text-fg">Sunlit Quest Theme</p>
                  <p className="text-xs text-fg-3">Warm, playful, XP-ready</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['#fff7df', '#df2046', '#ff9f33', '#e3c873', '#2d6f29', '#85b9df'].map((color) => (
                <span key={color} className="h-9 rounded-lg border border-edge" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          {...cardMotion}
          transition={{ delay: 0.14 }}
          className="rounded-xl bg-surface-2/65 border border-edge overflow-hidden"
        >
          <SectionHeader icon={Download} title="Inventory Export 🎒" tone="text-green" />
          <div className="p-5 space-y-4">
            <p className="text-sm text-fg-2">
              Export ideas, local tasks, research notes, and workspace preferences as one JSON file.
            </p>
            <Button type="button" variant="success" icon={Download} onClick={exportData}>
              Export Save File
            </Button>
          </div>
        </motion.section>

        <motion.section
          {...cardMotion}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-surface-2/65 border border-edge overflow-hidden"
        >
          <SectionHeader icon={Info} title="About Brainbank 🏰" tone="text-amber" />
          <div className="p-5 space-y-4">
            <p className="text-sm text-fg-2 leading-relaxed">
              Brainbank is a gamified founder workspace for collecting ideas, prioritizing quests,
              tracking research, earning XP, and generating PRDs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Feature icon={Sparkles} label="AI loot generation" />
              <Feature icon={ShieldCheck} label="Local save data" />
            </div>
            <p className="border-t border-edge pt-3 text-[11px] text-fg-4">
              v1.0.0 - React, Tailwind CSS v4, Framer Motion, Zustand
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, tone }) {
  return (
    <div className="flex items-center gap-2 border-b border-edge px-5 py-4">
      <Icon size={16} className={tone} />
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
    </div>
  );
}

function Feature({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-edge bg-surface-0/60 px-3 py-2">
      <Icon size={14} className="text-purple-soft" />
      <span className="text-xs text-fg-2">{label}</span>
    </div>
  );
}
