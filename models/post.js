var mongoose = require("mongoose");

// SCHEMA SETUP
var postSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String
});

module.exports = mongoose.model("Post", postSchema);