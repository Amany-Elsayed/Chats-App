const express = require("express")
const { getUsers, getMessages, sendMessage } = require("../controllers/chatController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/users", protect, getUsers)
router.get("/messages/:userId", protect, getMessages)
router.post('/message', protect, sendMessage)

module.exports = router