// ============================
// Dashboard Page
// ============================
// The main dashboard that shows tasks, sidebar, and create task modal.
// This is the page users see after logging in.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import CreateTask from "../components/CreateTask";

// Backend API URL
const API_URL = "http://localhost:5000/api/tasks";

function Dashboard() {
  const navigate = useNavigate();

  // ---- Get user from localStorage ----
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ---- State ----
  const [tasks, setTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- Fetch all tasks when the page loads ----
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, []);

  // Function to fetch all tasks from the backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError("Could not load tasks. Make sure the backend server is running!");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---- Handler: Add a newly created task to the list ----
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  // ---- Handler: Toggle task completion status ----
  const handleToggleComplete = async (taskId, completed) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
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
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ---- Handler: Update task progress ----
  const handleUpdateProgress = async (taskId, progress) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ progress }),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error("Progress update error:", err);
    }
  };

  // ---- Handler: Logout ----
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Calculate stats for the sidebar
  const completedCount = tasks.filter((t) => t.completed).length;

  // Don't render anything if user is not available (will redirect)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Top Navigation Bar - pass user data and logout handler */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar
            onCreateClick={() => setShowCreateForm(true)}
            taskCount={tasks.length}
            completedCount={completedCount}
          />

          {/* Main Content - Task List */}
          <main className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#94a3b8]">Loading tasks...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="p-6 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/20 text-center animate-fade-in">
                <p className="text-[#ef4444] font-medium mb-2">⚠️ Connection Error</p>
                <p className="text-[#94a3b8] text-sm mb-4">{error}</p>
                <button
                  onClick={fetchTasks}
                  className="px-4 py-2 rounded-xl bg-[#334155] text-white hover:bg-[#475569] transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Task List */}
            {!loading && !error && (
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onUpdateProgress={handleUpdateProgress}
              />
            )}
          </main>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateForm && (
        <CreateTask
          onClose={() => setShowCreateForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}

export default Dashboard;
