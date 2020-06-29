 var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
router.get("/",function(req,res){
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

router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	var newcampground = {name : name, image : image , description: desc, price: price, author:author};
	Campground.create(newcampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	})
	
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err)
			{
				console.log(err);
			} else{
				res.render("campgrounds/show" , {campground : foundCampground});
			}
	});
});
// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

module.exports = router;