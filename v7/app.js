var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground")
var seedDB     = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");



var indexRoutes      = require("./routes/index");
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");


//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp" , {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));


app.use(require("express-session")({
	secret:"Fairy Tail is the best anime till now",
	resave : false,
	saveUninitialized : false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});
app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT || 3000,process.env.IP, function(){
console.log("YelpCamp Server has started ^_^");
});