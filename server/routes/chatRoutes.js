const express = require("express")
const { getUsers, getMessages, sendMessage, markAsRead, editMessage, deleteMessage, sendAudioMessage } = require("../controllers/chatController")
const { protect } = require("../middleware/authMiddleware")
const uploadAudio = require("../middleware/audioUpload")

const router = express.Router()

router.get("/users", protect, getUsers)
router.get("/messages/:userId", protect, getMessages)
router.post('/message', protect, sendMessage)
router.post('/audio-message', protect, uploadAudio.single('audio'), sendAudioMessage)
router.put('/read/:userId', protect, markAsRead)
router.put('/message/:messageId', protect, editMessage)
router.delete("/message/:messageId", protect, deleteMessage)

module.exports = router