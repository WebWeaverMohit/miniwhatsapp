const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    description: String,
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', required: true
            },
            content: String,
        }
    ],
    image: String,
});

const GroupChat = mongoose.model('GroupChat', groupChatSchema);

module.exports = GroupChat;
