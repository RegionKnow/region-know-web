var mongoose = require('mongoose');
var Answers = mongoose.model('Answer');
var express = require('express');
var router = express.Router();
var User = mongoose.model('User');

// router.param(function(req, res){

// })
router.param('id', function(req, res, next, id){
   
    req.answerId = id;
    Answers.findOne({_id: id}).populate('answers').exec(function(err, response){
      if(err) return res.status(500).send({err: "Error finding answer"});
      if(!response) return res.status(400).send({err: "Error getting from the mongodb Kaareeeee"});
      req.answer = response;
      next();
    })
});

router.param('user_id', function(req, res, next){
  User.findOne({_id: req.params.user_id}, function(err, response){
    req.user = response;
    next();
  })
})

router.post('/', function(req, res) {
  var userName;
  User.findOne({_id: req.body.user_id}, function(err, response){
    if(response.username){
      userName = response.username;
    }else{
      userName = response.displayName
    }

    var newAnswer = new Answers(req.body)
    var user_id = req.body.user_id;
    // console.log(newAnswer, user_id)
    newAnswer.postedBy = user_id;
    newAnswer.name = userName;
    newAnswer.save(function(err, resultOfAnswerSave) { // saves the new answer to AnswerModel
      if (err) {
        // console.log(err);
        return res.status(500).send({
          err: "Error saving to the database"
        });
      }
      if(!resultOfAnswerSave) {
        return res.status(500).send({
          err: "Error saving to the database"
        });
      }

      //pushing reference into userModel for the answer
      User.update({
        _id: user_id
      }, {
        $push: {
          answers: {
            _id: resultOfAnswerSave._id
          }
        }
      }, function(err, user) {
        if (err) return res.status(400).send({
          err: 'The client fucked up'
        });
        if (!user) return res.status(500).send({
          err: 'the server could not find a user'
        });
      })
      //pushing reference into userModel for the answer

      res.send(resultOfAnswerSave); // sending resultOfAnswerSave to back to client to be parsed and displayed
    })
  })

})



router.post('/delete', function(req, res){
  Answers.update({_id: req.body.answerId}, {isDeleted: true}, function(err, response){
    console.log('hitting delete in routes line 56');
    console.log(response);
    res.send(response);
  })
})

router.post('/edit/:id', function(req, res){
  console.log(req.body,"line 62")
  Answers.update({_id: req.params.id}, {answerBody: req.body.answerBody}, function(err, response){
    if(err) return res.status(500).send({err: "Error finding answer"});
    if(!response) return res.status(400).send({err: "Error getting from the mongodb error finding answer"});
    res.send(response)
  })
})

router.post('/:id', function(req, res){
  res.send(req.answer)
})

//upvotes
router.post('/upvote/:id/:user_id', function(req, res){
  if(req.answer.upvote.indexOf(req.user._id) != -1){
    console.log('user already upvoted')
    res.send('You already voted!')
  }else if(req.answer.downvote.indexOf(req.user._id) != -1){
   
      var currentVote = req.answer.voteNum + 2
    
    
    Answers.update({_id: req.answer._id}, {$push: {upvote: {_id: req.user._id}}}, function(err, response){
      console.log('added user to upvoted')    
      console.log(currentVote)
      Answers.update({_id: req.answer._id}, {voteNum: currentVote}, function(err, vote){
        console.log('vote updated')
        Answers.update({_id: req.answer._id}, {$pull: {downvote: req.user._id}}, function(err, rmVote){
          console.log('removed downvote From reference')
          
          res.send(rmVote);
        })
      })
    })
  }
  else{
    console.log('user has not upvoted yet')
    var currentVote = req.answer.voteNum + 1
    Answers.update({_id: req.answer._id}, {$push: {upvote: {_id: req.user._id}}}, function(err, response){
      console.log('added user to upvoted')    
      console.log(currentVote)
      Answers.update({_id: req.answer._id}, {voteNum: currentVote}, function(err, vote){
        console.log('vote updated')

        res.send(vote);
      })
    })
  }
})
//Downvotes
router.post('/downvote/:id/:user_id', function(req, res){
  if(req.answer.downvote.indexOf(req.user._id) != -1){
    console.log('You already downvoted!')
    res.send('You already downvoted!')
  }else if(req.answer.upvote.indexOf(req.user._id) != -1){

      var currentVote = req.answer.voteNum - 2
    
    
    Answers.update({_id: req.answer._id}, {$push: {downvote: {_id: req.user._id}}}, function(err, response){
      console.log('added user to downvoted')    
      console.log(currentVote)
      Answers.update({_id: req.answer._id}, {voteNum: currentVote}, function(err, vote){
        console.log('vote updated')
        Answers.findOneAndUpdate({_id: req.answer._id}, {$pull: {upvote: req.user._id}}, function(err, rmVote){
          console.log('removed downvote From reference')
          
          res.send(rmVote);
        })
      })
    })
  }
  else{
    console.log('user has not downvoted yet')
    var currentVote = req.answer.voteNum - 1
    Answers.update({_id: req.answer._id}, {$push: {downvote: {_id: req.user._id}}}, function(err, response){
      console.log('added user to upvoted')    
      console.log(currentVote)
      Answers.update({_id: req.answer._id}, {voteNum: currentVote}, function(err, vote){
        console.log('vote updated')

        res.send(vote);
      })
    })
  }
  
})


module.exports = router;
