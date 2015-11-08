var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require("jsonwebtoken")

var UserSchema = new mongoose.Schema({
	googleId: String,
	facebookId: String,
	linkedInId: String,
	displayName: String,
	username: {type: String, lowercase: true, unique: true},
	email: {type: String, lowercase: true, unique: true},
	image: { type: String, default: 'http://1.bp.blogspot.com/-fDYO0D23HvM/VcdBvhO0FiI/AAAAAAAAAoU/7vi6V3TYHp4/s1600/Anonymous.png'},
	passwordHash: String,
	salt: String,
	createdDate: Date,
	deactivatedDate: Date,
	lat: Number,
	lng: Number,
	filter: Boolean,
	filterAlert: Boolean,
	tags: [{type: String}],
	radius: Number,
	score: Number,
	generalPoints: {type: Number, default: 1},
	knowledgePoints: {type: Number, default: 1},
	alerts: [{type: mongoose.Schema.Types.ObjectId, ref: "Question"}],
	questions: [{type: mongoose.Schema.Types.ObjectId, ref: "Question"}],
	answers: [{type: mongoose.Schema.Types.ObjectId, ref: "Answer"}],
	likedQuestions: [{type: mongoose.Schema.Types.ObjectId, ref: "Question"}],
	likedAnswers: [{type: mongoose.Schema.Types.ObjectId, ref: "Answer"}]
	//commentsMade?
});

UserSchema.methods.generateJWT = function() {
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 36500);
	return jwt.sign({
		id : this._id,
		username : this.username,
		image: this.image,
		exp: exp.getTime() / 1000,
		generalPoints: this.generalPoints,
		knowledgePoints: this.knowledgePoints

	}, "super_secret");
}

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(64).toString('hex');
	this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

UserSchema.methods.checkPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return hash === this.passwordHash;
};

mongoose.model('User', UserSchema);
