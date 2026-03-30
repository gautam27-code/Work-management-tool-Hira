// ============================
// InviteUser Component
// ============================
// An email input + button to invite a user to a team.
// Props:
//   teamId - the team to invite the user to

import { useState } from "react";

const API_URL = "http://localhost:5000/api/teams/invite";

function InviteUser({ teamId }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Success or error message
  const [isError, setIsError] = useState(false);

  // Get token from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!email.trim()) {
      setMessage("Please enter an email address");
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ teamId, email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to invite user");
      }

      setMessage(data.message || "Invitation sent!");
      setIsError(false);
      setEmail(""); // Clear input on success
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">
        Invite Member
      </h4>

      <form onSubmit={handleInvite} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email to invite..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white font-medium text-sm hover:from-[#22d3ee] hover:to-[#06b6d4] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
        >
          {loading ? "Sending..." : "Invite"}
        </button>
      </form>

      {/* Feedback message */}
      {message && (
        <p
          className={`text-sm px-3 py-2 rounded-lg ${
            isError
              ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20"
              : "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default InviteUser;
