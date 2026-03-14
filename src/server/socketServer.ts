import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId: string) => {

  const clients = io.sockets.adapter.rooms.get(roomId);

  socket.join(roomId);

  console.log(`${socket.id} joined room ${roomId}`);

  if (clients) {
    clients.forEach((clientId) => {
      socket.emit("user-joined", clientId);
    });
  }

  socket.to(roomId).emit("user-joined", socket.id);
});
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  socket.on("offer", ({ offer, target }) => {
  io.to(target).emit("offer", {
    offer,
    from: socket.id,
  });
});

socket.on("answer", ({ answer, target }) => {
  io.to(target).emit("answer", {
    answer,
    from: socket.id,
  });
});

socket.on("ice-candidate", ({ candidate, target }) => {
  io.to(target).emit("ice-candidate", {
    candidate,
    from: socket.id,
  });
});
socket.on("chat-message", ({ message, roomId }) => {

  io.to(roomId).emit("chat-message", {
    message,
    sender: socket.id,
  });

});

});


const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Signaling server running on ${PORT}`);
});