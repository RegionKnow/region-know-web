var mongoose = require('mongoose');
var Questions = mongoose.model('Question');
var express = require('express');
var router = express.Router();
var jwt = require("express-jwt");
var User = mongoose.model('User');




router.param('id', function(req, res, next){
	// console.log(req.params.id)
	Questions.findOne({_id: req.params.id}).populate('answers').exec(function(err, response){
		if(err) return res.status(500).send({err: "Error finding question"});
		if(!response) return res.status(400).send({err: "Error getting from the mongodb"});
		req.question = response
		// console.log(req.question)
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
		// console.log(response._id)
		res.send(response._id)
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
// find differnce in miles
function getSpaceDiffernece(lat1, lat2, lon1, lon2){

				var R = 6371000; // metres
				var φ1 = Math.radians(lat1);
				var φ2 = Math.radians(lat2);
				var temp1 = (lat2-lat1)
				var Δφ = Math.radians(temp1);
				var temp2 = (lon2-lon1)
				var Δλ = Math.radians(temp2);

				var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
				        Math.cos(φ1) * Math.cos(φ2) *
				        Math.sin(Δλ/2) * Math.sin(Δλ/2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

				var d = R * c;
				return d
				
}
Math.radians = function(degrees) {
		  return degrees * Math.PI / 180;
		};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
		  return radians * 180 / Math.PI;
};
 // funciton to get all questions by tag filters and Location!
router.get('/allquestions/:user_id', function(req, res){
	// console.log(req.user)
	var currentUser;
	var questionsRes;
	var user_location = {};
	var user_tags;
	var filtered_questions = [];
	var userFilter;
	User.findOne({_id: req.user._id}, function(err, user){
			currentUser = user;
			user_tags = user.tags // holds all user tags
			user_location.lat = user.lat;
			user_location.lng = user.lng;
			user_location.radius = user.radius
			userFilter = user.filter
		Questions.find({}, function(err, response){
		// console.log(response)
		// res.send(response)
		questionsRes = response; //full array of questions
		// console.log(questionsRes[1].lat)
			for(var p = 0; p < questionsRes.length; p++){ //loop for going through questions and filtering them by locaiton
				var temp_lat = questionsRes[p].lat
				var temp_lng = questionsRes[p].lng
				if(getSpaceDiffernece(user_location.lat, temp_lat, user_location.lng, temp_lng) < (user.radius * 1000)){
					if(userFilter){ // if userFilter is true
						console.log('inside check for Tags')
						for(var k = 0; k < user_tags.length; k++){ // loop through each tag in userTags
							var result = findTag(questionsRes[p], user_tags[k]);
							if(result) break;
						}
					}else{
						filtered_questions.push(questionsRes[p])
					}
				// console.log(questionsRes[p])
				}
			}
			console.log(filtered_questions)
			res.send(filtered_questions);
		})
	})
	function findTag(questionsRes, tags)  {
		for(var i = 0; i < questionsRes.tags.length ; i++){
		// console.log(user_tags[k], temp_tags[i])
			if(tags == questionsRes.tags[i]){
				console.log('we pushed')
				filtered_questions.push(questionsRes)
				return true;
			}
		}
		return false;
	}
})

router.get('/:id', function(req, res){
	// console.log('this is the id ' + req.question)
	res.send(req.question)
})

router.post('/delete/:id', function(req, res){
	Questions.update({_id: req.question._id}, {isDeleted: true}, function(err, response){
		// console.log('hitting delete in routes')
		res.send(response)
	})

})

router.post('/edit/:id', function(req, res){
	// console.log(req.body)
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
