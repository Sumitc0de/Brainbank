import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Layers, Hammer, Trophy, Zap, TrendingUp } from 'lucide-react';

const CARDS = [
  { key: 'total',     label: 'Total Ideas', icon: Lightbulb,  gradient: 'from-purple/15 to-purple/5',  border: 'border-purple/15',  ic: 'text-purple-soft' },
  { key: 'queued',    label: 'In Queue',    icon: Layers,     gradient: 'from-cyan/15 to-cyan/5',      border: 'border-cyan/15',    ic: 'text-cyan' },
  { key: 'building',  label: 'Building',    icon: Hammer,     gradient: 'from-amber/15 to-amber/5',    border: 'border-amber/15',   ic: 'text-amber' },
  { key: 'completed', label: 'Completed',   icon: Trophy,     gradient: 'from-green/15 to-green/5',    border: 'border-green/15',   ic: 'text-green' },
  { key: 'totalXP',   label: 'Total XP',    icon: Zap,        gradient: 'from-amber/15 to-amber/5',    border: 'border-amber/15',   ic: 'text-amber' },
  { key: 'level',     label: 'Level',       icon: TrendingUp, gradient: 'from-rose/15 to-rose/5',      border: 'border-rose/15',    ic: 'text-rose' },
];

function AnimNum({ value, dur = 800 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const end = Number(value) || 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, dur]);
  return <>{n}</>;
}

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {CARDS.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div key={c.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            whileHover={{ y: -2 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${c.gradient}
              border ${c.border} backdrop-blur-sm cursor-default`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={15} className={c.ic} />
              <span className="text-[11px] text-fg-2 font-medium">{c.label}</span>
            </div>
            <p className="text-2xl font-bold text-fg tabular-nums">
              <AnimNum value={stats[c.key]} />
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
