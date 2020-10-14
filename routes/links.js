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

module.exports = router;