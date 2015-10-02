var mongoose = require('mongoose');
var Questions = mongoose.model('Question');
var express = require('express');
var router = express.Router();
var jwt = require("express-jwt");
var User = mongoose.model('User');




router.param('id', function(req, res, next){
	//
	Questions.findOne({_id: req.params.id}).populate('answers').exec(function(err, response){
		if(err) return res.status(500).send({err: "Error finding question"});
		if(!response) return res.status(400).send({err: "Error getting from the mongodb"});
		req.question = response

		next();
	})
})

router.param('user_id', function(req, res, next){
	User.findOne({_id: req.params.user_id}, function(err, response){
		req.user = response;
		next();
	})
})

router.post('/create', function(req, res){
	//
	//saving user Id to Question
	req.body.postedBy = req.body.user_id
	var new_quest = new Questions(req.body)
	var user_id = req.body.user_id

	new_quest.save(function(err, response){
		//
		User.update({_id: user_id }, {$push: { questions: {_id: response._id} } }, function(err, user){

		})

		res.send(response._id)
	})

})

router.post('/:id', function(req, res){
	//
	Questions.update({_id: req.question._id},
		{$push: { answers: { _id: req.body.id } } }, function(err, response){
		// ;
		res.send();
	})
})

 // funciton to get all questions by tag filters and Location!
router.get('/allquestions/:user_id', function(req, res){

	Questions.find({}, function(err, response){
		res.send(response);
	})
})

router.get('/:id', function(req, res){

	res.send(req.question)
})

router.post('/delete/:id', function(req, res){
	Questions.update({_id: req.question._id}, {isDeleted: true}, function(err, response){

		res.send(response)
	})

})

router.post('/edit/:id', function(req, res){
	
	Questions.update({_id: req.question._id}, {questionBody: req.body.questionBody}, function(err, response){
		res.send(response)
	})

})

router.post('/tags/:id', function(req, res){
	for(var i =0; i < req.body.length; i++){
		Questions.update({_id: req.question._id}, {$push: {tags: req.body[i]}}, function(err, response){
			res.send();
		})
	}

})

module.exports = router;
