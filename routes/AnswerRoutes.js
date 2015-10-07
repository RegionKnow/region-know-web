var mongoose = require('mongoose');
var Answers = mongoose.model('Answer');
var express = require('express');
var router = express.Router();
var User = mongoose.model('User');

// router.param(function(req, res){

// })

router.post('/', function(req, res) {
  var userName;
  User.findOne({_id: req.body.user_id}, function(err, response){
    if(response.username){
      userName = response.username;
    }else{
      userName = response.displayName
    }
    
    console.log(userName)
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





module.exports = router;
