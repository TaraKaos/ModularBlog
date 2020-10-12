var mongoose = require("mongoose");

// SCHEMA SETUP
var donationSchema = new mongoose.Schema({
    title: String,
    URL: String
});

module.exports = mongoose.model("Donation", donationSchema);