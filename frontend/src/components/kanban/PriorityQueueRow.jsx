import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Zap } from 'lucide-react';
import useIdeaStore from '../../store/useIdeaStore';
import IdeaCard from '../ideas/IdeaCard';

export default function PriorityQueueRow({ onIdeaClick }) {
  const getQueuedIdeas = useIdeaStore((s) => s.getQueuedIdeas);
  const queuedIdeas = getQueuedIdeas();
  
  const MAX_SLOTS = 4;
  const slots = Array.from({ length: MAX_SLOTS });

  const badges = [
    { text: '1st Priority', color: 'from-amber-400 to-orange-500 bg-amber-500/10 text-amber border-amber/30' },
    { text: '2nd Priority', color: 'from-purple-400 to-indigo-500 bg-purple-500/10 text-purple-soft border-purple-soft/30' },
    { text: '3rd Priority', color: 'from-cyan-400 to-blue-500 bg-cyan-500/10 text-cyan border-cyan/30' },
    { text: '4th Priority', color: 'from-emerald-400 to-teal-500 bg-emerald-500/10 text-green border-green/30' },
  ];

  return (
    <div className="mt-8 bg-surface-2/15 border border-edge/80 rounded-2xl p-5 shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan/10 border border-cyan/20">
            <Zap size={16} className="text-cyan animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-fg flex items-center gap-1.5">
              ⚡ Priority Queue
            </h2>
            <p className="text-[10px] font-semibold text-fg-3">
              The top 4 ideas ready for action. Drag to reorder priority.
            </p>
          </div>
        </div>
        
        {queuedIdeas.length > 0 && (
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan">
            Active Focus
          </span>
        )}
      </div>

      {/* Row container */}
      <Droppable droppableId="priority-queue" direction="horizontal">
        {(prov, snap) => (
          <div
            ref={prov.innerRef}
            {...prov.droppableProps}
            className={`flex flex-row items-stretch gap-4 p-1 rounded-xl transition-all duration-200 min-h-[140px] overflow-x-auto pb-2 lg:pb-0
              ${snap.isDraggingOver
                ? 'bg-cyan/5 border border-dashed border-cyan/30 shadow-[inset_0_0_12px_rgba(34,211,238,0.03)]'
                : 'bg-transparent border border-transparent'}`}
          >
            {slots.map((_, idx) => {
              const idea = queuedIdeas[idx];
              const badge = badges[idx];

              if (idea) {
                return (
                  <Draggable key={idea.id} draggableId={idea.id} index={idx}>
                    {(dp, ds) => (
                      <div
                        ref={dp.innerRef}
                        {...dp.draggableProps}
                        {...dp.dragHandleProps}
                        style={dp.draggableProps.style}
                        className="relative flex-1 min-w-[240px] lg:min-w-0"
                      >
                        {/* Position badge */}
                        <div className={`absolute -top-2.5 left-3 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider shadow-sm ${badge.color}`}>
                          {badge.text}
                        </div>
                        
                        <div
                          className={`origin-center h-full pt-1.5
                            ${ds.isDragging
                              ? 'scale-[1.03] rotate-1 shadow-elevated opacity-95 select-none pointer-events-none'
                              : 'transition-all duration-200 hover:scale-[1.01]'}`}
                        >
                          <IdeaCard idea={idea} compact onClick={onIdeaClick} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              }

              // Empty slot placeholder
              return (
                <div
                  key={`empty-${idx}`}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-edge/60 bg-surface-1/10 text-center min-h-[110px] flex-1 min-w-[240px] lg:min-w-0 transition-colors hover:bg-surface-1/25 group"
                >
                  <div className="flex items-center gap-1 mb-1.5 px-2 py-0.5 rounded-full bg-surface-3/50 border border-edge/30 text-[9px] font-bold text-fg-3 group-hover:text-fg-2 transition-colors">
                    <span>Slot {idx + 1}</span>
                  </div>
                  <p className="text-xs font-semibold text-fg-4 group-hover:text-fg-3 transition-colors">
                    Auto-fills by priority
                  </p>
                </div>
              );
            })}
            
            {prov.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
