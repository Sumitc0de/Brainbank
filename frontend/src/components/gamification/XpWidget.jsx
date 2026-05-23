import { Zap, Star } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

const levelTitles = ['Beginner', 'Thinker', 'Builder', 'Launcher', 'Founder', 'Unicorn'];

export default function XpWidget({ stats }) {
  const totalXP = stats?.totalXP || 0;
  const level = stats?.level || 1;
  const xpInLevel = totalXP % 100;
  const xpToNext = 100;
  const title = levelTitles[Math.min(level - 1, levelTitles.length - 1)];

  return (
    <div className="p-3 rounded-xl bg-white/3 border border-border-default">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-amber to-accent-amber-light
            flex items-center justify-center shadow-lg shadow-accent-amber/20">
            <Star size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">Level {level}</p>
            <p className="text-[10px] text-text-muted">{title}</p>
          </div>
        </div>
        <span className="text-xs font-mono text-accent-amber flex items-center gap-1">
          <Zap size={11} />
          {totalXP} XP
        </span>
      </div>

      <ProgressBar value={xpInLevel} max={xpToNext} color="amber" height="h-1.5" />

      <p className="text-[10px] text-text-muted mt-1.5 text-right">
        {xpInLevel} / {xpToNext} to Level {level + 1}
      </p>
    </div>
  );
}
