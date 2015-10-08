var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require("jsonwebtoken")

var QuestionSchema = new mongoose.Schema({
	userName: String,
	img: String,
	questionBody: String,
	createdDate: Date,
	answered: {type: mongoose.Schema.Types.ObjectId, ref: "Answer"},
	generalPoints: Number,
	isDeleted: Boolean,
	questionLocation: Number,
	lat: Number,
	lng: Number,
	tags: [{type: String}],
	upvote: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
	downvote: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
	voteNum: {type: Number, default: 0}, 
	postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	answers: [{type: mongoose.Schema.Types.ObjectId, ref: "Answer"}],
	comments: [{
		commentBody: String,
		createdDate: Date,
		dateDeleted: Date,
		postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
	}]
});



mongoose.model('Question', QuestionSchema);
