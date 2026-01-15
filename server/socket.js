const Message = require("./models/Message");

const socket = (server) => {
  const io = require("socket.io")(server, {
    cors: { origin: "*" }
  })

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id)

    socket.on("join", (userId) => {
      socket.join(userId)
    })

    socket.on("sendMessage", async (msg) => {
      console.log("Incoming message:", msg)

      const savedMessage = await Message.create({
        sender: msg.sender,
        receiver: msg.receiver,
        content: msg.content
      })

      io.to(msg.receiver).emit("newMessage", savedMessage)
    })
  })
}

module.exports = socket
