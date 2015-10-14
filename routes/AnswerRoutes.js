var mongoose = require('mongoose');
var Answers = mongoose.model('Answer');
var express = require('express');
var router = express.Router();
var User = mongoose.model('User');

// router.param(function(req, res){

// })
router.param('id', function(req, res, next, id){
  req.answerId = id;  Answers.findOne({_id: id}).populate('answers').exec(function(err, response){
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
    res.send(response);
  })
})

router.post('/edit', function(req, res){

  Answers.update({_id: req.body.answerIdProp}, {answerBody: req.body.editProp}, function(err, response){
    if(err) return res.status(500).send({err: "Error finding answer"});
    if(!response) return res.status(400).send({err: "Error getting from the mongodb error finding answer"});
    res.send(response)
  })
})

router.post('/comment/:id', function(req, res){
 var newComment = {commentBody: req.body.commentBody, createdDate: new Date(), postedBy: req.body.postedBy};
 Answers.update({_id: req.body.answerId}, {$push: {comments: newComment}}, function(err, response){
  if(err) return res.status(500).send({err: "Error finding answer"});
  if(!response) return res.status(400).send({err: "Error getting from the mongodb error finding answer"});
  res.send(response)
})
})


router.post('/deleteAnswerComment/', function(req, res){
  // Answers.findOne({_id: id}).populate('answers')
  Answers.update({_id: req.body.ansId}, {$pull: {comments:{_id:req.body.answerCommentId}}}, function(err, response){
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
    res.send('You already voted!')
  }else if(req.answer.downvote.indexOf(req.user._id) != -1){

    var currentVote = req.answer.voteNum + 2


    Answers.update({_id: req.answer._id}, {$push: {upvote: {_id: req.user._id}}}, function(err, response){
      Answers.update({_id: req.answer._id}, {voteNum: currentVote}, function(err, vote){
        Answers.update({_id: req.answer._id}, {$pull: {downvote: req.user._id}}, function(err, rmVote){

          res.send(rmVote);
        })
      })
    })
  }
  else{
    var currentVote = req.answer.voteNum + 1
    Answers.update({_id: req.answer._id}, {$push: {upvote: {_id: req.user._id}}}, function(err, response){
      Answers.update({_id: req.answer._id}, {voteNum: currentVote}, function(err, vote){

        res.send(vote);
      })
    })
  }
})
//Downvotes
router.post('/downvote/:id/:user_id', function(req, res){
  if(req.answer.downvote.indexOf(req.user._id) != -1){
    res.send('You already downvoted!')
  }else if(req.answer.upvote.indexOf(req.user._id) != -1){

    var currentVote = req.answer.voteNum - 2


    Answers.update({_id: req.answer._id}, {$push: {downvote: {_id: req.user._id}}}, function(err, response){
      Answers.update({_id: req.answer._id}, {voteNum: currentVote}, function(err, vote){
        Answers.findOneAndUpdate({_id: req.answer._id}, {$pull: {upvote: req.user._id}}, function(err, rmVote){

          res.send(rmVote);
        })
      })
    })
  }
  else{
    var currentVote = req.answer.voteNum - 1
    Answers.update({_id: req.answer._id}, {$push: {downvote: {_id: req.user._id}}}, function(err, response){
      Answers.update({_id: req.answer._id}, {voteNum: currentVote}, function(err, vote){

        res.send(vote);
      })
    })
  }

})


module.exports = router;
