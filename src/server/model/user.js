const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'userName is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel