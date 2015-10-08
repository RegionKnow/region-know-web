var mongoose = require('mongoose');

var ConversationSchema = new mongoose.Schema({
	createdDate: Date,
	participantOne: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	participantTwo: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	messages: [{sender: String, body: String, createdDate: Date}],
});



mongoose.model('Conversation', ConversationSchema);
