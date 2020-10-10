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
    navbarTwitterURL: String,
    navbarAdminButtonTitle: String,
    adminPostsTitle: String,
	adminLinksTitle: String,
	adminDonationTitle: String,
	adminRegisterTitle: String,
	adminSettingsTitle: String,
	adminLogoutTitle: String,
    footerCopyright: String
});

module.exports = mongoose.model("Settings", settingsSchema);