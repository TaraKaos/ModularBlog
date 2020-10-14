var express = require("express");
var router = express.Router();
var Link = require("../models/link");

//Links
router.get("/Links", function(req, res)
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
            res.render("links/index", {links: links});
        }
    });
});

//New Link
router.get("/links/new", isLoggedIn, function(req, res)
{
    res.render("links/new");
});

//Create Link
router.post("/links", isLoggedIn, function(req, res)
{
    //get data from form and add to Posts array
    var title = req.body.title;
    var URL = req.body.URL;
    var newLInk = {title: title, URL: URL};

    //create a new post and save to DB
    Link.create(newLInk, function(err, newlyCreatedLink)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            // redirect back to posts page
            res.redirect("/admin/links");
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