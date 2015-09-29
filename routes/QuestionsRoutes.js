var mongoose = require('mongoose');
var Questions = mongoose.model('Question');
var express = require('express');
var router = express.Router();
var jwt = require("express-jwt");
var User = mongoose.model('User');


router.param('id', function(req, res, next){
	// console.log(req.params.id)
	req.questionId = req.params.id;
	next();

})

router.post('/create', function(req, res){
	console.log(req.body)
	var new_quest = new Questions(req.body)

	new_quest.save(function(err, response){
		console.log(response)
		res.send()
	})

})

router.get('/', function(req, res){
	Questions.find({}, function(err, response){
		res.send(response);
	})
})

router.get('/:id', function(req, res){
	console.log('this is the id ' + req.questionId)
	Questions.findOne({_id: req.questionId}, function(err, response){
		res.send(response);
	})
})

module.exports = router;
