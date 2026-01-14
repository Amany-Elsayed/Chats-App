const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const http = require('http')
const mongoose = require('mongoose')
const socket = require("./socket") 
const chatRoutes = require("./routes/chatRoutes")
const authRoutes = require("./routes/authRoutes")

dotenv.config() 

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)

socket(server)

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

server.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
})

