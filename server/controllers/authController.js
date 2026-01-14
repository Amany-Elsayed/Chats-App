const asyncHandler = require('express-async-handler')
const generateToken = require("../utils/generateToken")
const bcrypt = require('bcryptjs')
const ApiError = require('../utils/ApiError')
const User = require("../models/User")

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if(!username || !email || !password) {
        throw new ApiError("All fields are required", 400)
    }

    const userExists = await User.findOne({ email })
    if(userExists) {
        throw new ApiError("User already exists", 400)
    }

    const user = await User.create({ username, email, password })

    res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email
    })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) {
        throw new ApiError("Email and password are required", 400)
    }

    const user = await User.findOne({ email })
    if(!user) {
        throw new ApiError("Invalid credentials", 401)
    }

    if(!user || !(await user.matchPassword(password))) {
        throw new ApiError("Invalid credentials", 401)
    }

    res.json({
        token: generateToken(user._id),
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
})

module.exports = { register, login }