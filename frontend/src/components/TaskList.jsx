// ============================
// TaskList Component
// ============================
// Displays the list of all tasks in a grid layout.
// Shows an empty state when there are no tasks.

import TaskCard from "./TaskCard";

function TaskList({ tasks, onToggleComplete, onUpdateProgress }) {
  // Show empty state when there are no tasks
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        {/* Empty state illustration */}
        <div className="w-20 h-20 rounded-2xl bg-[#1e293b] border border-[#334155] flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No tasks yet</h3>
        <p className="text-[#94a3b8] text-center max-w-sm">
          Click the <span className="text-[#6366f1] font-medium">"Create Task"</span> button to add your first task!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Tasks</h2>
          <p className="text-sm text-[#94a3b8] mt-1">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggleComplete={onToggleComplete}
            onUpdateProgress={onUpdateProgress}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
