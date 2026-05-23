const COLORS = {
  high:      'bg-purple/12 text-purple-soft border border-purple/20',
  medium:    'bg-cyan/10 text-cyan border border-cyan/20',
  low:       'bg-surface-4/50 text-fg-3 border border-edge',
  backlog:   'bg-surface-4/50 text-fg-3 border border-edge',
  queued:    'bg-cyan/10 text-cyan border border-cyan/20',
  building:  'bg-purple/12 text-purple-soft border border-purple/20',
  completed: 'bg-green/10 text-green border border-green/20',
  raw:       'bg-surface-4/50 text-fg-3 border border-edge',
  validated: 'bg-blue/10 text-blue border border-blue/20',
  mvp:       'bg-amber/10 text-amber border border-amber/20',
  scaling:   'bg-green/10 text-green border border-green/20',
  purple:    'bg-purple/12 text-purple-soft border border-purple/20',
  cyan:      'bg-cyan/10 text-cyan border border-cyan/20',
  green:     'bg-green/10 text-green border border-green/20',
  amber:     'bg-amber/10 text-amber border border-amber/20',
  red:       'bg-red/10 text-red border border-red/20',
  default:   'bg-surface-4/50 text-fg-3 border border-edge',
};

const DOT_COLORS = {
  high: 'bg-purple', medium: 'bg-cyan', low: 'bg-fg-4',
  building: 'bg-purple', queued: 'bg-cyan', completed: 'bg-green', backlog: 'bg-fg-4',
  purple: 'bg-purple', cyan: 'bg-cyan', green: 'bg-green', amber: 'bg-amber', red: 'bg-red',
};

export default function Badge({ children, color = 'default', size = 'sm', dot, className = '' }) {
  const sz = size === 'xs' ? 'px-1.5 py-px text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap
      ${COLORS[color] || COLORS.default} ${sz} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[color] || 'bg-fg-4'}`} />}
      {children}
    </span>
  );
}
