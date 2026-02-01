const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

const onlineUsers = new Set();

const socketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return socket.disconnect();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      socket.userId = userId;
      socket.join(userId);

      onlineUsers.add(userId);
      io.emit("userOnline", userId);
      socket.emit("onlineUsers", Array.from(onlineUsers));

      socket.on("sendMessage", async ({ receiverId, content }) => {
        const isReceiverOnline = onlineUsers.has(receiverId);

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          type: "text",
          content,
          delivered: isReceiverOnline
        });

        io.to(receiverId).emit("receiveMessage", message);
        io.to(userId).emit("receiveMessage", message);
      });

      socket.on("editMessage", async ({ messageId, content }) => {
        const msg = await Message.findById(messageId);
        if (!msg || msg.sender.toString() !== userId) return;

        msg.content = content;
        msg.isEdited = true;
        await msg.save();

        io.to(msg.sender.toString()).emit("messageEdited", msg);
        io.to(msg.receiver.toString()).emit("messageEdited", msg);
      });

      socket.on("deleteMessage", async ({ messageId }) => {
        const msg = await Message.findById(messageId);
        if (!msg || msg.sender.toString() !== userId) return;

        await msg.deleteOne();

        io.to(msg.sender.toString()).emit("messageDeleted", { messageId });
        io.to(msg.receiver.toString()).emit("messageDeleted", { messageId });
      });

      socket.on("disconnect", () => {
        onlineUsers.delete(userId);
        io.emit("userOffline", userId);
      });

    } catch (err) {
      console.log("Socket error", err.message);
      socket.disconnect();
    }
  });
};

module.exports = socketServer;
