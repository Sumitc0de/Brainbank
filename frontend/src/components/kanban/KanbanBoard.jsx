import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import useIdeaStore from '../../store/useIdeaStore';
import IdeaCard from '../ideas/IdeaCard';
import { toast } from '../ui/Toast';

const COLS = [
  { id: 'backlog',   title: 'Backlog',   dot: 'bg-fg-4' },
  { id: 'queued',    title: 'Queued',     dot: 'bg-cyan' },
  { id: 'building',  title: 'Building',   dot: 'bg-purple' },
  { id: 'completed', title: 'Completed',  dot: 'bg-green' },
];

export default function KanbanBoard({ onIdeaClick }) {
  const { ideas, updateIdeaStatus } = useIdeaStore();

  const col = (status) =>
    ideas.filter((i) => i.status === status)
         .sort((a, b) => (b.scores?.total || 0) - (a.scores?.total || 0));

  const onDragEnd = async (r) => {
    if (!r.destination) return;
    try {
      await updateIdeaStatus(r.draggableId, r.destination.droppableId);
      toast(`Moved to ${r.destination.droppableId}`, 'success');
    } catch (err) { toast(err.message || 'Move failed', 'error'); }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {COLS.map((c) => {
          const items = col(c.id);
          return (
            <div key={c.id}>
              {/* Column head */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className="text-sm font-semibold text-fg">{c.title}</span>
                <span className="text-[11px] text-fg-4 bg-surface-4/50 px-1.5 py-0.5 rounded-md tabular-nums">
                  {items.length}
                </span>
              </div>

              <Droppable droppableId={c.id}>
                {(prov, snap) => (
                  <div ref={prov.innerRef} {...prov.droppableProps}
                    className={`min-h-[240px] p-2.5 rounded-xl space-y-2.5 transition-colors
                      ${snap.isDraggingOver
                        ? 'bg-purple/5 border-2 border-dashed border-purple/25'
                        : 'bg-surface-2/30 border border-edge'}`}>

                    {items.length === 0 && !snap.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-12 text-fg-4">
                        <Inbox size={22} className="mb-1.5 opacity-40" />
                        <p className="text-xs">Drop ideas here</p>
                      </div>
                    )}

                    {items.map((idea, idx) => (
                      <Draggable key={idea.id} draggableId={idea.id} index={idx}>
                        {(dp, ds) => (
                          <div ref={dp.innerRef} {...dp.draggableProps} {...dp.dragHandleProps}
                            style={dp.draggableProps.style}>
                            <motion.div layout className={ds.isDragging ? 'opacity-90 rotate-1 scale-[1.03]' : ''}>
                              <IdeaCard idea={idea} compact onClick={onIdeaClick} />
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {prov.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
