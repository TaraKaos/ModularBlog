var express = require("express");
var router = express.Router();
var Post = require("../models/post");

//Get Posts
router.get("/Posts", function(req, res)
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
            res.render('posts/index', {posts: posts});
        }
    });
});

//Show Post
router.get("/posts/:id", function(req, res)
{
    //find the post with provided ID
    Post.findOne({_id: req.params.id}, function(err, foundPost)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(foundPost);
            //render show template with that campground
            res.render("posts/show", {post: foundPost});
        }
    });
});

//Create Post
router.post("/Posts", isLoggedIn, function(req, res)
{
    //get data from form and add to Posts array
    var title = req.body.title;
    var image = req.body.image;
    var content = req.body.content;
    var newPost = {title: title, image: image, content: content};

    //create a new post and save to DB
    Post.create(newPost, function(err, newlyCreatedPost)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            // redirect back to posts page
            res.redirect("/admin/posts");
        }
    });
});

//Edit Post
router.get("/posts/:id/edit", isLoggedIn, function(req, res)
{
    //find the post with provided ID
    Post.findById(req.params.id, function(err, foundPost)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(foundPost);
            //render show template with that campground
            res.render("posts/edit", {post: foundPost});
        }
    });
});

// Update Post
router.put("/posts/:id", isLoggedIn, function(req, res)
{
    //find the post with provided ID
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, foundPost)
    {
        if (err)
        {
            console.log(err);

            res.redirect("/posts");
        }
        else
        {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

// DESTORY Post ROUTE
router.delete("/posts/:id", isLoggedIn, function(req, res)
{
	Post.findByIdAndRemove(req.params.id, function(err, postRemoved)
	{
    	if (err) 
		{
        	console.log(err);
        }
        
        res.redirect("/admin/posts");
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