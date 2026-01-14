const socketIO = require("socket.io")

const socket = (server) => {
    const io = socketIO(server, {
        cors: {origin: "*"}
    })

    io.on("connection", socket => {

        socket.on("join", userId => {
            socket.join(userId)
        })

        socket.on("sendMessage", msg => {
            io.to(msg.receiver).emit("newMessage", msg)
        })

        socket.on("disconnect", () => {})
    })
}

module.exports = socket