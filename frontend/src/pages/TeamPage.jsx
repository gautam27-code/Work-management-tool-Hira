// ============================
// TeamPage
// ============================

import { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import CreateTask from "../components/CreateTask";
import TeamChat from "../components/TeamChat";
import InviteUser from "../components/InviteUser";
import ActivityFeed from "../components/ActivityFeed";
import TeamAnalytics from "../components/TeamAnalytics";
import KanbanBoard from "../components/KanbanBoard";
import { apiGet, apiPut, apiPost, apiDelete } from "../services/api";
import { subscribeToEvent, unsubscribeFromEvent, joinTeam, leaveTeam } from "../services/socket";

function TeamPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("board"); // "tasks" (list), "board", "chat", "activity", "analytics"

  useEffect(() => {
    if (user && teamId) {
      fetchTeamData();
      joinTeam(teamId);

      const onTaskCreated = (newTask) => setTasks(prev => [newTask, ...prev]);
      const onTaskUpdated = (updatedTask) => setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
      const onTaskDeleted = (taskId) => setTasks(prev => prev.filter(t => t._id !== taskId));
      const onActivityNew = (newActivity) => setActivities(prev => [newActivity, ...prev]);
      const onMessageNew = (newMsg) => setMessages(prev => [...prev, newMsg]);

      subscribeToEvent("task:created", onTaskCreated);
      subscribeToEvent("task:updated", onTaskUpdated);
      subscribeToEvent("task:deleted", onTaskDeleted);
      subscribeToEvent("activity:new", onActivityNew);
      subscribeToEvent("message:new", onMessageNew);

      return () => {
        leaveTeam(teamId);
        unsubscribeFromEvent("task:created", onTaskCreated);
        unsubscribeFromEvent("task:updated", onTaskUpdated);
        unsubscribeFromEvent("task:deleted", onTaskDeleted);
        unsubscribeFromEvent("activity:new", onActivityNew);
        unsubscribeFromEvent("message:new", onMessageNew);
      };
    }
  }, [teamId]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError("");

      const [teamsData, tasksData, messagesData, activitiesData] = await Promise.all([
        apiGet("/teams"),
        apiGet(`/tasks/${teamId}`),
        apiGet(`/messages/${teamId}`),
        apiGet(`/activities/${teamId}`).catch(() => []),
      ]);

      const currentTeam = teamsData.find((t) => t._id === teamId);
      if (!currentTeam) {
        throw new Error("Team not found or you don't have access");
      }

      setTeam(currentTeam);
      setTasks(tasksData);
      setMessages(messagesData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message);
      console.error("Team fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    // Relying mostly on socket to update, but this ensures instant local feedback
    setTasks((prev) => {
      if (prev.find(t => t._id === newTask._id)) return prev;
      return [newTask, ...prev];
    });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await apiPut(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error("Status change error:", err);
    }
  };

  const handleUpdateSubtask = async (taskId, subtaskId, completed) => {
    try {
      await apiPut(`/tasks/${taskId}/subtasks/${subtaskId}`, { completed });
    } catch (err) {
      console.error("Update subtask error:", err);
    }
  };

  const handleSendMessage = async (text) => {
    try {
      const newMessage = await apiPost("/messages", { teamId, text });
      setMessages((prev) => {
        if (prev.find(m => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await apiDelete(`/teams/${teamId}/members/${userId}`);
      setTeam(prev => ({
        ...prev,
        members: prev.members.filter(m => m.user._id !== userId)
      }));
    } catch (err) {
      console.error("Failed to remove member:", err);
      alert(err.message || "Failed to remove member");
    }
  };

  const completedCount = tasks.filter((t) => t.status === 'done').length;

  if (!user) return null;

  // Determine user role
  const currentUserMember = team?.members?.find(m => m.user?._id === user._id || m.user === user._id);
  const isAdmin = currentUserMember?.role === "admin";

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {isAdmin && (
                  <button
                    onClick={() => setShowCreateTask(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#818cf8] hover:to-[#6366f1] text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Task
                  </button>
                )}
              </div>

              <div className="mt-6 bg-[#1e293b] rounded-2xl border border-[#334155] p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1 space-y-3">
                    <h4 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">
                      Members
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {team?.members?.map((member) => (
                        <div
                          key={member.user._id}
                          className="flex items-center gap-2 bg-[#0f172a] border border-[#334155] rounded-full pl-1 pr-3 py-1 group relative"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#ec4899] flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {member.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-[#f1f5f9] flex items-center gap-1">
                            {member.user.name}
                            {member.role === "admin" && (
                              <svg className="w-3 h-3 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            )}
                          </span>
                          {isAdmin && member.user._id !== user._id && member.role !== "admin" && (
                            <button
                              onClick={() => handleRemoveMember(member.user._id)}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="md:w-80">
                      <InviteUser teamId={teamId} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-8 bg-[#1e293b] rounded-xl p-1 w-fit border border-[#334155]">
                <button
                  onClick={() => setActiveTab("board")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === "board"
                      ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#334155]"
                  }`}
                >
                  Board
                </button>
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === "tasks"
                      ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#334155]"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === "chat"
                      ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#334155]"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === "activity"
                      ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#334155]"
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === "analytics"
                      ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#334155]"
                  }`}
                >
                  Analytics
                </button>
              </div>

              <div className="mt-6">
                {activeTab === "board" && (
                  <KanbanBoard
                    tasks={tasks}
                    onStatusChange={handleStatusChange}
                  />
                )}

                {activeTab === "tasks" && (
                  <TaskList
                    tasks={tasks}
                    onStatusChange={handleStatusChange}
                    onUpdateSubtask={handleUpdateSubtask}
                  />
                )}

                {activeTab === "chat" && (
                  <TeamChat
                    teamId={teamId}
                    messages={messages}
                    onSend={handleSendMessage}
                  />
                )}
                
                {activeTab === "activity" && (
                  <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 max-w-3xl">
                    <h3 className="text-xl font-bold text-white mb-6">Team Activity</h3>
                    <ActivityFeed activities={activities} />
                  </div>
                )}

                {activeTab === "analytics" && (
                  <TeamAnalytics teamId={teamId} />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showCreateTask && team && (
        <CreateTask
          onClose={() => setShowCreateTask(false)}
          onTaskCreated={handleTaskCreated}
          teamId={teamId}
          members={team.members.map(m => m.user)} // pass just users to CreateTask
        />
      )}
    </div>
  );
}

export default TeamPage;
