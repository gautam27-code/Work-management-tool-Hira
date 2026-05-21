import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../store/store";
import { apiPut } from "../services/api";

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const notifications = useStore(state => state.notifications);
  const unreadCount = useStore(state => state.unreadNotifications);
  const markRead = useStore(state => state.markNotificationRead);
  const markAllRead = useStore(state => state.markAllNotificationsRead);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiPut("/notifications/read-all", {});
      markAllRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await apiPut(`/notifications/${notification._id}/read`, {});
        markRead(notification._id);
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[#334155] transition-colors text-[#94a3b8] hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] overflow-hidden z-50 animate-scale-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155] bg-[#0f172a]">
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs text-[#6366f1] hover:text-white transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[#94a3b8] text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-[#334155]">
                {notifications.map((notif) => (
                  <Link
                    key={notif._id}
                    to={notif.link || "#"}
                    onClick={() => handleNotificationClick(notif)}
                    className={`block p-4 hover:bg-[#334155] transition-colors ${!notif.read ? 'bg-[#334155]/30' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>}
                      </div>
                      <div>
                        <p className={`text-sm ${!notif.read ? 'text-white font-medium' : 'text-[#e2e8f0]'}`}>
                          {notif.text}
                        </p>
                        <p className="text-xs text-[#64748b] mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
