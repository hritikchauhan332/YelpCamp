var mongoose = require("mongoose");
var campgroundschema = new mongoose.Schema({
	name : String,
	image : String,
	description : String,
	price : String,
	contactName : String,
	contactNumber : String,
	location : String,
//	lat : Number,
	//lng : Number,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String,
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground",campgroundschema);
