var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require("jsonwebtoken")

var QuestionSchema = new mongoose.Schema({
	questionBody: String,
	createdDate: Date,
	answered: Boolean,
	generalPoints: Number,
	dateDeleted: Date,
	questionLocation: Number,
	homeLocation: {
		lat: Number, 
		lng: Number
	},
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
