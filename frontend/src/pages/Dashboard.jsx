import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";
import { apiGet, apiPost } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateTeam from "../components/CreateTeam";
import StatCard from "../components/StatCard";
import Calendar from "../components/Calendar";
import TaskDetail from "../components/TaskDetail";

function Dashboard() {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const logout = useStore(state => state.setUser);
  
  const [teams, setTeams] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [teamsRes, invitesRes, analyticsRes] = await Promise.all([
        apiGet("/teams"),
        apiGet("/teams/pending"),
        apiGet("/analytics/dashboard")
      ]);
      setTeams(teamsRes);
      setPendingInvites(invitesRes);
      setAnalytics(analyticsRes);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout(null);
    navigate("/login");
  };

  const handleJoinTeam = async (teamId) => {
    try {
      await apiPost("/teams/join", { teamId });
      fetchData();
    } catch (err) {
      console.error("Failed to join team", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          teams={teams} 
          pendingInvites={pendingInvites} 
          onJoinTeam={handleJoinTeam}
          onCreateTeam={() => setShowCreateTeam(true)}
          onSelectTeam={(teamId) => navigate(`/team/${teamId}`)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name.split(' ')[0]}</h2>
              <p className="text-[#94a3b8]">Here's what's happening across your teams today.</p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : analytics ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    label="Total Tasks" 
                    value={analytics.stats.totalTasks} 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                    gradient="from-[#6366f1] to-[#3b82f6]"
                    delay={0}
                  />
                  <StatCard 
                    label="Completed" 
                    value={analytics.stats.completedTasks} 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    gradient="from-[#10b981] to-[#059669]"
                    delay={100}
                  />
                  <StatCard 
                    label="Pending" 
                    value={analytics.stats.pendingTasks} 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    gradient="from-[#f59e0b] to-[#d97706]"
                    delay={200}
                  />
                  <StatCard 
                    label="Active Teams" 
                    value={analytics.stats.totalTeams} 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    gradient="from-[#ec4899] to-[#db2777]"
                    delay={300}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Calendar Widget (takes up 2 columns on large screens) */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-white">Your Schedule</h3>
                    <Calendar 
                      tasks={[...analytics.dueToday, ...analytics.upcoming, ...analytics.overdue]} 
                      onEventClick={(task) => setSelectedTask(task)}
                    />
                  </div>

                  {/* Tasks Summary Sidebar */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Focus Today</h3>
                    
                    <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-5 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Overdue ({analytics.overdue.length})
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {analytics.overdue.length === 0 ? (
                          <p className="text-sm text-[#94a3b8]">No overdue tasks. Great job!</p>
                        ) : (
                          analytics.overdue.slice(0, 3).map(task => (
                            <div key={task._id} className="p-3 bg-[#0f172a] rounded-xl border border-[#334155]">
                              <p className="text-sm font-medium truncate">{task.title}</p>
                              <p className="text-xs text-red-400 mt-1">Due {new Date(task.deadline).toLocaleDateString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-5 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                          Due Today ({analytics.dueToday.length})
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {analytics.dueToday.length === 0 ? (
                          <p className="text-sm text-[#94a3b8]">Nothing due today.</p>
                        ) : (
                          analytics.dueToday.slice(0, 3).map(task => (
                            <div key={task._id} className="p-3 bg-[#0f172a] rounded-xl border border-[#334155]">
                              <p className="text-sm font-medium truncate">{task.title}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>

      {showCreateTeam && (
        <CreateTeam
          onClose={() => setShowCreateTeam(false)}
          onTeamCreated={() => {
            setShowCreateTeam(false);
            fetchData();
          }}
        />
      )}

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            setSelectedTask(updatedTask);
            fetchData(true);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
