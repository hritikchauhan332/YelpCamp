var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground")
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash       = require("connect-flash");

var indexRoutes      = require("./routes/index");
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");


 //mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
//seedDB();
//var url = process.env.DATABASEURL || "mongodb://localhost";
// mongoose.connect("mongodb://localhost", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
//  	console.log('Connected to DB!');
//  }).catch(err => {
// 	console.log('ERROR:', err.message);
//  });
// mongoose.connect("mongodb://localhost/yelp_camp" , {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect('mongodb+srv://killer:killer@10@cluster0-i14xt.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});;



app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



app.listen(process.env.PORT || 3000,process.env.IP, function(){
console.log("YelpCamp Server has started ^_^");
});