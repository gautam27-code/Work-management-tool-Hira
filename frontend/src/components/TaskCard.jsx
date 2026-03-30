// ============================
// TaskCard Component
// ============================
// Displays a single task as a card with title, description,
// deadline, progress bar, and status controls.

function TaskCard({ task, onToggleComplete, onUpdateProgress }) {
  // Format the deadline date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if the task is overdue
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;

  // Determine the progress bar color based on progress value
  const getProgressColor = () => {
    if (task.completed) return "bg-[#10b981]";
    if (task.progress >= 75) return "bg-[#06b6d4]";
    if (task.progress >= 50) return "bg-[#6366f1]";
    if (task.progress >= 25) return "bg-[#f59e0b]";
    return "bg-[#94a3b8]";
  };

  return (
    <div
      className={`
        animate-fade-in group relative
        bg-[#1e293b] rounded-2xl border p-5 transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
        ${task.completed
          ? "border-[#10b981]/30 shadow-lg shadow-emerald-500/5"
          : isOverdue
            ? "border-[#ef4444]/30 shadow-lg shadow-red-500/5"
            : "border-[#334155] hover:border-[#6366f1]/30 hover:shadow-indigo-500/5"
        }
      `}
    >
      {/* Completed overlay glow */}
      {task.completed && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#10b981]/5 to-transparent pointer-events-none"></div>
      )}

      {/* Top section: Status badge and actions */}
      <div className="flex items-start justify-between mb-3">
        {/* Status Badge */}
        <span
          className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
            ${task.completed
              ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
              : isOverdue
                ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20"
                : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
            }
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${task.completed ? "bg-[#10b981]" : isOverdue ? "bg-[#ef4444]" : "bg-[#f59e0b]"}`}></span>
          {task.completed ? "Completed" : isOverdue ? "Overdue" : "Pending"}
        </span>

        {/* Complete / Undo button */}
        <button
          onClick={() => onToggleComplete(task._id, !task.completed)}
          className={`
            p-2 rounded-xl transition-all duration-200 cursor-pointer
            ${task.completed
              ? "bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20"
              : "bg-[#334155] text-[#94a3b8] hover:bg-[#6366f1]/10 hover:text-[#6366f1]"
            }
          `}
          title={task.completed ? "Mark as pending" : "Mark as completed"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h3
        className={`
          text-lg font-bold mb-2 transition-colors
          ${task.completed ? "line-through text-[#94a3b8]" : "text-white"}
        `}
      >
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className={`text-sm mb-4 leading-relaxed ${task.completed ? "text-[#64748b] line-through" : "text-[#94a3b8]"}`}>
          {task.description}
        </p>
      )}

      {/* Deadline */}
      <div className="flex items-center gap-2 mb-4">
        <svg className={`w-4 h-4 ${isOverdue ? "text-[#ef4444]" : "text-[#94a3b8]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className={`text-sm ${isOverdue ? "text-[#ef4444] font-medium" : "text-[#94a3b8]"}`}>
          {formatDate(task.deadline)}
        </span>
      </div>

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#94a3b8]">Progress</span>
          <span className={`text-xs font-bold ${task.completed ? "text-[#10b981]" : "text-white"}`}>
            {task.progress}%
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#0f172a] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Progress Controls (only show if not completed) */}
      {!task.completed && (
        <div className="flex items-center gap-2 mt-4">
          <input
            type="range"
            min="0"
            max="100"
            value={task.progress}
            onChange={(e) => onUpdateProgress(task._id, Number(e.target.value))}
            className="flex-1 h-1.5 bg-[#334155] rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6366f1]
              [&::-webkit-slider-thumb]:hover:bg-[#818cf8] [&::-webkit-slider-thumb]:transition-colors
              [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-indigo-500/30"
          />
        </div>
      )}
    </div>
  );
}

export default TaskCard;
