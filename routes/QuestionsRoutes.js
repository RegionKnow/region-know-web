var mongoose = require('mongoose');
var Questions = mongoose.model('Question');
var express = require('express');
var router = express.Router();
var jwt = require("express-jwt");
var User = mongoose.model('User');
var Answers = mongoose.model('Answer');




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

router.param('Answer_id', function(req, res, next, id){

    Answers.findOne({_id: id}).populate('answers').exec(function(err, response){
      if(err) return res.status(500).send({err: "Error finding answer"});
      if(!response) return res.status(400).send({err: "Error getting from the mongodb Kaareeeee"});
      req.answer = response;
      next();
    })
});

router.post('/create', function(req, res){
	//
	//saving user Id to Question
	var userName;
	User.findOne({_id: req.body.user_id}, function(err, response){
		console.log(response)
		if(response.username){
	      userName = response.username;
	    }else{
	      userName = response.displayName
	    }
	    if(response.image){
	    	req.body.img = response.image
	    }
		req.body.postedBy = req.body.user_id
		req.body.userName = userName
		// console.log(req.body)
		var new_quest = new Questions(req.body)
		var user_id = req.body.user_id

		new_quest.save(function(err, response){
			//
			User.update({_id: user_id }, {$push: { questions: {_id: response._id} } }, function(err, user){

			})

			res.send(response._id)
		})
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
		if(err) return res.status(500).send({error: "There was an error editing the question"})
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

////Upvotes
router.post('/upvote/:id/:user_id', function(req, res){
	if(req.question.upvote.indexOf(req.user._id) != -1){
		res.send('User already voted!');
	} else if(req.question.downvote.indexOf(req.user._id) != -1){

		Questions.update({_id: req.question._id}, {
			$push: {upvote: req.user._id},
			$pull: {downvote: req.user._id},
			$inc: {voteNum: 2}

		}, function(err, updateStatus){
				if(err) return res.status(500).send({error: "Problem querying database"});
				console.log("DEBUG: Changed up date query");
				console.log("DEBUG UPDATE STATUS: %s", updateStatus);
				res.send(updateStatus);
		})
	}
	else{
		console.log('DEBUG: user has not upvoted yet')
		Questions.update({_id: req.question._id}, {
			$push: {upvote: req.user._id},
			$inc: {voteNum: 1}
		}, function(err, vote){
			if(err) return res.status(500).send({error: "Problem querying database"});
				console.log('DEBUG: added user to upvoted')
				console.log('DEBUG: vote updated')
				res.send(vote);
		})
	}
})
//Downvotes
router.post('/downvote/:id/:user_id', function(req, res){
	if(req.question.downvote.indexOf(req.user._id) != -1){
		console.log('user already downvoted')
		res.send('user already downvoted!')
	} else if(req.question.upvote.indexOf(req.user._id) != -1){

			Questions.update({_id: req.question._id}, {
				$pull: {upvote: req.user._id},
				$push: {downvote: req.user._id},
				$inc: {voteNum: -2}

			}, function(err, rmVote){
					console.log('vote updated');
					console.log('added user to downvoted');
					console.log('removed downvote From reference');
					res.send(rmVote);
		})
	} else {
		console.log('user has not downvoted yet')

		Questions.update({_id: req.question._id}, {
			$push: {downvote: req.user._id},
			$inc: {voteNum: -1}

		}, function(err, vote){

				console.log('vote updated')
				console.log('added user to upvoted')
				res.send(vote);


		})
	}

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
	if(!req.user) return;
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
						// console.log('inside check for Tags')
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
			// console.log(filtered_questions)
			res.send(filtered_questions);
		})

	})
	function findTag(questionsRes, tags)  {
		for(var i = 0; i < questionsRes.tags.length ; i++){
		// console.log(user_tags[k], temp_tags[i])
			if(tags == questionsRes.tags[i]){
				// console.log('we pushed')
				filtered_questions.push(questionsRes)
				return true;
			}
		}
		return false;
	}
})

router.post('/alert/:id', function(req, res){
	var allusers;
	var thisquestion;
	User.find({}, function(err, users){
		allusers = users
		Questions.findOne({_id: req.question._id}, function(err, quest){
			thisquestion = quest
			alertUser(allusers, thisquestion);
			res.send('sent Alerts to Users');
		})
	})
	function alertUser(users, question){
		// console.log(users, question)
		var q_lat = question.lat
		var q_lng = question.lng

		for(var i =0; i < users.length; i++){
		//pushes quesiton reference into user alerts, if distance matchs , and user ids are not the same
			if(getSpaceDiffernece(users[i].lat, q_lat, users[i].lng, q_lng) < (users[i].radius * 1000)){
				if(!users[i].filterAlert){ // if filter by tags is off!
					if(users[i]._id.toString() !== question.postedBy.toString()){
					// console.log(users[i]._id, question.postedBy)
						User.update({_id: users[i]._id}, {$push: {alerts:{ _id: question._id }}}, function(err, pushes){

							if(err) return res.status(500).send({err: "There was an error on the server"});
							res.send();
						})
					}
				}
				else{
					if(users[i]._id.toString() !== question.postedBy.toString()){
						var checkObj = {}
						for(var j=0; j< users[i].tags.length; j++){

							var result = checkAlertTag(users[i].tags[j], question, users[i]._id, checkObj)
							if(result) return;
						}
						for(id in checkObj){
							User.update({_id: id}, {$push: {alerts:{ _id: question._id }}}, function(err, pushes){
								console.log('pushed to some users in alert Filter function')
								return true;
							})
						}
					}
				}
			}
		}
	}
	function checkAlertTag(user_tag, question, user_id, checkObj)  {
		for(var p =0; p < question.tags.length; p++){
			if(user_tag == question.tags[p]){
				if(checkObj[user_id]){
					checkObj[user_id] += 1;
				}else{
					checkObj[user_id] = 1;
				}

				console.log(checkObj);
			}
		}

		return false;
	}
})

router.post('/confirmAnswer/:id/:Answer_id/:user_id', function(req, res){
	User.update({_id: req.user._id}, {$inc: {knowledgePoints: 1}}, function(err, user){
				Questions.update({_id: req.question._id}, {answered: req.answer._id}, function(err, response){
					res.send(response)
				})
	})
})


router.post('/deconfirmAnswer/:id/:Answer_id/:user_id', function(req, res){
		User.update({_id: req.user._id}, {$inc: {knowledgePoints: -1}}, function(err, user){
				Questions.update({_id: req.question._id}, { $unset: { answered: 1 }}, function(err, response){
					res.send(response)
		})
	})
})

router.post('/kpoints/:user_id', function(req, res){
	User.findOne({_id: req.user._id}, function(err, response){
		res.send(response)
	})
})
function calculateQuestionPoints(post_obj){


}

module.exports = router;
