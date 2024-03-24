const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: String,
    media: String, 
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Status', statusSchema);