// ============================
// TeamChat Component
// ============================
// Displays team chat messages and an input to send new messages.
// Props:
//   teamId   - the ID of the team
//   messages - array of message objects
//   onSend   - function to call when sending a message (receives text)

import { useState, useEffect, useRef } from "react";

function TeamChat({ teamId, messages, onSend }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Get current user from localStorage to highlight own messages
  const user = JSON.parse(localStorage.getItem("user"));

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    await onSend(text.trim());
    setText("");
    setSending(false);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-[#1e293b] rounded-2xl border border-[#334155] flex flex-col h-[500px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#334155]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Team Chat
        </h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-[#94a3b8]">
            <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}

        {messages.map((msg) => {
          const isOwnMessage = msg.sender?._id === user?._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isOwnMessage
                    ? "bg-[#6366f1] text-white rounded-br-md"
                    : "bg-[#334155] text-[#f1f5f9] rounded-bl-md"
                }`}
              >
                {/* Sender name (hide for own messages) */}
                {!isOwnMessage && (
                  <p className="text-xs font-semibold text-[#06b6d4] mb-1">
                    {msg.sender?.name || "Unknown"}
                  </p>
                )}
                {/* Message text */}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {/* Timestamp */}
                <p
                  className={`text-[10px] mt-1 ${
                    isOwnMessage ? "text-white/60" : "text-[#94a3b8]"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-[#334155]">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white hover:from-[#818cf8] hover:to-[#6366f1] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeamChat;
