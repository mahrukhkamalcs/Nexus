const socketIO = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Join meeting room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined ${roomId}`);

      socket.to(roomId).emit("user-joined", socket.id);
    });

    // WebRTC Offer
    socket.on("offer", (data) => {
      socket.to(data.roomId).emit("offer", data);
    });

    // WebRTC Answer
    socket.on("answer", (data) => {
      socket.to(data.roomId).emit("answer", data);
    });

    // ICE Candidate
    socket.on("ice-candidate", (data) => {
      socket.to(data.roomId).emit("ice-candidate", data);
    });

    // Toggle audio
    socket.on("toggle-audio", (data) => {
      socket.to(data.roomId).emit("toggle-audio", data);
    });

    // Toggle video
    socket.on("toggle-video", (data) => {
      socket.to(data.roomId).emit("toggle-video", data);
    });

    // Leave room
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = { initializeSocket };