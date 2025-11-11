const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const ApiError = require('../utils/ApiError')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      throw new ApiError('Not authorized, token failed', 401)
    }
  }

  if (!token) {
    throw new ApiError('Not authorized, no token', 401)
  }
})

module.exports = { protect }
