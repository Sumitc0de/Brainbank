import { motion } from 'framer-motion';
import { Clock, Zap, ChevronRight, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge';
import useIdeaStore from '../../store/useIdeaStore';

function timeAgo(d) {
  if (!d) return '';
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const days = Math.floor(s / 86400);
  if (days === 1) return 'yesterday';
  if (days < 7)   return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function IdeaCard({ idea, compact, onClick }) {
  const getPriorityLabel = useIdeaStore((s) => s.getPriorityLabel);
  const score    = idea.scores?.total || 0;
  const priority = getPriorityLabel(score);
  const productType = idea.details?.productType?.replace(/-/g, ' ');

  const accent = {
    high: 'border-l-purple',
    medium: 'border-l-cyan',
    low: 'border-l-surface-4',
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick?.(idea)}
      className={`
        group relative cursor-pointer rounded-2xl
        bg-surface-2/90 backdrop-blur border border-edge shadow-card
        hover:border-purple/30 hover:shadow-elevated
        transition-all duration-200
        border-l-[3px] ${accent[priority] || accent.low}
        ${compact ? 'p-4' : 'p-5'}
      `}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-black text-fg group-hover:text-purple line-clamp-1 flex-1 transition-colors">
          💎 {idea.title}
        </h3>
        <ChevronRight size={14} className="text-fg-4 group-hover:text-fg-3 shrink-0 mt-0.5
          group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Description */}
      {!compact && idea.description && (
        <p className="text-xs text-fg-2 line-clamp-2 mb-4 leading-relaxed">{idea.description}</p>
      )}

      {/* Badges */}
      <div className="flex items-center flex-wrap gap-1.5 mb-3">
        <Badge color={priority} size="xs" dot>{priority} power</Badge>
        <Badge color={idea.status} size="xs">{idea.status}</Badge>
        {productType && <Badge color="amber" size="xs">🎯 {productType}</Badge>}
        {idea.stage && idea.stage !== 'raw' && <Badge color={idea.stage} size="xs">{idea.stage}</Badge>}
        {idea.prd?.problemStatement && (
          <Badge color="purple" size="xs">
            <Sparkles size={9} className="mr-0.5" /> PRD loot
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-fg-3">
        <span className="flex items-center gap-1.5">
          <Zap size={11} className="text-amber" />
          <span className="font-medium tabular-nums">{score.toFixed(1)}</span>
          {idea.xp > 0 && <span className="text-green">+{idea.xp}xp</span>}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {timeAgo(idea.lastActiveAt || idea.updatedAt)}
        </span>
      </div>

      {/* Tags */}
      {!compact && idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-edge">
          {idea.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-4/40 text-fg-4">{t}</span>
          ))}
          {idea.tags.length > 3 && <span className="text-[10px] text-fg-4">+{idea.tags.length - 3}</span>}
        </div>
      )}
    </motion.div>
  );
}
