// ============================
// TaskCard Component
// ============================

import { useState } from "react";

function TaskCard({ task, onStatusChange, onUpdateSubtask }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return { bg: "bg-[#10b981]/10", text: "text-[#10b981]", border: "border-[#10b981]/20", dot: "bg-[#10b981]" };
      case 'review': return { bg: "bg-[#f59e0b]/10", text: "text-[#f59e0b]", border: "border-[#f59e0b]/20", dot: "bg-[#f59e0b]" };
      case 'in_progress': return { bg: "bg-[#3b82f6]/10", text: "text-[#3b82f6]", border: "border-[#3b82f6]/20", dot: "bg-[#3b82f6]" };
      default: return { bg: "bg-[#94a3b8]/10", text: "text-[#94a3b8]", border: "border-[#94a3b8]/20", dot: "bg-[#94a3b8]" };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return "bg-[#ef4444]";
      case 'high': return "bg-[#f97316]";
      case 'medium': return "bg-[#3b82f6]";
      default: return "bg-[#94a3b8]";
    }
  };

  const statusStyle = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority);

  const assignedName = task.assignedTo?.name || "Unassigned";
  const assignedInitial = task.assignedTo?.name ? task.assignedTo.name.charAt(0).toUpperCase() : "?";

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div className={`animate-fade-in group relative bg-[#1e293b] rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${task.status === 'done' ? "border-[#10b981]/30 shadow-lg shadow-emerald-500/5" : isOverdue ? "border-[#ef4444]/30 shadow-lg shadow-red-500/5" : "border-[#334155] hover:border-[#6366f1]/30 hover:shadow-indigo-500/5"}`}>
      {task.status === 'done' && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#10b981]/5 to-transparent pointer-events-none"></div>
      )}

      {/* Top section: Badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2">
          {/* Priority Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0f172a] border border-[#334155] text-white`}>
            <span className={`w-2 h-2 rounded-full ${priorityColor}`}></span>
            <span className="capitalize">{task.priority}</span>
          </span>
          
          {/* Status Badge */}
          <select
            value={task.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange && onStatusChange(task._id, e.target.value)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold appearance-none cursor-pointer outline-none ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <h3 className={`text-lg font-bold mb-2 transition-colors ${task.status === 'done' ? "line-through text-[#94a3b8]" : "text-white"}`}>
        {task.title}
      </h3>

      {task.description && (
        <p className={`text-sm mb-4 leading-relaxed line-clamp-2 ${task.status === 'done' ? "text-[#64748b] line-through" : "text-[#94a3b8]"}`}>
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${task.assignedTo ? "bg-gradient-to-br from-[#6366f1] to-[#ec4899] text-white" : "bg-[#334155] text-[#64748b]"}`}>
          {assignedInitial}
        </div>
        <span className="text-sm text-[#94a3b8]">{assignedName}</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <svg className={`w-4 h-4 ${isOverdue ? "text-[#ef4444]" : "text-[#94a3b8]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <span className={`text-sm ${isOverdue ? "text-[#ef4444] font-medium" : "text-[#94a3b8]"}`}>{formatDate(task.deadline)}</span>
      </div>

      {/* Subtasks Section */}
      {totalSubtasks > 0 && (
        <div className="mt-4 pt-4 border-t border-[#334155]">
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-sm font-medium text-[#94a3b8] group-hover:text-white transition-colors">Subtasks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#64748b]">{completedSubtasks}/{totalSubtasks}</span>
              <svg className={`w-4 h-4 text-[#64748b] transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          
          {expanded && (
            <div className="mt-3 space-y-2 animate-fade-in">
              {task.subtasks.map(st => (
                <div key={st._id} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdateSubtask && onUpdateSubtask(task._id, st._id, e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#334155] bg-[#0f172a] text-[#6366f1] focus:ring-[#6366f1] focus:ring-offset-[#1e293b]"
                  />
                  <span className={`text-sm ${st.completed ? 'text-[#64748b] line-through' : 'text-[#e2e8f0]'}`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress Section */}
      <div className="mt-4 pt-4 border-t border-[#334155] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#94a3b8]">Progress</span>
          <span className={`text-xs font-bold ${task.status === 'done' ? "text-[#10b981]" : "text-white"}`}>{task.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${task.status === 'done' ? "bg-[#10b981]" : "bg-[#6366f1]"}`} style={{ width: `${task.progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
