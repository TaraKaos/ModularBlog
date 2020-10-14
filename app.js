var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require('mongoose'),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOveride = require("method-override"),
    Settings      = require("./models/settings"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

//requiring routes
var indexRoutes     = require("./routes/index"),
    adminRoutes     = require("./routes/admin"),
    postsRoutes     = require("./routes/posts"),
    linksRoutes     = require("./routes/links"),
    donationsRoutes = require("./routes/donations");

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

// setup routes
app.use(indexRoutes);
app.use(adminRoutes);
app.use(postsRoutes);
app.use(linksRoutes);
app.use(donationsRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function()
{
    console.log("The Modular Blog server has started!");
});