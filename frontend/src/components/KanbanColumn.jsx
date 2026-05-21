import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard";

function KanbanColumn({ id, title, tasks, color }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col flex-shrink-0 w-80 bg-[#1e293b] rounded-2xl border border-[#334155] overflow-hidden">
      <div className="p-4 border-b border-[#334155] bg-[#0f172a] flex items-center justify-between sticky top-0 z-10">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
          {title}
        </h3>
        <span className="text-xs font-medium text-[#94a3b8] bg-[#334155] px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div 
        ref={setNodeRef} 
        className={`flex-1 p-3 min-h-[150px] transition-colors overflow-y-auto ${isOver ? 'bg-[#334155]/20' : ''}`}
      >
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map(task => (
              <KanbanCard key={task._id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default KanbanColumn;
