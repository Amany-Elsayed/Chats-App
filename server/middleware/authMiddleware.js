const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/ApiError")
const jwt = require("jsonwebtoken")

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError("Not authorized, no token", 401)
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        next()
    } catch {
        throw new ApiError("Not authorized, token failed", 401)
    }
})

module.exports = { protect }