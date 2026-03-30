// ============================
// TeamPage
// ============================
// Shows a single team's workspace: members, tasks, and chat.
// Accessed via /team/:teamId

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import CreateTask from "../components/CreateTask";
import TeamChat from "../components/TeamChat";
import InviteUser from "../components/InviteUser";

const API_BASE = "http://localhost:5000/api";

function TeamPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // ---- State ----
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("tasks"); // "tasks" or "chat"

  // ---- Fetch team details, tasks, and messages ----
  useEffect(() => {
    if (user && teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = { Authorization: `Bearer ${user?.token}` };

      // Fetch team details, tasks, and messages in parallel
      const [teamsRes, tasksRes, messagesRes] = await Promise.all([
        fetch(`${API_BASE}/teams`, { headers }),
        fetch(`${API_BASE}/tasks/${teamId}`, { headers }),
        fetch(`${API_BASE}/messages/${teamId}`, { headers }),
      ]);

      if (!teamsRes.ok || !tasksRes.ok || !messagesRes.ok) {
        throw new Error("Failed to load team data");
      }

      const [teamsData, tasksData, messagesData] = await Promise.all([
        teamsRes.json(),
        tasksRes.json(),
        messagesRes.json(),
      ]);

      // Find this specific team from the user's teams
      const currentTeam = teamsData.find((t) => t._id === teamId);
      if (!currentTeam) {
        throw new Error("Team not found or you don't have access");
      }

      setTeam(currentTeam);
      setTasks(tasksData);
      setMessages(messagesData);
    } catch (err) {
      setError(err.message);
      console.error("Team fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---- Handlers ----

  // Add a new task to the list
  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId, completed) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          completed,
          progress: completed ? 100 : 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? updatedTask : t))
      );
    } catch (err) {
      console.error("Toggle complete error:", err);
    }
  };

  // Update task progress
  const handleUpdateProgress = async (taskId, progress) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ progress }),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? updatedTask : t))
      );
    } catch (err) {
      console.error("Update progress error:", err);
    }
  };

  // Send a chat message
  const handleSendMessage = async (text) => {
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ teamId, text }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Calculate stats
  const completedCount = tasks.filter((t) => t.completed).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button + Team header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors mb-4 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {loading ? (
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#94a3b8]">Loading team...</p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/20 text-center animate-fade-in">
              <p className="text-[#ef4444] font-medium mb-2">⚠️ {error}</p>
              <button
                onClick={fetchTeamData}
                className="px-4 py-2 rounded-xl bg-[#334155] text-white hover:bg-[#475569] transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Team Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-white font-bold text-xl">
                      {team?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{team?.name}</h1>
                    <p className="text-sm text-[#94a3b8]">
                      {team?.members?.length} member{team?.members?.length !== 1 ? "s" : ""} · {tasks.length} task{tasks.length !== 1 ? "s" : ""} · {completedCount} completed
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCreateTask(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#818cf8] hover:to-[#6366f1] text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Task
                </button>
              </div>

              {/* Members & Invite Row */}
              <div className="mt-6 bg-[#1e293b] rounded-2xl border border-[#334155] p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Members list */}
                  <div className="flex-1 space-y-3">
                    <h4 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">
                      Members
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {team?.members?.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center gap-2 bg-[#0f172a] border border-[#334155] rounded-full pl-1 pr-3 py-1"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#ec4899] flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-[#f1f5f9]">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invite user */}
                  <div className="md:w-80">
                    <InviteUser teamId={teamId} />
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 mt-8 bg-[#1e293b] rounded-xl p-1 w-fit border border-[#334155]">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === "tasks"
                      ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#334155]"
                  }`}
                >
                  Tasks ({tasks.length})
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === "chat"
                      ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#334155]"
                  }`}
                >
                  Chat ({messages.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === "tasks" && (
                  <TaskList
                    tasks={tasks}
                    onToggleComplete={handleToggleComplete}
                    onUpdateProgress={handleUpdateProgress}
                  />
                )}

                {activeTab === "chat" && (
                  <TeamChat
                    teamId={teamId}
                    messages={messages}
                    onSend={handleSendMessage}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && team && (
        <CreateTask
          onClose={() => setShowCreateTask(false)}
          onTaskCreated={handleTaskCreated}
          teamId={teamId}
          members={team.members}
        />
      )}
    </div>
  );
}

export default TeamPage;
