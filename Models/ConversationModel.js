var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require("jsonwebtoken")

var ConversationSchema = new mongoose.Schema({
	createdDate: Date,
	receivedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	sentBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
});



mongoose.model('Conversation', ConversationSchema);