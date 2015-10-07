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

  router.param('id', function(req, res, next, id){
    console.log(id, "laaaaa");
    req.answerId = id;
    Answers.findOne({_id: id}).populate('answers').exec(function(err, response){
      if(err) return res.status(500).send({err: "Error finding answer"});
      if(!response) return res.status(400).send({err: "Error getting from the mongodb Kaareeeee"});
      req.answer = response;
      next();
    })
  });





module.exports = router;
