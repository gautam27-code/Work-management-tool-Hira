// A modal form to create a new task.
// Props:
//   onClose      - function to close the modal
//   onTaskCreated - function called after a task is successfully created

import { useState } from "react";

// Backend API URL
const API_URL = "http://localhost:5000/api/tasks";

function CreateTask({ onClose, onTaskCreated }) {
  // Form state - one state for each input field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError("");

    // Basic validation
    if (!title.trim()) {
      setError("Please enter a task title");
      return;
    }

    setLoading(true);

    try {
      // Send POST request to create a new task
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, deadline, progress }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();
      onTaskCreated(newTask); // Notify parent component
      onClose(); // Close the modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Modal backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose} // Close when clicking the backdrop
    >
      {/* Modal content - stop click propagation so clicking inside doesn't close it */}
      <div
        className="bg-[#1e293b] rounded-2xl border border-[#334155] w-full max-w-lg mx-4 shadow-2xl shadow-black/40 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#334155]">
          <div>
            <h2 className="text-xl font-bold text-white">Create New Task</h2>
            <p className="text-sm text-[#94a3b8] mt-1">Add a task to your board</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-sm">
              {error}
            </div>
          )}

          {/* Title Input */}
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

          {/* Description Input */}
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

          {/* Deadline & Progress Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Deadline Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#94a3b8]">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Progress Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#94a3b8]">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#818cf8] hover:to-[#6366f1] text-white font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
