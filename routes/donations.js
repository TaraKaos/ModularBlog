var express = require("express");
var router = express.Router();
var Donation = require("../models/donation");

//Donations
router.get("/Donate", function(req, res)
{
    // get all donations from db
    Donation.find({}, function(err, donations)
    {
        if (err)
        {
            console.log(err);
        } 
        else 
        {
            res.render("donations/index", {donations: donations});
        }
    });
});

module.exports = router;