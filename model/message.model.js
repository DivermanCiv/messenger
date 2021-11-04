const mongoose = require('./mongoose')
const UserModel = require('./user.model')
const DiscussionModel = require('./discussion.model')
const messageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true,
        validate: {
            validator: async (value) => {
                return UserModel.findOne({id: value});
            },
            message: "User doesn't exist!"
        }
    },
    content: {
        type: String,
        required: true
    },
    discussion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "discussion",
        required: true,
        validate: {
            validator: async (value) => {
                const discussions = await DiscussionModel.find({_id: value});
                return discussions.length >= 1
            },
            message: "The discussion doesn't exist!"
        }
    },
}, {timestamps: true});




const MessageModel = mongoose.model('message', messageSchema);

module.exports = MessageModel