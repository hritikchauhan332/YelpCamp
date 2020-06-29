var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground")
var seedDB     = require("./seeds");


seedDB();
mongoose.connect("mongodb://localhost/yelp_camp" , {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");

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
				res.render("index",{campgrounds : allcampgrounds});
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
	res.render("new.ejs");
});

app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err)
			{
				console.log(err);
			} else{
				res.render("show" , {campground : foundCampground});
			}
	});
});

app.listen(process.env.PORT || 3000,process.env.IP, function(){
console.log("YelpCamp Server has started ^_^");
});