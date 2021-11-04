const mongoose = require('./mongoose')
const userSchema = require('./user.model')
const UserModel = require('./user.model')

const messageSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        index: true,
        validate: {
            validator: async (value) => {
                const users = await UserModel.find({username: value});
                return users.length >= 1
            },
            message: "User doesn't exist!"
        }
    },
    content: {
        type: String,
        required: true
    },
    discussion: {
        type: String,
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