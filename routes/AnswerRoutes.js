var mongoose = require('mongoose');
var Answers = mongoose.model('Answer');
var express = require('express');
var router = express.Router();
var jwt = require("express-jwt");
var User = mongoose.model('User');

// router.param(function(req, res){

// })

router.post('/', function(req, res){
	var newAnswer = new Answers(req.body)
	var user_id = req.body.user_id;
	newAnswer.postedBy = user_id;
	newAnswer.save(function(err, response){ // saves the new answer to AnswerModel
		console.log(response.user_id)

		//pushing reference into userModel for the answer
		User.update({_id: user_id}, {$push: { answers: { _id: response._id } } }, function (err, user){
						if(err) return res.status(400).send({err: 'The client fucked up'});
						if(!user) return res.status(500).send({err: 'the server could not find a user'});
					})
		res.send(response); // sending response to back to client to be parsed and displayed
	})
})



module.exports = router;
