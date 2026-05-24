import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Layers, Hammer, Trophy, Zap, TrendingUp } from 'lucide-react';

const CARDS = [
  { key: 'total',     label: 'Total Ideas', icon: Lightbulb,  gradient: 'from-purple-soft/10 via-purple/5 to-transparent',  border: 'border-purple/20',  ic: 'text-purple' },
  { key: 'queued',    label: 'In Queue',    icon: Layers,     gradient: 'from-cyan/10 via-cyan/5 to-transparent',      border: 'border-cyan/20',    ic: 'text-cyan' },
  { key: 'building',  label: 'Building',    icon: Hammer,     gradient: 'from-amber/10 via-amber/5 to-transparent',    border: 'border-amber/20',   ic: 'text-amber' },
  { key: 'completed', label: 'Completed',   icon: Trophy,     gradient: 'from-green/10 via-green/5 to-transparent',    border: 'border-green/20',   ic: 'text-green' },
  { key: 'totalXP',   label: 'Total XP',    icon: Zap,        gradient: 'from-amber/10 via-amber/5 to-transparent',    border: 'border-amber/20',   ic: 'text-amber-soft' },
  { key: 'level',     label: 'Level',       icon: TrendingUp, gradient: 'from-rose/10 via-rose/5 to-transparent',      border: 'border-rose/20',    ic: 'text-rose' },
];

function AnimNum({ value, dur = 1000 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const end = Number(value) || 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round(end * (1 - Math.pow(1 - p, 4)))); // Out-quartic ease for ultra-smooth tick
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
          <motion.div 
            key={c.key}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative overflow-hidden p-5 rounded-2xl bg-surface-2/65 backdrop-blur-md
              border ${c.border} shadow-card hover:shadow-elevated transition-all duration-300 group`}
          >
            {/* Background mesh flow gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
            
            {/* Dynamic decorative backdrop circles */}
            <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-fg-4/5 group-hover:scale-125 transition-transform duration-500 blur-sm pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-surface-3/50 border border-edge/30 text-fg-3 group-hover:text-fg group-hover:border-edge transition-all duration-300">
                  <Icon size={14} className={`${c.ic}`} />
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-fg-3 group-hover:text-fg-2 transition-colors">
                  {c.label}
                </span>
              </div>
              
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-extrabold text-fg tracking-tight leading-none tabular-nums">
                  <AnimNum value={stats[c.key]} />
                </p>
                {c.key === 'totalXP' && (
                  <span className="text-[9px] font-bold text-amber-soft uppercase tracking-wider">XP</span>
                )}
                {c.key === 'level' && (
                  <span className="text-[9px] font-bold text-rose uppercase tracking-wider">Lvl</span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
