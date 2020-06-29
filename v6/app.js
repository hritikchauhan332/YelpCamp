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


app.get("/",function(req,res){
	res.render("landing");
});

app.get("/campgrounds",function(req,res){
		//res.render("campgrounds",{campgrounds : campgrounds});
		Campground.find({},function(err,allcampgrounds){
			if(err){
				console.log(err);
			}
			else{
				res.render("campgrounds/index",{campgrounds : allcampgrounds});
			}
		});
	});

app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newcampground = {name : name, image : image , description: desc};
	Campground.create(newcampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	})
	
});

app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err)
			{
				console.log(err);
			} else{
				res.render("campgrounds/show" , {campground : foundCampground});
			}
	});
});


app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {campground : campground})
		}
	});
});

app.post("/campgrounds/:id/comments" , isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});

//Passport Authentication

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	var newUser = new User({username : req.body.username});
	User.register(newUser,req.body.password, function(err , user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/campgrounds");
		});
	});
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{successRedirect : "/campgrounds", failureRedirect : "/login"}),function(req,res){
	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


app.listen(process.env.PORT || 3000,process.env.IP, function(){
console.log("YelpCamp Server has started ^_^");
});