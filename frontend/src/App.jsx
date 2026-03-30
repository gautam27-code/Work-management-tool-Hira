// ============================
// App.jsx - Main Application Router
// ============================
// This is the root component that handles routing between pages.
// - "/" → Dashboard (protected, requires login)
// - "/login" → Login page
// - "/signup" → Signup page

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard - main page after login */}
        <Route path="/" element={<Dashboard />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Catch-all: redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
