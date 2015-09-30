//Needs setup in server.js

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = mongoose.model('User');
var Conversation = mongoose.model('Conversation');
var Message = mongoose.model('Message');
var User = mongoose.model('User');

//Queries mongo for conversation between two people
router.post("/convo-finder", function (req, res) {
  Conversation.findOne({participantOne: req.body.receiver, participantTwo: req.body.sender}, function (err, firstConvoFound) {
    if(err) return res.status(500).send({err: "There was an error querying the database"});
    if(!firstConvoFound){
      Conversation.findOne({participantOne: req.body.sender, participantTwo: req.body.receiver}, function (err, secondConvoFound) {
        if(err) return res.status(500).send({err: "There was an error querying the database"});
        if(!secondConvoFound) {
          var convo = new Conversation({participantOne: req.body.receiver, participantTwo: req.body.sender});
          convo.createdDate = new Date();
          convo.save(function (err, newConvoMade) {
            if(err) return res.status(500).send({err: "There was an error querying the database"});
            res.send(newConvoMade);
          })
        }
        else {
          res.send(secondConvoFound);
        }
      })
    }
    else {
      res.send(firstConvoFound);
    }
  })
  console.log("Hey this is Kareem");

});


router.post('/new-message', function (req, res) {
  var newmessage = new Message({body: req.body.body, sentBy: req.body.user});
  newmessage.createdDate = new Date();
  newmessage.save(function (err, newMessage) {
      if(err) return res.status(500).send({err: "Error saving the Message"})

    Conversation.update({_id: req.body.convo}, {$push: {messages: newMessage._id}}, function (err, convoUpdated) {
      if(err) return res.status(500).send({err: "Error finding convo to save"});
      if(!convoUpdated) return res.status(500).send({err: "Error finding convo to save"});
      res.send(newMessage);
    });

  })
})

router.get('/', function (req, res) {
  var number = Math.floor((Math.random() * 256)) ;
  res.send({body: "You got it " + number});

})





module.exports = router;
