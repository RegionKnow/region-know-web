var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require("jsonwebtoken")

var AnswerSchema = new mongoose.Schema({
	answerBody: String,
	createdDate: Date,
	generalPoints: Number,
	knowledgePoint: Number,
	dateDeleted: Date,
	answerLocation: Number,
	postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	comments: [{
		commentBody: String,
		createdDate: Date,
		dateDeleted: Date,
		postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
	}]
});



mongoose.model('Answer', AnswerSchema);