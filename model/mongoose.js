const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/messenger');
module.exports = mongoose