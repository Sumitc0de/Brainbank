import { motion } from 'framer-motion';
import { Lightbulb, FlaskConical, ClipboardList, Hammer, Rocket, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { id: 'idea',     label: 'Idea',     icon: Lightbulb,      color: 'text-purple' },
  { id: 'research', label: 'Research', icon: FlaskConical,   color: 'text-cyan' },
  { id: 'planning', label: 'Planning', icon: ClipboardList,  color: 'text-amber' },
  { id: 'building', label: 'Building', icon: Hammer,         color: 'text-rose' },
  { id: 'launch',   label: 'Launch',   icon: Rocket,         color: 'text-green' },
];

export default function BuildPipeline({ ideas = [] }) {
  const counts = {
    idea:     ideas.filter((i) => i.stage === 'raw').length,
    research: ideas.filter((i) => i.status === 'queued').length,
    planning: ideas.filter((i) => i.stage === 'validated').length,
    building: ideas.filter((i) => i.status === 'building').length,
    launch:   ideas.filter((i) => i.status === 'completed').length,
  };

  const activeIdx = (() => {
    if (counts.building > 0) return 3;
    if (counts.planning > 0) return 2;
    if (counts.research > 0) return 1;
    return 0;
  })();

  return (
    <div className="p-6 rounded-2xl bg-surface-2/65 backdrop-blur-md border border-edge shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-fg flex items-center gap-2">
          <Rocket size={14} className="text-purple animate-pulse" />
          Founder Pipeline Status
        </h3>
        
        {/* Dynamic overall progress badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-green/20 bg-green/5 text-green text-[10px] font-bold uppercase tracking-wide">
          <CheckCircle2 size={11} className="text-green animate-pulse" />
          <span>Active Hub Connection</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-8 md:gap-y-0 pt-2">
        {STAGES.map((stage, i) => {
          const Icon     = stage.icon;
          const count    = counts[stage.id] || 0;
          const isActive = i === activeIdx;
          const isPast   = i < activeIdx;

          return (
            <div key={stage.id} className="flex flex-col md:flex-row items-center flex-1 last:flex-none">
              {/* Node Card Container */}
              <div className="flex flex-col items-center relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  animate={isActive ? {
                    boxShadow: [
                      '0 0 0 rgba(139,92,246,0)',
                      '0 0 24px rgba(139,92,246,0.3)',
                      '0 0 0 rgba(139,92,246,0)',
                    ],
                  } : {}}
                  transition={isActive ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : { duration: 0.2 }}
                  className={`
                    relative w-12 h-12 rounded-2xl flex items-center justify-center
                    border transition-all duration-300 shadow-sm
                    ${isActive
                      ? 'bg-gradient-to-br from-purple to-purple-soft text-white border-purple/40 ring-4 ring-purple/10'
                      : isPast
                        ? 'bg-green/10 text-green border-green/20'
                        : 'bg-surface-3/60 text-fg-3 border-edge'
                    }
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-white' : stage.color} />
                  
                  {/* Item counter count-badge */}
                  {count > 0 && (
                    <span className={`absolute -top-1.5 -right-1.5 w-[20px] h-[20px] rounded-full
                      text-[9px] font-extrabold flex items-center justify-center shadow-sm border
                      ${isActive
                        ? 'bg-white text-purple border-purple-soft/30'
                        : 'bg-surface-4 text-fg-2 border-edge'}`}>
                      {count}
                    </span>
                  )}
                </motion.div>

                {/* Text descriptor */}
                <div className="text-center mt-2.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block
                    ${isActive ? 'text-purple' : isPast ? 'text-green' : 'text-fg-3'}`}>
                    {stage.label}
                  </span>
                  <span className="text-[9px] font-semibold text-fg-4 block leading-none mt-0.5">
                    {count} {count === 1 ? 'idea' : 'ideas'}
                  </span>
                </div>
              </div>

              {/* Horizontal line connector for desktop, hidden on mobile */}
              {i < STAGES.length - 1 && (
                <div className="hidden md:block flex-1 h-[2px] mx-4 -mt-7 min-w-[32px]">
                  <div className={`h-full rounded-full transition-all duration-500
                    ${isPast 
                      ? 'bg-gradient-to-r from-green/45 to-green/30' 
                      : i === activeIdx 
                        ? 'bg-gradient-to-r from-purple/35 to-edge' 
                        : 'bg-edge'}`} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
