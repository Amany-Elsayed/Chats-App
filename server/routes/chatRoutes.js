const express = require("express")
const { getUsers, getMessages, sendMessage, markAsRead } = require("../controllers/chatController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/users", protect, getUsers)
router.get("/messages/:userId", protect, getMessages)
router.post('/message', protect, sendMessage)
router.put('/read/:userId', protect, markAsRead)

module.exports = router