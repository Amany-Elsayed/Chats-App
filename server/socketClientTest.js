const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected to server with ID:", socket.id);

  const fakeUser = { _id: "12345", name: "Test User" };
  console.log("Emitting setup with user:", fakeUser);
  socket.emit("setup", fakeUser);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("connected", () => {
  console.log("Setup acknowledged by server");

  const chatId = "chat123";
  console.log("👥 Joining chat:", chatId);
  socket.emit("join chat", chatId);

  const message = {
    _id: "msg001",
    chat: {
      _id: "chat123",
      users: [{ _id: "12345" }, { _id: "67890" }],
    },
    sender: { _id: "12345", name: "Test User" },
    content: "Hello world!",
  };
  console.log("Sending message:", message.content);
  socket.emit("new message", message);
});

socket.on("message received", (msg) => {
  console.log("New message received:", msg);
});
