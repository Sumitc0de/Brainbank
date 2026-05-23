import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Sparkles, title = 'No quests unlocked yet',
  description = 'Create your first idea and start earning XP.',
  action, actionLabel = 'Get Started',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple via-purple-soft to-amber border border-edge
        flex items-center justify-center mb-5 shadow-elevated">
        <Icon size={25} className="text-white" />
      </div>
      <p className="text-2xl mb-2">🎮</p>
      <h3 className="text-xl font-black text-fg mb-1">{title}</h3>
      <p className="text-sm text-fg-3 max-w-sm mb-6">{description}</p>
      {action && <Button onClick={action}>{actionLabel}</Button>}
    </motion.div>
  );
}
