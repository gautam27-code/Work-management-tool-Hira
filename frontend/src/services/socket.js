import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";
let socket = null;

export const connectSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(SOCKET_URL, {
    auth: {
      token
    }
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect_error:", err.message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinTeam = (teamId) => {
  if (socket) {
    socket.emit("team:join", teamId);
  }
};

export const leaveTeam = (teamId) => {
  if (socket) {
    socket.emit("team:leave", teamId);
  }
};

export const joinUser = (userId) => {
  if (socket) {
    socket.emit("user:join", userId);
  }
};

export const subscribeToEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  }
};

export const unsubscribeFromEvent = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};
