var mongoose = require('mongoose');
var Questions = mongoose.model('Question');
var express = require('express');
var router = express.Router();
var jwt = require("express-jwt");
var User = mongoose.model('User');




router.param('id', function(req, res, next){
	// console.log(req.params.id)

	Questions.findOne({_id: req.params.id}).populate('answers').exec(function(err, response){
		req.question = response
		next();
	})
})

router.post('/create', function(req, res){
	// console.log(req.body)
	//saving user Id to Question
	req.body.postedBy = req.body.user_id
	var new_quest = new Questions(req.body)
	var user_id = req.body.user_id

	new_quest.save(function(err, response){
		// console.log(response.id)
		User.update({_id: user_id }, {$push: { questions: {_id: response._id} } }, function(err, user){
			console.log('saved question reference in user Model')
		})
		res.send()
	})

})

router.post('/:id', function(req, res){
	// console.log(req.body)
	Questions.update({_id: req.question._id},
		{$push: { answers: { _id: req.body.id } } }, function(err, response){
		// console.log(response);
		res.send();
	})
})

router.get('/', function(req, res){
	Questions.find({}, function(err, response){
		res.send(response);
	})
})

router.get('/:id', function(req, res){
	// console.log('this is the id ' + req.question)
	res.send(req.question)
})

router.post('/delete/:id', function(req, res){
	Questions.update({_id: req.question._id}, {isDeleted: true}, function(err, response){
		console.log('hitting delete in routes')
		res.send(response)
	})

})

router.post('/edit/:id', function(req, res){
	console.log(req.body)
	Questions.update({_id: req.question._id}, {questionBody: req.body.questionBody}, function(err, response){
		res.send(response)
	})

})

module.exports = router;
