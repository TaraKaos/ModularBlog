var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Settings = require("../models/settings");
var Post = require("../models/post");
var Link = require("../models/link");
const donation = require("../models/donation");

//Admin Page
router.get("/admin", function(req, res)
{
    res.render("admin/index");
});

//Admin Settings
router.get("/admin/settings", isLoggedIn, function(req, res)
{
    res.render("admin/settings");
});

router.post("/admin/settings", isLoggedIn, function(req, res)
{
    console.log(req.body);

    var newSettings = 
    {
        headerLeftImageURL: req.body.headerLeftImageURL,
        headerTitle: req.body.headerTitle,
        headerRightImageURL: req.body.headerRightImageURL,
        homeLeftImageURL: req.body.homeLeftImageURL,
        homeAboutMe: req.body.homeAboutMe,
        homeAboutMeSignature: req.body.homeAboutMeSignature,
        homeRightImageURL: req.body.homeRightImageURL,
        siteTitle: req.body.siteTitle,
        navbarHomeButtonTitle: req.body.navbarHomeButtonTitle,
	    navbarPostButtonTitle: req.body.navbarPostButtonTitle,
	    navbarLinksButtonTitle: req.body.navbarLinksButtonTitle,
	    navbarDonateButtonTitle: req.body.navbarDonateButtonTitle,
        navbarTwitterURL: req.body.navbarTwitterURL,
        navbarAdminButtonTitle: req.body.navbarAdminButtonTitle,
        adminPostsTitle: req.body.adminPostsTitle,
	    adminLinksTitle: req.body.adminLinksTitle,
	    adminDonationTitle: req.body.adminDonationTitle,
	    adminRegisterTitle: req.body.adminRegisterTitle,
	    adminSettingsTitle: req.body.adminSettingsTitle,
	    adminLogoutTitle: req.body.adminLogoutTitle,
        footerCopyright: req.body.footerCopyright
    };

    //Remove all settings
    Settings.deleteMany({}, function(err)
    {
        if (err)
        {
			console.log(err);
        }
        else
        {
            console.log("removed settings!");

            //Add Settings
            Settings.create(newSettings, function(err, settings)
            {
                if (err)
                {
			        console.log(err);
                } 
                else 
                {
			        console.log("Added Settings");
		        }
            });
        }
	});
    
    res.redirect("/admin/settings");
});

// handling login logic
router.post("/admin/login", passport.authenticate("local", 
	{
		successRedirect: "/admin", 
		failureRedirect: "/admin/login"
    }), function (req, res){   
});

// logout route
router.get("/admin/logout", function(req, res)
{
	req.logout();
	res.redirect("/admin");
});

// show register form
router.get("/admin/register", isLoggedIn, function(req, res)
{
	res.render("admin/register");
});

//handle sign up logic
router.post("/admin/register", isLoggedIn, function(req, res)
{
	var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user)
    {
		if (err)
		{
			console.log(err);
			return res.render("admin/register");
		}
        passport.authenticate("local")(req, res, function()
        {
			res.redirect("/admin/settings");
		});
	});
});

// Admin - Posts
router.get("/admin/posts", isLoggedIn, function(req, res)
{
    // get all posts from db
    Post.find({}, function(err, posts)
    {
        if (err)
        {
            console.log(err);
        } 
        else 
        {
            res.render('admin/posts', {posts: posts});
        }
    });
});

//New Post
router.get("/admin/newPost", isLoggedIn, function(req, res)
{
    res.render("posts/new");
});

// Admin - Links
router.get("/admin/links", isLoggedIn, function(req, res)
{
    // get all links from db
    Link.find({}, function(err, links)
    {
        if (err)
        {
            console.log(err);
        } 
        else 
        {
            res.render("./admin/links", {links: links});
        }
    });
});

// Admin - Donation Links
router.get("/admin/donationLinks", isLoggedIn, function(req, res)
{
    // get all donation links from db
    donation.find({}, function(err, donationLinks)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            res.render("./admin/donationLinks", {donations: donationLinks});
        }
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