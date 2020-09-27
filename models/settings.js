var mongoose = require("mongoose");

// SCHEMA SETUP
var settingsSchema = new mongoose.Schema({
    headerTitle: String
});

module.exports = mongoose.model("Settings", settingsSchema);