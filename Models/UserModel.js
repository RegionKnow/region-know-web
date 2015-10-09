var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require("jsonwebtoken")

var UserSchema = new mongoose.Schema({
	googleId: String,
	facebookId: String,
	displayName: String,
	username: {type: String, lowercase: true, unique: true},
	email: {type: String, lowercase: true, unique: true},
	image: { type: String},
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
	generalPoints: Number,
	knowledgePoints: {type: Number, default: 0},
	alerts: [{type: mongoose.Schema.Types.ObjectId, ref: "Question"}],
	questions: [{type: mongoose.Schema.Types.ObjectId, ref: "Question"}],
	answers: [{type: mongoose.Schema.Types.ObjectId, ref: "Answer"}]
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
		exp: exp.getTime() / 1000
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
