var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var Post = require("./models/post");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/thecommieangel", 
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function(req, res)
{
    res.render("home");
});

//Get Posts
app.get("/Posts", function(req, res)
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

//Create Post
app.post("/Posts", function(req, res)
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
            res.redirect("/Posts");
        }
    });
});

//New Post
app.get("/posts/new", function(req, res)
{
    res.render("posts/new");
});

//Show Post
app.get("/posts/:id", function(req, res)
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
            res.render("posts/show", {post: foundPost});
        }
    });
});

//Lefty Links
app.get("/LeftyLinks", function(req, res)
{
    res.render("leftylinks");
});

//Donations
app.get("/Donate", function(req, res)
{
    res.render("donate");
});

//Admin Portal
app.get("/Admin", function(req, res)
{
    res.render("admin");
});

app.listen(process.env.PORT || 3000, process.env.IP, function()
{
    console.log("The Commie Angel server has started!");
});