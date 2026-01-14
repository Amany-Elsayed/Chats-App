const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: [true, "Please enter username"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "This email already exists"],
        match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },
    password: {
        type: String, 
        required: [true, "Password is manditory"],
        minlength: 6
    }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)