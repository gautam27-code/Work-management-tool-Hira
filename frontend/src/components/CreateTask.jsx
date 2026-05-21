// ============================
// CreateTask Component (Team-Scoped)
// ============================

import { useState } from "react";
import { apiPost } from "../services/api";

function CreateTask({ onClose, onTaskCreated, teamId, members }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [assignedTo, setAssignedTo] = useState("");
  
  // Subtasks state
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { title: newSubtask.trim(), completed: false }]);
      setNewSubtask("");
    }
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a task title");
      return;
    }

    setLoading(true);

    try {
      const newTask = await apiPost("/tasks", {
        title,
        description,
        deadline,
        priority,
        status,
        subtasks,
        teamId,
        assignedTo: assignedTo || null,
      });

      onTaskCreated(newTask);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#1e293b] rounded-2xl border border-[#334155] w-full max-w-lg mx-4 shadow-2xl shadow-black/40 animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#1e293b] z-10 flex items-center justify-between p-6 border-b border-[#334155]">
          <div>
            <h2 className="text-xl font-bold text-white">Create New Task</h2>
            <p className="text-sm text-[#94a3b8] mt-1">Add a task to your team</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#334155] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#94a3b8]">
              Title <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Design homepage layout"
              className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#94a3b8]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your task..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#94a3b8]">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#94a3b8]">Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Unassigned</option>
                {members && members.map((member) => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#94a3b8]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors appearance-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#94a3b8]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors appearance-none cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#94a3b8]">Subtasks</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                placeholder="Add a subtask..."
                className="flex-1 px-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors text-sm"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-4 py-2 rounded-xl bg-[#334155] text-white font-medium text-sm hover:bg-[#475569] transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
            {subtasks.length > 0 && (
              <ul className="space-y-2 mt-2">
                {subtasks.map((st, i) => (
                  <li key={i} className="flex items-center justify-between bg-[#0f172a] px-3 py-2 rounded-lg border border-[#334155]">
                    <span className="text-sm text-white">{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(i)}
                      className="text-[#ef4444] hover:text-[#f87171] p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#818cf8] hover:to-[#6366f1] text-white font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
