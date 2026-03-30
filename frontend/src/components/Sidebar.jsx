// ============================
// Sidebar Component
// ============================
// Shows the user's teams list, a "Create Team" button, and pending invites.
// Props:
//   teams           - array of team objects the user belongs to
//   activeTeamId    - the currently selected team ID (for highlighting)
//   onCreateTeam    - function to open the create team modal
//   onSelectTeam    - function called when a team is clicked (receives teamId)
//   pendingInvites  - array of teams that have invited this user
//   onJoinTeam      - function called when user clicks "Join" on a pending invite

function Sidebar({ teams, activeTeamId, onCreateTeam, onSelectTeam, pendingInvites, onJoinTeam }) {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      {/* Create Team Button */}
      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-5 space-y-5">
        <button
          onClick={onCreateTeam}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#818cf8] hover:to-[#6366f1] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Team
        </button>

        {/* Teams List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
            Your Teams
          </h3>
          <div className="space-y-1">
            {teams.length === 0 && (
              <p className="text-sm text-[#64748b] py-2">
                No teams yet. Create one!
              </p>
            )}
            {teams.map((team) => (
              <button
                key={team._id}
                onClick={() => onSelectTeam(team._id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                  activeTeamId === team._id
                    ? "bg-[#6366f1]/10 border border-[#6366f1]/30 text-white"
                    : "hover:bg-[#0f172a] text-[#94a3b8] hover:text-white border border-transparent"
                }`}
              >
                {/* Team icon */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    activeTeamId === team._id
                      ? "bg-[#6366f1] text-white"
                      : "bg-[#334155] group-hover:bg-[#475569]"
                  }`}
                >
                  <span className="text-xs font-bold">{team.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block truncate">{team.name}</span>
                  <span className="text-xs text-[#64748b]">
                    {team.members?.length || 0} member{team.members?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Invites */}
      {pendingInvites && pendingInvites.length > 0 && (
        <div className="bg-[#1e293b] rounded-2xl border border-[#06b6d4]/20 p-5 space-y-3">
          <h3 className="text-xs font-semibold text-[#06b6d4] uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Pending Invites
          </h3>
          <div className="space-y-2">
            {pendingInvites.map((invite) => (
              <div
                key={invite._id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a] border border-[#334155]"
              >
                <div>
                  <p className="text-sm text-white font-medium">{invite.name}</p>
                  <p className="text-xs text-[#94a3b8]">
                    by {invite.owner?.name || "Unknown"}
                  </p>
                </div>
                <button
                  onClick={() => onJoinTeam(invite._id)}
                  className="px-3 py-1.5 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4] text-xs font-semibold hover:bg-[#06b6d4]/20 transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
