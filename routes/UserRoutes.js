var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport'); //Multiple ways of bringing authentication from different providers. such as fb, local, google, twitch



//---------GETTING ID OF USER AND FINDING THAT SPECIFIC USER-------------------------

router.param('userId', function(req, res, next, userId){
	req.userId = req.params.userId;
	User.findOne({_id:req.userId})
	.exec(function (err, user) {
		if(err) return res.status(500).send({err: "Error inside the server."});
		if(!user) return res.status(400).send({err: "That user does not exist"});
		req.user = user;
		next();
	});

});

//---------REGISTRATION AND LOGIN---------------------------------------------------------------

router.post('/register', function(req, res) {
	var user = new User(req.body); //bringing in the request, and adding a document from our schema.
	user.setPassword(req.body.password); //We are running a model function, which encrypts our password.
	user.save(function(err, result) { //we are saving that user to our collection
		if(err) console.log(err); //if err console.log err, either 400-500
		if(err) return res.status(500).send({err: "Issues with the server"}); //server error
		if(!result) return res.status(400).send({err: "You messed up."}); //error in saving
		res.send(); //completing the post.
	})
});

router.post('/login', function(req, res, next) { //goes to passport module, in config.
	passport.authenticate('local', function(err, user, info){ //calling from the passport
		if(!user) return res.status(400).send(info);
		res.send({token: user.generateJWT()}); //generating a token when there is a user in the collection.
	})(req, res, next);
});


//-----------GETTING ONE USER THAT WE DEFINED ABOVE-------------------------------------------------------

router.get("/:userId", function(req, res){
	res.send(req.user);
});

//----------GETTING USER AND USERS-----------------------------------------------



module.exports = router;
