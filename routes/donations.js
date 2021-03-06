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

// New Donation
router.get("/donations/new", isLoggedIn, function(req, res)
{
    res.render("donations/new");
});

// Create Donation
router.post("/donations", isLoggedIn, function(req, res)
{
    //create a new post and save to DB
    Donation.create(req.body.donation, function(err, newlyCreatedDonation)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            // redirect back to posts page
            res.redirect("/admin/donationLinks");
        }
    });
});

// Edit Donation
router.get("/donations/:id/edit", isLoggedIn, function(req, res)
{
    //find the donation with provided ID
    Donation.findById(req.params.id, function(err, foundDonation)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            res.render("./donations/edit", {donation: foundDonation});
        }
    });
});

// Update Donation
router.put("/donations/:id", isLoggedIn, function(req, res)
{
    //find the donation with provided ID
    Donation.findByIdAndUpdate(req.params.id, req.body.donation, function(err, foundDonation)
    {
        if (err)
        {
            console.log(err);
        }

        res.redirect("/admin/donationLinks");
    });
});

// DESTORY Donation
router.delete("/donations/:id", isLoggedIn, function(req, res)
{
	Donation.findByIdAndRemove(req.params.id, function(err, donationRemoved)
	{
    	if (err) 
		{
        	console.log(err);
        }
        
        res.redirect("/admin/donationLinks");
    });
});

function isLoggedIn(req, res, next)
{
    if (req.isAuthenticated())
    {
		return next();
	}
	
	res.redirect("/admin");
}

module.exports = router;