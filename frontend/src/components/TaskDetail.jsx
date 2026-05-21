import { useState } from "react";
import FileUpload from "./FileUpload";
import { apiPut } from "../services/api";

function TaskDetail({ task, onClose, onUpdate }) {
  const [error, setError] = useState("");

  if (!task) return null;

  const handleUploadComplete = async (fileData) => {
    try {
      const updatedAttachments = [...(task.attachments || []), fileData];
      const updatedTask = await apiPut(`/tasks/${task._id}`, {
        attachments: updatedAttachments
      });
      onUpdate(updatedTask);
    } catch (err) {
      setError(err.message || "Failed to add attachment");
    }
  };

  const removeAttachment = async (index) => {
    try {
      const updatedAttachments = [...(task.attachments || [])];
      updatedAttachments.splice(index, 1);
      const updatedTask = await apiPut(`/tasks/${task._id}`, {
        attachments: updatedAttachments
      });
      onUpdate(updatedTask);
    } catch (err) {
      setError(err.message || "Failed to remove attachment");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTask = await apiPut(`/tasks/${task._id}`, { status: newStatus });
      onUpdate(updatedTask);
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  const handleUpdateSubtask = async (subtaskId, completed) => {
    try {
      const updatedTask = await apiPut(`/tasks/${task._id}/subtasks/${subtaskId}`, { completed });
      onUpdate(updatedTask);
    } catch (err) {
      setError(err.message || "Failed to update subtask");
    }
  };

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

  const renderAttachmentIcon = (fileType) => {
    if (fileType.includes("image")) {
      return (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (fileType.includes("pdf")) {
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-white">
      <div className="bg-[#1e293b] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#334155] shadow-2xl animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h2 className="text-xl font-bold text-white truncate pr-4">{task.title}</h2>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0f172a] rounded-xl border border-[#334155]">
            <div>
              <span className="text-xs text-[#94a3b8] block mb-1">Team</span>
              <span className="text-sm font-semibold text-white flex items-center gap-1.5 truncate" title={task.team?.name || "No Team"}>
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] shrink-0"></span>
                {task.team?.name || "No Team"}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#94a3b8] block mb-1">Assigned To</span>
              <div className="flex items-center gap-1.5 overflow-hidden">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${task.assignedTo ? "bg-gradient-to-br from-[#6366f1] to-[#ec4899] text-white" : "bg-[#334155] text-[#64748b]"}`}>
                  {assignedInitial}
                </div>
                <span className="text-sm font-semibold text-white truncate" title={assignedName}>
                  {assignedName}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-[#94a3b8] block mb-1">Deadline</span>
              <span className={`text-sm font-semibold flex items-center gap-1.5 ${isOverdue ? "text-[#ef4444]" : "text-white"}`}>
                <svg className="w-4 h-4 text-[#94a3b8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {formatDate(task.deadline)}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#94a3b8] block mb-1">Priority</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1e293b] border border-[#334155] text-white capitalize`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priorityColor}`}></span>
                {task.priority || "medium"}
              </span>
            </div>
          </div>

          {/* Status & Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-4 bg-[#0f172a]/50 rounded-xl border border-[#334155]">
            <div>
              <span className="text-xs text-[#94a3b8] block mb-1.5">Status</span>
              <div className="relative inline-block w-full">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`w-full inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold appearance-none cursor-pointer outline-none border transition-colors bg-[#0f172a] ${statusStyle.text} ${statusStyle.border} focus:border-[#6366f1]`}
                >
                  <option value="todo" className="text-white">To Do</option>
                  <option value="in_progress" className="text-white">In Progress</option>
                  <option value="review" className="text-white">Review</option>
                  <option value="done" className="text-white">Done</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94a3b8]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[#94a3b8]">Progress</span>
                <span className={`text-xs font-bold ${task.status === 'done' ? "text-[#10b981]" : "text-white"}`}>{task.progress || 0}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#0f172a] rounded-full overflow-hidden border border-[#334155]">
                <div className={`h-full rounded-full transition-all duration-500 ${task.status === 'done' ? "bg-[#10b981]" : "bg-[#6366f1]"}`} style={{ width: `${task.progress || 0}%` }}></div>
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          {totalSubtasks > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">Subtasks</h3>
                <span className="text-xs font-semibold text-[#64748b]">{completedSubtasks}/{totalSubtasks} completed</span>
              </div>
              <div className="p-4 bg-[#0f172a] border border-[#334155] rounded-xl space-y-3">
                {task.subtasks.map(st => (
                  <div key={st._id} className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={(e) => handleUpdateSubtask(st._id, e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#334155] bg-[#1e293b] text-[#6366f1] focus:ring-[#6366f1] focus:ring-offset-[#0f172a] cursor-pointer"
                    />
                    <span className={`text-sm ${st.completed ? 'text-[#64748b] line-through' : 'text-[#e2e8f0]'}`}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Description</h3>
            <p className="text-[#f1f5f9] bg-[#0f172a] p-4 rounded-xl border border-[#334155] leading-relaxed whitespace-pre-wrap">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Attachments Section */}
          <div>
            <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Attachments</h3>
            
            {task.attachments && task.attachments.length > 0 && (
              <div className="space-y-2 mb-4">
                {task.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0f172a] border border-[#334155] rounded-xl hover:border-[#475569] transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {renderAttachmentIcon(file.fileType)}
                      <a 
                        href={`http://localhost:5000${file.fileUrl}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm text-[#f1f5f9] hover:text-[#6366f1] hover:underline truncate"
                      >
                        {file.fileName}
                      </a>
                    </div>
                    <button 
                      onClick={() => removeAttachment(idx)}
                      className="text-[#64748b] hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove attachment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <FileUpload onUploadComplete={handleUploadComplete} onError={setError} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
