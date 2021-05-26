const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    room:  {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
});
module.exports = Item = mongoose.model('chat', ChatSchema); 