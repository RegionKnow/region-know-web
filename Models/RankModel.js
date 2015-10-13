var mongoose = require('mongoose');

var RankSchema = new mongoose.Schema({
		userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
		name: String,
		img: String,
		gPoints: Number,
		kPoints: Number,
		score: Number,
		WorldRank: Number,
		city: String,
		cityRank: Number
});



mongoose.model('Rank', RankSchema);
