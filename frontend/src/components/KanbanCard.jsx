import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import TaskDetail from "./TaskDetail";

function KanbanCard({ task, isOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const [showDetail, setShowDetail] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: "bg-[#94a3b8]/10 text-[#94a3b8] border-[#94a3b8]/20",
    medium: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20",
    high: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20",
    critical: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
  };

  const priorityColor = priorityColors[task.priority] || priorityColors.medium;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={(e) => {
          // If we drag, it triggers click sometimes, but dnd-kit usually handles it.
          // Just open detail if clicked.
          if (!isDragging) setShowDetail(true);
        }}
        className={`bg-[#0f172a] rounded-xl border border-[#334155] p-4 shadow-sm hover:border-[#6366f1]/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""} ${isOverlay ? "scale-105 shadow-xl rotate-2" : ""}`}
      >
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${priorityColor} capitalize`}>
            {task.priority}
          </span>
          {task.assignedTo && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#ec4899] flex items-center justify-center flex-shrink-0" title={task.assignedTo.name}>
              <span className="text-white text-[10px] font-bold">
                {task.assignedTo.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <h4 className="text-sm font-semibold text-white mb-2 leading-snug">{task.title}</h4>
        
        {task.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        )}

        {/* Progress bar */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
              <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#334155] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-[#6366f1]'}`}
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {!task.subtasks?.length && task.progress > 0 && (
          <div className="mt-3">
            <div className="flex justify-end text-xs text-[#94a3b8] mb-1">
              <span>{task.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#334155] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-[#6366f1]'}`}
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        )}

      </div>

      {showDetail && (
        <TaskDetail task={task} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}

export default KanbanCard;
