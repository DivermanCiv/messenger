const mongoose = require('./mongoose')
const UserModel= require("./user.model");
const i18n = require('../i18n.config')

const discussionSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        validate: {
            validator: async (value) => {
                return UserModel.findOne({_id: value})
            },
            message: i18n.t("User doesn't exist!")
        }
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
}, {timestamps: true});

discussionSchema.pre('save', function (next) {
    const discussion = this
    discussion.members.unshift(discussion.author)
    next()
})

const DiscussionModel = mongoose.model('discussion', discussionSchema);

module.exports = DiscussionModel