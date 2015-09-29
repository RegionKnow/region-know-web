var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require("jsonwebtoken")

var MessageSchema = new mongoose.Schema({
	createdDate: Date,
	sentBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	body: String
});



mongoose.model('Message', MessageSchema);
