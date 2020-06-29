var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/yelp_camp" , {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");

// SCHEMA SETUP

var campgroundschema = new mongoose.Schema({
	name : String,
	image : String,
	description : String
});

var Campground = mongoose.model("Campground",campgroundschema);

// Campground.create(
// 	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
// 	 description : "lorem 50"
// 	},function(err,campground){
// 		if(err)
// 			{
// 				console.log(err);
// 			}
// 		else{
// 			console.log("Newly Created Campground");
// 			console.log(campground);
// 		}
// 	});




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
	Campground.findById(req.params.id,function(err, foundCampground){
		if(err)
			{
				console.log(err);
			} else{
				res.render("show" , {campground : foundCampground});
			}
	});
});

app.listen(process.env.PORT || 3000,process.env.IP, function(){
console.log("YelpCamp Server has started");
});