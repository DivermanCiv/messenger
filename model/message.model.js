const mongoose = require('./mongoose')
const UserModel = require('./user.model')
const DiscussionModel = require('./discussion.model')
const i18n = require('../i18n.config')

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
            message: i18n.t("User doesn't exist!")
        }
    },
    content: {
        type: String,
        required: true
    },
    content_history: {
        type: Array,
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
            message: i18n.t("The discussion doesn't exist!")
        }
    },
}, {timestamps: true});




const MessageModel = mongoose.model('message', messageSchema);

module.exports = MessageModel