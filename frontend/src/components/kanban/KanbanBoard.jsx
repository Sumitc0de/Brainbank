import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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

export default function KanbanBoard({ onIdeaClick, renderAfter }) {
  const { ideas, updateIdeaStatus, setQueueOrder, getQueuedIdeas } = useIdeaStore();

  const col = (status) =>
    ideas.filter((i) => i.status === status)
         .sort((a, b) => (b.scores?.total || 0) - (a.scores?.total || 0));

  const onDragEnd = async (r) => {
    const { destination, source, draggableId } = r;
    if (!destination) return;

    // Check if anything actually changed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      if (source.droppableId === 'priority-queue' && destination.droppableId === 'priority-queue') {
        // Scenario 1: Reorder within the priority queue
        const queuedIdeas = getQueuedIdeas();
        const newIds = queuedIdeas.map((i) => i.id);
        const [removed] = newIds.splice(source.index, 1);
        newIds.splice(destination.index, 0, removed);
        setQueueOrder(newIds);
      } else if (destination.droppableId === 'priority-queue') {
        // Scenario 2: Dragged from Kanban column into the priority queue
        const queuedIdeas = getQueuedIdeas();
        const currentIds = queuedIdeas.map((i) => i.id);
        const cleanIds = currentIds.filter((id) => id !== draggableId);
        cleanIds.splice(destination.index, 0, draggableId);
        setQueueOrder(cleanIds);

        // Update status in backend/state if not already queued
        const draggedIdea = ideas.find((i) => i.id === draggableId);
        if (draggedIdea && draggedIdea.status !== 'queued') {
          await updateIdeaStatus(draggableId, 'queued');
        }
        toast('Added to Priority Queue', 'success');
      } else if (source.droppableId === 'priority-queue') {
        // Scenario 3: Dragged out of priority queue to a Kanban column
        const queuedIdeas = getQueuedIdeas();
        const newIds = queuedIdeas.map((i) => i.id).filter((id) => id !== draggableId);
        setQueueOrder(newIds);

        // Update status in backend/state
        await updateIdeaStatus(draggableId, destination.droppableId);
        toast(`Moved to ${destination.droppableId}`, 'success');
      } else {
        // Scenario 4: Standard Kanban column to Kanban column drag
        // Remove from queueOrder if it was there and is moving to a non-queued status
        if (destination.droppableId !== 'queued') {
          const queuedIdeas = getQueuedIdeas();
          const newIds = queuedIdeas.map((i) => i.id).filter((id) => id !== draggableId);
          setQueueOrder(newIds);
        }
        
        await updateIdeaStatus(draggableId, destination.droppableId);
        toast(`Moved to ${destination.droppableId}`, 'success');
      }
    } catch (err) {
      toast(err.message || 'Move failed', 'error');
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch mb-8">
        {COLS.map((c) => {
          const items = col(c.id);
          return (
            <div 
              key={c.id} 
              className="flex flex-col bg-surface-2/30 border border-edge rounded-2xl p-4 shadow-card hover:bg-surface-2/50 transition-all duration-300"
            >
              {/* Column head */}
              <div className="flex items-center gap-2 mb-4 px-1">
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot} shadow-sm`} />
                <span className="text-xs font-black uppercase tracking-wider text-fg">{c.title}</span>
                <span className="text-[10px] font-bold text-fg-3 bg-surface-4/60 px-2 py-0.5 rounded-full border border-edge/40 ml-auto tabular-nums">
                  {items.length}
                </span>
              </div>

              <Droppable droppableId={c.id}>
                {(prov, snap) => (
                  <div 
                    ref={prov.innerRef} 
                    {...prov.droppableProps}
                    className={`flex flex-col flex-1 min-h-[480px] p-1.5 rounded-xl space-y-3 transition-all duration-200
                      ${snap.isDraggingOver
                        ? 'bg-purple/10 border border-dashed border-purple/35 shadow-[inset_0_0_12px_rgba(139,92,246,0.05)]'
                        : 'bg-transparent border border-transparent'}`}
                  >
                    {items.length === 0 && !snap.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center flex-1 py-12 text-fg-4 border border-dashed border-edge/60 rounded-xl bg-surface-1/30">
                        <Inbox size={22} className="mb-1.5 opacity-40 text-purple-soft" />
                        <p className="text-xs font-semibold">Drop ideas here</p>
                      </div>
                    )}

                    {items.map((idea, idx) => (
                      <Draggable key={idea.id} draggableId={idea.id} index={idx}>
                        {(dp, ds) => (
                          <div 
                            ref={dp.innerRef} 
                            {...dp.draggableProps} 
                            {...dp.dragHandleProps}
                            style={dp.draggableProps.style}
                          >
                            <div 
                              className={`origin-center
                                ${ds.isDragging 
                                  ? 'scale-[1.03] rotate-1 shadow-elevated opacity-95 select-none pointer-events-none' 
                                  : 'transition-all duration-200 hover:scale-[1.01]'}`}
                            >
                              <IdeaCard idea={idea} compact onClick={onIdeaClick} />
                            </div>
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
      {renderAfter}
    </DragDropContext>
  );
}
