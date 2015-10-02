var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport'); //Multiple ways of bringing authentication from different providers. such as fb, local, google, twitch
var uuid = require('uuid');


//---------GETTING ID OF USER AND FINDING THAT SPECIFIC USER-------------------------

router.param('userId', function(req, res, next, userId){
	req.userId = req.params.userId;
	User.findOne({_id:req.userId})
	.exec(function (err, user) {
		if(err) return res.status(500).send({err: "Error inside the server. UserId"});
		if(!user) return res.status(400).send({err: "That user does not exist"});
		req.user = user;
		next();
	});

});

//---------Deleteng USER-------------------------

router.param('Profile', function(req, res, next, Profile){
	req.Profile = Profile;
	console.log("Hey line 27");
	User.update({ _id : req.Profile}, {deactivated: true})
	.exec(function (err, user) {
		if(err) return res.status(500).send({err: "Error inside the server. Profile"});
		if(!Profile) return res.status(400).send({err: "That user does not exist"});
		console.log("deleted");
		next();
	});

});
//---------Update USER-------------------------

router.param('updateProfile', function(req, res, next, updateProfile){
	req.updateProfile = updateProfile;

	User.update({ _id: req.updateProfile},  req.body)
	//console.log(req);
	.exec(function (err, user) {
		if(err) return res.status(500).send({err: "Error inside the server. UpdateProfile"});
		if(!updateProfile) return res.status(400).send({err: "That user does not exist"});
		// console.log("updated");
		next();
		// res.send();
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

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


router.get('/auth/google',
  passport.authenticate('google'));

router.get('/auth/google/return',
  passport.authenticate('google', { failureRedirect: '/kdcjcskdnckdsckds' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



//-----------GETTING ONE USER THAT WE DEFINED ABOVE-------------------------------------------------------

router.get("/:userId", function(req, res){
	res.send(req.user);
});
router.delete("/:Profile", function(req, res){
	res.send();
});
router.post("/:updateProfile", function(req, res){
	res.send();
});

router.post('/location/:userId', function(req, res){
	console.log(req.body);
	User.update({_id: req.user._id}, req.body, function(err, response){

		console.log(response)
		res.send()
	})

})

router.post('/tags/:userId', function(req, res){
	console.log(req.body);
	var tags = req.body
	// for(var k = 0; k < req.body.length; k ++){
	// 	console.log(req.body[k])
	// }
	for(var i=0 ; i < req.body.length; i++){
		User.update({_id: req.user._id}, {$push: {tags : req.body[i]}}, function(err, response){
			// console.log(response);
		})
	}
	res.send()
})

router.get('/tags/:userId', function(req, res){
	User.findOne({_id: req.user._id}, function(err, response){
		res.send(response.tags);
	})
})

router.delete('/tags/:userId', function(req, res){
	User.update({_id: req.user._id}, {tags: []}, function(err, response){
		console.log(response)
		res.send(response.tags)
	})

})
//----------GETTING USER AND USERS-----------------------------------------------



module.exports = router;
