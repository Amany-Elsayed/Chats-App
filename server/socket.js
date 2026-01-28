const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

const onlineUsers = new Set()

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

      onlineUsers.add(userId)
      io.emit("userOnline", userId)
      socket.emit("onlineUsers", Array.from(onlineUsers))

      console.log("Socket connected:", userId);

      socket.on('typing', ({ receiverId }) => {
        socket.to(receiverId).emit('userTyping', { userId })
      })

      socket.on('stopTyping', ({ receiverId }) => {
        socket.to(receiverId).emit('userStopTyping', { userId })
      })

      socket.on("sendMessage", async ({ receiverId, content }) => {
        if (!receiverId || !content) return

        const isReceiverOnline = onlineUsers.has(receiverId)

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content,
          delivered: isReceiverOnline,
          read: false
        });

        const messageObj = {
          _id: message._id.toString(),
          sender: message.sender.toString(),
          receiver: message.receiver.toString(),
          content: message.content,
          delivered: isReceiverOnline,
          read: false,
          createdAt: message.createdAt
        };

        io.to(receiverId).emit("receiveMessage", messageObj);
        io.to(userId).emit("receiveMessage", messageObj);

        if (isReceiverOnline) {
          io.to(userId).emit('messageStatusUpdate', {
            messageId: message._id.toString(),
            delivered: true
          })
        }
      });

      socket.on("editMessage", async ({ messageId, content }) => {
        const msg = await Message.findById(messageId)
        if (!msg) return
        if (msg.sender.toString() !== userId) return

        msg.content = content
        msg.isEdited = true
        await msg.save()

        const payload = {
          messageId,
          content,
          isEdited: true
        }

        io.to(msg.sender.toString()).emit("messageEdited", payload)
        io.to(msg.receiver.toString()).emit("messageEdited", payload)
      })

      socket.on("deleteMessage", async ({ messageId }) => {
        const msg = await Message.findById(messageId)
        if (!msg) return
        if (msg.sender.toString() !== userId) return

        await msg.deleteOne()

        io.to(msg.sender.toString()).emit("messageDeleted", { messageId })
        io.to(msg.receiver.toString()).emit("messageDeleted", { messageId })
      })

      socket.on('messageDelivered', async ({ messageId }) => {
        const msg = await Message.findByIdAndUpdate(
          messageId,
          { delivered: true },
          { new: true }
        )

        if (!msg) return

        io.to(msg.sender.toString()).emit('messageStatusUpdate', {
          messageId,
          delivered: true
        })
      })

      socket.on('messageRead', async ({ messageIds }) => {
        if (!Array.isArray(messageIds) || !messageIds.length) return

        const messages = await Message.find(
          { _id: { $in: messageIds } },
          { sender: 1 }
        )

        await Message.updateMany(
          { _id: { $in: messageIds } },
          { read: true, delivered: true, readAt: new Date() }
        )

        messages.forEach(msg => {
          io.to(msg.sender.toString()).emit('messageReadUpdate', {
            messageId: msg._id.toString()
          })
        })
      })

      socket.on("disconnect", () => {
        onlineUsers.delete(userId)
        io.emit('userOffline', userId)
        console.log("Socket disconnected:", userId);
      });

    } catch (err) {
      console.error("Socket auth error:", err.message);
      socket.disconnect();
    }
  });
};

module.exports = socketServer;
