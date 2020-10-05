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
    siteTitle: String,
    navbarHomeButtonTitle: String,
	navbarPostButtonTitle: String,
	navbarLinksButtonTitle: String,
	navbarDonateButtonTitle: String,
	navbarSettingsButtonTitle: String,
	navbarRegisterButtonTitle: String,
    navbarLogoutButtonTitle: String,
    navbarTwitterURL: String
});

module.exports = mongoose.model("Settings", settingsSchema);