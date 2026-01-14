const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const Message = require("../models/Message")

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({
        _id: { $ne: req.userId}
    }).select("-password")

    res.json(users)
})

const getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const messages = await Message.find({
        $or: [
            { sender: req.userId, receiver: userId },
            { sender: userId, receiver: req.userId }
        ]
    }).sort({ createdAt: 1 }).limit(50)

    res.json(messages)
})

module.exports = { getUsers, getMessages }