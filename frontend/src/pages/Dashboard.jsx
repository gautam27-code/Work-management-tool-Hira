// ============================
// Dashboard Page
// ============================
// The main dashboard showing the user's teams.
// Click a team to navigate to its workspace page.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateTeam from "../components/CreateTeam";

const API_BASE = "http://localhost:5000/api";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // ---- State ----
  const [teams, setTeams] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- Fetch teams and pending invites on load ----
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = { Authorization: `Bearer ${user?.token}` };

      // Fetch user's teams and pending invites in parallel
      const [teamsRes, pendingRes] = await Promise.all([
        fetch(`${API_BASE}/teams`, { headers }),
        fetch(`${API_BASE}/teams/pending`, { headers }),
      ]);

      if (!teamsRes.ok) throw new Error("Failed to load teams");

      const teamsData = await teamsRes.json();
      setTeams(teamsData);

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingInvites(pendingData);
      }
    } catch (err) {
      setError("Could not load data. Make sure the backend server is running!");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---- Handlers ----

  // When a new team is created, add it to the list
  const handleTeamCreated = (newTeam) => {
    setTeams((prev) => [newTeam, ...prev]);
  };

  // Navigate to a team's workspace page
  const handleSelectTeam = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  // Join a team from a pending invite
  const handleJoinTeam = async (teamId) => {
    try {
      const response = await fetch(`${API_BASE}/teams/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ teamId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to join team");
      }

      const joinedTeam = await response.json();

      // Add to teams list and remove from pending
      setTeams((prev) => [joinedTeam, ...prev]);
      setPendingInvites((prev) => prev.filter((t) => t._id !== teamId));
    } catch (err) {
      console.error("Join team error:", err);
      alert(err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with teams list */}
          <Sidebar
            teams={teams}
            activeTeamId={null}
            onCreateTeam={() => setShowCreateTeam(true)}
            onSelectTeam={handleSelectTeam}
            pendingInvites={pendingInvites}
            onJoinTeam={handleJoinTeam}
          />

          {/* Main content area */}
          <main className="flex-1">
            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#94a3b8]">Loading your workspace...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="p-6 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/20 text-center animate-fade-in">
                <p className="text-[#ef4444] font-medium mb-2">⚠️ Connection Error</p>
                <p className="text-[#94a3b8] text-sm mb-4">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 rounded-xl bg-[#334155] text-white hover:bg-[#475569] transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Teams Grid */}
            {!loading && !error && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">Your Teams</h2>
                  <p className="text-sm text-[#94a3b8] mt-1">
                    {teams.length} team{teams.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {teams.length === 0 ? (
                  // Empty state
                  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                    <div className="w-20 h-20 rounded-2xl bg-[#1e293b] border border-[#334155] flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No teams yet</h3>
                    <p className="text-[#94a3b8] text-center max-w-sm mb-6">
                      Create a team to start collaborating with your colleagues!
                    </p>
                    <button
                      onClick={() => setShowCreateTeam(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#818cf8] hover:to-[#6366f1] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Your First Team
                    </button>
                  </div>
                ) : (
                  // Teams grid
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {teams.map((team) => (
                      <div
                        key={team._id}
                        onClick={() => handleSelectTeam(team._id)}
                        className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#6366f1]/30 hover:shadow-indigo-500/5 cursor-pointer group animate-fade-in"
                      >
                        {/* Team icon */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                            <span className="text-white font-bold text-lg">
                              {team.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-[#818cf8] transition-colors">
                              {team.name}
                            </h3>
                            <p className="text-xs text-[#94a3b8]">
                              Created by {team.owner?.name || "Unknown"}
                            </p>
                          </div>
                        </div>

                        {/* Team stats */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-sm text-[#94a3b8]">
                              {team.members?.length || 0}
                            </span>
                          </div>
                          <span className="text-xs text-[#334155]">•</span>
                          <span className="text-xs text-[#94a3b8]">
                            Click to open →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateTeam && (
        <CreateTeam
          onClose={() => setShowCreateTeam(false)}
          onTeamCreated={handleTeamCreated}
        />
      )}
    </div>
  );
}

export default Dashboard;
