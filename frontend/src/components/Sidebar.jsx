// ============================
// Sidebar Component
// ============================
// Displays a sidebar with Create Task button and Teams section.
// onCreateClick - function to open the create task form

function Sidebar({ onCreateClick, taskCount, completedCount }) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-5 space-y-6">
        {/* Create Task Button */}
        <button
          onClick={onCreateClick}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#818cf8] hover:to-[#6366f1] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {/* Plus icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Task
        </button>

        {/* Quick Stats */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Overview</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>
                <span className="text-sm text-[#94a3b8]">Total Tasks</span>
              </div>
              <span className="text-sm font-bold text-white">{taskCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                <span className="text-sm text-[#94a3b8]">Completed</span>
              </div>
              <span className="text-sm font-bold text-[#10b981]">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                <span className="text-sm text-[#94a3b8]">Pending</span>
              </div>
              <span className="text-sm font-bold text-[#f59e0b]">{taskCount - completedCount}</span>
            </div>
          </div>
        </div>

        {/* Teams Section (placeholder) */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Teams</h3>
          <div className="space-y-2">
            {["Engineering", "Design", "Marketing"].map((team) => (
              <div
                key={team}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0f172a] transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#334155] group-hover:bg-[#475569] flex items-center justify-center transition-colors">
                  <span className="text-xs font-bold text-[#94a3b8]">{team[0]}</span>
                </div>
                <span className="text-sm text-[#94a3b8] group-hover:text-white transition-colors">{team}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
