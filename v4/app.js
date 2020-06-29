var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground")
var seedDB     = require("./seeds");
var Comment = require("./models/comment");

//seedDB();
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


app.get("/campgrounds/:id/comments/new", function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {campground : campground})
		}
	});
});

app.post("/campgrounds/:id/comments" , function(req,res){
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

app.listen(process.env.PORT || 3000,process.env.IP, function(){
console.log("YelpCamp Server has started ^_^");
});