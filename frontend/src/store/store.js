import { create } from "zustand";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  teams: [],
  notifications: [],
  unreadNotifications: 0,
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },
  
  setTeams: (teams) => set({ teams }),
  
  setNotifications: (notifications) => set({ 
    notifications,
    unreadNotifications: notifications.filter(n => !n.read).length
  }),
  
  addNotification: (notification) => set((state) => {
    const updated = [notification, ...state.notifications];
    return {
      notifications: updated,
      unreadNotifications: updated.filter(n => !n.read).length
    };
  }),

  markNotificationRead: (id) => set((state) => {
    const updated = state.notifications.map(n => 
      n._id === id ? { ...n, read: true } : n
    );
    return {
      notifications: updated,
      unreadNotifications: updated.filter(n => !n.read).length
    };
  }),
  
  markAllNotificationsRead: () => set((state) => {
    const updated = state.notifications.map(n => ({ ...n, read: true }));
    return {
      notifications: updated,
      unreadNotifications: 0
    };
  }),

  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { id: Date.now(), ...toast }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  }))
}));

export default useStore;
