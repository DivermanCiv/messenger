const mongoose = require('./mongoose')

const discussionSchema = new mongoose.Schema({
    author: {

    },
    messages: {

    },
    members: {

    },
}, {timestamps: true});

const DiscussionModel = mongoose.model('discussion', discussionSchema);

module.exports = DiscussionModel