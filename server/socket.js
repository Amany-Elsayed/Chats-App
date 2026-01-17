const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

const socketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        socket.disconnect();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      socket.userId = userId;
      socket.join(userId);

      console.log("Socket connected:", userId);

      socket.on("sendMessage", async ({ receiverId, content }) => {
        if (!receiverId || !content) return;

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content,
        });

        const messageObj = {
          _id: message._id.toString(),
          sender: message.sender.toString(),
          receiver: message.receiver.toString(),
          content: message.content,
          createdAt: message.createdAt
        };

        io.to(receiverId).emit("receiveMessage", messageObj);

        io.to(userId).emit("receiveMessage", messageObj);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", userId);
      });

    } catch (err) {
      console.error("Socket auth error:", err.message);
      socket.disconnect();
    }
  });
};

module.exports = socketServer;
