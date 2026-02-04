const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const Message = require("../models/Message")
const ApiError = require("../utils/ApiError")

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

const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, content } = req.body

    if (!receiverId || !content) {
        throw new ApiError('Missing receiverId or content', 400)
    }

    const message = await Message.create({
        sender: req.userId,
        receiver: receiverId,
        type: 'text',
        content
    })

    res.status(201).json(message)
})

const sendAudioMessage = asyncHandler(async (req, res) => {
    const { receiverId, duration } = req.body

    if (!req.file) throw new ApiError('No audio file uploaded', 400)

    const audioUrl = `uploads/audio/${req.file.filename}`

    res.status(201).json({
        receiverId,
        audioUrl,
        duration
    })
})

const markAsRead = asyncHandler(async (req, res) => {
    const { userId } = req.params

    await Message.updateMany(
        { sender: userId, receiver: req.userId, read: false },
        { read: true }
    )

    res.sendStatus(200)
})

const editMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params
    const { content } = req.body

    const msg = await Message.findById(messageId)

    if (!msg) throw new ApiError('message not found', 404)
    if (msg.sender.toString() !== req.userId)
        throw new ApiError('not authorized', 403)

    msg.content = content
    msg.isEdited = true
    await msg.save()

    res.json(msg)
})

const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params
    
    const msg = await Message.findById(messageId)

    if (!msg) throw new ApiError('message not found', 404)
    if (msg.sender.toString() !== req.userId)
        throw new ApiError('not authorized', 403)

    await msg.deleteOne()

    res.sendStatus(200)
})

module.exports = { getUsers, getMessages, sendMessage, markAsRead, editMessage, deleteMessage, sendAudioMessage }