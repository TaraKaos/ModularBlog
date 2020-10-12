var mongoose = require("mongoose");

// SCHEMA SETUP
var linkSchema = new mongoose.Schema({
    title: String,
    URL: String
});

module.exports = mongoose.model("Link", linkSchema);