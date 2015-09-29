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
	newAnswer.save(function(err, response){
		res.send(response);
	})
})
module.exports = router;