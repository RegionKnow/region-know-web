var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require("jsonwebtoken")

var AnswerSchema = new mongoose.Schema({
	answerBody: {type: String, minlength: 5, maxlength: 200},
	createdDate: Date,
	generalPoints: Number,
	knowledgePoint: Number,
	dateDeleted: Date,
	postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	comments: [{
		commentBody: String,
		createdDate: Date,
		dateDeleted: Date,
		postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
	}]
});



mongoose.model('Answer', AnswerSchema);