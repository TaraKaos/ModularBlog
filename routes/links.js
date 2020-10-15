var express = require("express");
var router = express.Router();
var Link = require("../models/link");

// Links
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

// New Link
router.get("/links/new", isLoggedIn, function(req, res)
{
    res.render("links/new");
});

// Create Link
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

// Edit Link
router.get("/links/:id/edit", isLoggedIn, function(req, res)
{
    //find the post with provided ID
    Link.findById(req.params.id, function(err, foundLink)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(foundLink);
            //render show template with that campground
            res.render("./links/edit", {link: foundLink});
        }
    });
});

// Update Link
router.put("/links/:id", isLoggedIn, function(req, res)
{
    console.log(req.body.link);

    //find the post with provided ID
    Link.findByIdAndUpdate(req.params.id, req.body.link, function(err, foundLink)
    {
        if (err)
        {
            console.log(err);

            res.redirect("/admin/links");
        }
        else
        {
            res.redirect("/admin/links");
        }
    });
});

// DESTORY Link
router.delete("/links/:id", isLoggedIn, function(req, res)
{
	Link.findByIdAndRemove(req.params.id, function(err, linkRemoved)
	{
    	if (err) 
		{
        	console.log(err);
        }
        
        res.redirect("/admin/links");
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