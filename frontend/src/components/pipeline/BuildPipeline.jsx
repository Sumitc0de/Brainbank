import { motion } from 'framer-motion';
import { Lightbulb, FlaskConical, ClipboardList, Hammer, Rocket } from 'lucide-react';

const STAGES = [
  { id: 'idea',     label: 'Idea',     icon: Lightbulb },
  { id: 'research', label: 'Research', icon: FlaskConical },
  { id: 'planning', label: 'Planning', icon: ClipboardList },
  { id: 'building', label: 'Building', icon: Hammer },
  { id: 'launch',   label: 'Launch',   icon: Rocket },
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
    <div className="p-6 rounded-2xl bg-surface-2/60 backdrop-blur border border-edge">
      <h3 className="text-sm font-semibold text-fg mb-6 flex items-center gap-2">
        <Rocket size={15} className="text-purple" />
        Build Pipeline
      </h3>

      <div className="flex items-center">
        {STAGES.map((stage, i) => {
          const Icon     = stage.icon;
          const count    = counts[stage.id] || 0;
          const isActive = i === activeIdx;
          const isPast   = i < activeIdx;

          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  animate={isActive ? {
                    boxShadow: [
                      '0 0 0 rgba(139,92,246,.15)',
                      '0 0 22px rgba(139,92,246,.35)',
                      '0 0 0 rgba(139,92,246,.15)',
                    ],
                  } : {}}
                  transition={isActive ? { repeat: Infinity, duration: 2.5 } : { duration: 0.15 }}
                  className={`
                    relative w-11 h-11 rounded-xl flex items-center justify-center
                    transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-br from-purple to-blue text-white'
                      : isPast
                        ? 'bg-green/12 text-green border border-green/20'
                        : 'bg-surface-3/60 text-fg-4 border border-edge'
                    }
                  `}
                >
                  <Icon size={17} />
                  {count > 0 && (
                    <span className={`absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full
                      text-[10px] font-bold flex items-center justify-center
                      ${isActive
                        ? 'bg-purple text-white'
                        : 'bg-surface-4 text-fg-3 border border-edge'}`}>
                      {count}
                    </span>
                  )}
                </motion.div>

                <span className={`text-[11px] mt-2 font-medium
                  ${isActive ? 'text-purple-soft' : isPast ? 'text-green' : 'text-fg-4'}`}>
                  {stage.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 -mt-5 min-w-[20px]">
                  <div className={`h-full rounded-full transition-colors
                    ${isPast ? 'bg-green/30' : i === activeIdx ? 'bg-purple/25' : 'bg-edge'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
