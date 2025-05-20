import { Server } from "socket.io";
import http from "http";

let io;

export const initializeSocket = (app) => {
  const server = http.createServer(app);
  
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  
  io.on("connection", (socket) => {
    console.log("New client connected");
    
    // Join a room based on user_id for targeted notifications
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their notification channel`);
    });
    
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  
  return server;
};

export { io };