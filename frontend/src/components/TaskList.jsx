// ============================
// TaskList Component
// ============================

import { useState, useMemo } from "react";
import TaskCard from "./TaskCard";
import TaskDetail from "./TaskDetail";

function TaskList({ tasks, onStatusChange, onUpdateSubtask }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, deadline, priority

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter
    if (filterPriority) {
      result = result.filter(t => t.priority === filterPriority);
    }
    if (filterStatus) {
      result = result.filter(t => t.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'priority') {
        const pValues = { critical: 4, high: 3, medium: 2, low: 1 };
        return (pValues[b.priority] || 0) - (pValues[a.priority] || 0);
      }
      // default newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }, [tasks, filterPriority, filterStatus, sortBy]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
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
      {/* Section Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Tasks</h2>
          <p className="text-sm text-[#94a3b8] mt-1">
            {filteredAndSortedTasks.length} task{filteredAndSortedTasks.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#334155] text-sm text-white focus:outline-none focus:border-[#6366f1]"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#334155] text-sm text-white focus:outline-none focus:border-[#6366f1]"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#334155] text-sm text-white focus:outline-none focus:border-[#6366f1]"
          >
            <option value="newest">Sort by Newest</option>
            <option value="deadline">Sort by Deadline</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAndSortedTasks.map((task) => (
          <div key={task._id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
            <TaskCard
              task={task}
              onStatusChange={onStatusChange}
              onUpdateSubtask={onUpdateSubtask}
            />
          </div>
        ))}
      </div>
      
      {filteredAndSortedTasks.length === 0 && (
        <div className="py-12 text-center text-[#94a3b8]">
          No tasks match your filters.
        </div>
      )}

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            // Note: In real app, you might want to call an onUpdate prop to update parent state,
            // but for now relying on socket.io to update the list, just updating local selection
            setSelectedTask(updatedTask);
          }}
        />
      )}
    </div>
  );
}

export default TaskList;
