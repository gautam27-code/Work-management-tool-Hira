// ============================
// App.jsx - Main Application Router
// ============================
// Routes:
// - "/"            → Dashboard (teams overview)
// - "/login"       → Login page
// - "/signup"      → Signup page
// - "/team/:teamId" → Team workspace page

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeamPage from "./pages/TeamPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard - shows user's teams */}
        <Route path="/" element={<Dashboard />} />

        {/* Team workspace - tasks + chat */}
        <Route path="/team/:teamId" element={<TeamPage />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Catch-all: redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
