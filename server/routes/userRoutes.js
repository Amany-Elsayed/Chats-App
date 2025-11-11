const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/userController')
const {protect} = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').get(protect, allUsers)
router.post('/register', registerUser)
router.post('/login', authUser)

module.exports = router