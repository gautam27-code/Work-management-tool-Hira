// ============================
// App.jsx - Main Application Router
// ============================
// Routes:
// - "/"            → Dashboard (teams overview)
// - "/login"       → Login page
// - "/signup"      → Signup page
// - "/team/:teamId" → Team workspace page

import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useStore from "./store/store";
import { connectSocket, disconnectSocket } from "./services/socket";
import Skeleton from "./components/Skeleton";

import Toast from "./components/Toast";

// Lazy loaded pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const TeamPage = React.lazy(() => import("./pages/TeamPage"));

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const user = useStore(state => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Full screen loader for suspense
const PageLoader = () => (
  <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const user = useStore(state => state.user);

  const addNotification = useStore(state => state.addNotification);
  const setNotifications = useStore(state => state.setNotifications);
  const addToast = useStore(state => state.addToast);

  // Connect socket when user logs in
  useEffect(() => {
    if (user?.token) {
      connectSocket(user.token);
      
      // Join user-specific room
      import('./services/socket').then(({ joinUser, subscribeToEvent, unsubscribeFromEvent }) => {
        joinUser(user._id);

        const onNewNotification = (notification) => {
          addNotification(notification);
          addToast({ message: notification.text, type: 'info' });
        };
        subscribeToEvent("notification:new", onNewNotification);

        // cleanup is handled below, but we can return a function here too
      });

      // Fetch initial notifications
      import('./services/api').then(({ apiGet }) => {
        apiGet("/notifications").then(setNotifications).catch(console.error);
      });
      
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [user, addNotification, addToast, setNotifications]);

  return (
    <BrowserRouter>
      <Toast />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/team/:teamId" element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          } />

          {/* Auth pages */}
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />

          {/* Catch-all: redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
