const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    highscore: {type: Number, default: 0},
    tries: {type: Number, default: 0},
    wins: {type: Number, default: 0},
    score: {type: Number, default: 0},
    roll: {type: Number, default: 5000}
})
const User = mongoose.model('user', userSchema)
module.exports = User