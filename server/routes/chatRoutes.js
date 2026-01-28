const express = require("express")
const { getUsers, getMessages, sendMessage, markAsRead, editMessage, deleteMessage } = require("../controllers/chatController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/users", protect, getUsers)
router.get("/messages/:userId", protect, getMessages)
router.post('/message', protect, sendMessage)
router.put('/read/:userId', protect, markAsRead)
router.put('/message/:messageId', protect, editMessage)
router.delete("/message/:messageId", protect, deleteMessage)

module.exports = router