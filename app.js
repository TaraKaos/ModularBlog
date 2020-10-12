var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require('mongoose'),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOveride = require("method-override"),
    Post          = require("./models/post"),
    Settings      = require("./models/settings"),
    User          = require("./models/user"),
    Link          = require("./models/link"),
    Donation      = require("./models/donation"),
    seedDB        = require("./seeds");

mongoose.connect("mongodb://localhost:27017/modularblog", 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOveride("_method"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This is my secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next)
{
    Settings.findOne({}, function(err, settings)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            res.locals.currentUser = req.user;
            res.locals.settings = settings;
            next();
        }
    });
});

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

//Show Post
app.get("/posts/:id", function(req, res)
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

//Links
app.get("/Links", function(req, res)
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

//Donations
app.get("/Donate", function(req, res)
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

// ---ADMIN/LOGIN ROUTES---

// handling login logic
app.post("/admin/login", passport.authenticate("local", 
	{
		successRedirect: "/admin", 
		failureRedirect: "/admin/login"
    }), function (req, res){   
});

// logic route
app.get("/admin/logout", function(req, res)
{
	req.logout();
	res.redirect("/admin");
});

// show register form
app.get("/admin/register", isLoggedIn, function(req, res)
{
	res.render("admin/register");
});

//handle sign up logic
app.post("/admin/register", isLoggedIn, function(req, res)
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

//Admin Page
app.get("/admin", function(req, res)
{
    res.render("admin/index");
});

//Admin Settings
app.get("/admin/settings", isLoggedIn, function(req, res)
{
    res.render("admin/settings");
});

app.post("/admin/settings", isLoggedIn, function(req, res)
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

// Admin - Posts
app.get("/admin/posts", isLoggedIn, function(req, res)
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
app.get("/admin/newPost", isLoggedIn, function(req, res)
{
    res.render("posts/new");
});

//Create Post
app.post("/Posts", isLoggedIn, function(req, res)
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
app.get("/posts/:id/edit", isLoggedIn, function(req, res)
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

app.put("/posts/:id", isLoggedIn, function(req, res)
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
app.delete("/posts/:id", isLoggedIn, function(req, res)
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

// Admin - Links
app.get("/admin/links", isLoggedIn, function(req, res)
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
            res.render("/admin/links", {links: links});
        }
    });
});

// Admin - Donation Links
app.get("/admin/donationLinks", isLoggedIn, function(req, res)
{
    res.render("admin/donationLinks");
});

function isLoggedIn(req, res, next)
{
    if (req.isAuthenticated())
    {
		return next();
	}
	
	res.redirect("/admin");
}

app.listen(process.env.PORT || 3000, process.env.IP, function()
{
    console.log("The Modular Blog server has started!");
});