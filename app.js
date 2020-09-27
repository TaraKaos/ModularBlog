var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var Post = require("./models/post");
var Settings = require("./models/settings");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/modularblog", 
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
    Settings.findOne({}, function(err, settings)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(settings);

            res.render("home", {settings});
        }
    });
});

//Get Posts
app.get("/Posts", function(req, res)
{
    Settings.findOne({}, function(err, settings)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(settings);

            // get all posts from db
            Post.find({}, function(err, posts)
            {
                if (err)
                {
                    console.log(err);
                } 
                else 
                {
                    res.render('posts/index', {posts: posts, settings: settings});
                }
            });
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
            res.redirect("/Posts", {settings});
        }
    });
});

//New Post
app.get("/posts/new", function(req, res)
{
    Settings.findOne({}, function(err, settings){
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(settings);
            
            res.render("posts/new", {settings});
        }
    });
});

//Show Post
app.get("/posts/:id", function(req, res)
{
    Settings.findOne({}, function(err, settings)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(settings);
            
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
                    res.render("posts/show", {post: foundPost, settings: settings});
                }
            });
        }
    });
});

//Lefty Links
app.get("/LeftyLinks", function(req, res)
{
    Settings.findOne({}, function(err, settings)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(settings);
            
            res.render("leftylinks", {settings});
        }
    });
});

//Donations
app.get("/Donate", function(req, res)
{
    Settings.findOne({}, function(err, settings)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(settings);
            
            res.render("donate", {settings});
        }
    });
});

//Admin Portal
app.get("/Admin", function(req, res)
{
    Settings.findOne({}, function(err, settings)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log(settings);
            
            res.render("admin", {settings});
        }
    });
});

app.post("/Admin", function(req, res)
{
    console.log(req.body);

    var newSettings = {
        headerLeftImageURL: req.body.headerLeftImageURL,
        headerTitle: req.body.headerTitle,
        headerRightImageURL: req.body.headerRightImageURL,
        homeLeftImageURL: req.body.homeLeftImageURL,
        homeAboutMe: req.body.homeAboutMe,
        homeAboutMeSignature: req.body.homeAboutMeSignature,
        homeRightImageURL: req.body.homeRightImageURL
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
    
    res.redirect("/admin");
});

app.listen(process.env.PORT || 3000, process.env.IP, function()
{
    console.log("The Commie Angel server has started!");
});