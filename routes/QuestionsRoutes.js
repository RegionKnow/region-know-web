var mongoose = require('mongoose');
var Questions = mongoose.model('Question');
var express = require('express');
var router = express.Router();
var jwt = require("express-jwt");
var User = mongoose.model('User');


router.post('/create', function(req, res){
	console.log(req.body)
	var new_quest = new Questions(req.body)
	new_quest.homeLocation.lat = 123123
	new_quest.homeLocation.lng = 1212313123

	new_quest.save(function(err, response){
		console.log(response)
		res.send()
	})

})

module.exports = router;
