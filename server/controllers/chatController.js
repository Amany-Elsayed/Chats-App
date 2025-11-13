const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const ApiError = require('../utils/ApiError')

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body
  if (!userId) throw new ApiError("UserId not sent with request", 400)

  let chat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } }
    ]
  })
    .populate("users", "-password")
    .populate("latestMessage")

  if (chat) {
    res.send(chat)
  } else {
    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId]
    })
    const fullChat = await Chat.findById(newChat._id).populate("users", "-password")
    res.status(200).send(fullChat)
  }
})

const fetchChats = asyncHandler(async (req, res) => {
  let chats = await Chat.find({users: {$elemMatch: {$eq: req.user._id}}}).populate('users', '-password').populate('groupAdmin', '-password').populate('latestMessage').sort({updatedAt: -1})

  chats = await User.populate(chats, {
    path: 'latestMessage.sender',
    select: 'name pic email'
  })

  res.status(200).send(chats)
})

module.exports = { accessChat, fetchChats }