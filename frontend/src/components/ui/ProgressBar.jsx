import { motion } from 'framer-motion';

const GRADIENTS = {
  purple:      'from-purple to-purple-deep',
  cyan:        'from-cyan to-blue',
  green:       'from-green to-green/70',
  amber:       'from-amber to-amber/70',
  'purple-cyan': 'from-purple to-cyan',
};

export default function ProgressBar({
  value = 0, max = 100, color = 'purple', size = 'md',
  showLabel, className = '',
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const h = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-3' : 'h-1.5';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-[11px] text-fg-3 mb-1">
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full ${h} rounded-full bg-surface-4/50 overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${GRADIENTS[color] || GRADIENTS.purple}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
