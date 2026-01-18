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

      socket.on('messageRead', async ({ senderId }) => {
        const messages = await Message.updateMany(
          {
            sender: senderId,
            receiver: socket.userId,
            read: false
          },
          {
            read: true,
            delivered: true,
            readAt: new Date()
          }
        )

        io.to(senderId).emit('messageRead', {
          readerId: socket.userId
        })
      })

      socket.on("sendMessage", async ({ receiverId, content }) => {
        if (!receiverId || !content) return;

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content,
          delivered: false,
          read: false
        });

        socket.on('typing', ({ receiverId }) => {
          socket.to(receiverId).emit('userTyping', {
            userId: userId
          })
        })

        socket.on('stopTyping', ({ receiverId }) => {
          socket.to(receiverId).emit('userStopTyping', {
            userId: userId
          })
        })

        const messageObj = {
          _id: message._id.toString(),
          sender: message.sender.toString(),
          receiver: message.receiver.toString(),
          content: message.content,
          delivered: false,
          read: false,
          createdAt: message.createdAt
        };

        io.to(receiverId).emit("receiveMessage", messageObj);

        io.to(userId).emit("receiveMessage", messageObj);
      });

      socket.on('messageDelivered', async ({ messageId }) => {
        await Message.findByIdAndUpdate(messageId, { delivered: true })

        io.to(socket.userId).emit('messageStatusUpdate', {
          messageId,
          delivered: true
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
