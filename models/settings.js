var mongoose = require("mongoose");

// SCHEMA SETUP
var settingsSchema = new mongoose.Schema({
    headerLeftImageURL: String,
    headerTitle: String,
    headerRightImageURL: String,
    homeLeftImageURL: String,
    homeAboutMe: String,
    homeAboutMeSignature: String,
    homeRightImageURL: String,
    siteTitle: String
});

module.exports = mongoose.model("Settings", settingsSchema);