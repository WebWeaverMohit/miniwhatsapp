const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp')

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profileImage: {
    type: String,
    default: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg"
  },
  socketId: String,
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupChat'
    }
  ],
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  }
})

userSchema.plugin(plm)

module.exports = mongoose.model("user", userSchema)