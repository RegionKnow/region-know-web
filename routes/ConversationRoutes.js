//Needs setup in server.js

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = mongoose.model('User');
var Conversation = mongoose.model('Conversation');
var User = mongoose.model('User');

//Queries mongo for conversation between two people
router.post("/convo-finder", function(req, res) {
  Conversation.findOne({
    participantOne: req.body.participantOne,
    participantTwo: req.body.participantTwo
  }, function(err, firstConvoFound) {
    if (err) return res.status(500).send({
      err: "There was an error querying the database"
    });
    if (!firstConvoFound) {
      Conversation.findOne({
        participantOne: req.body.participantTwo,
        participantTwo: req.body.participantOne
      }, function(err, secondConvoFound) {
        if (err) return res.status(500).send({
          err: "There was an error querying the database"
        });
        if (!secondConvoFound) {
          var convo = new Conversation({
            participantOne: req.body.participantOne,
            participantTwo: req.body.participantTwo
          });
          convo.createdDate = new Date();
          convo.save(function(err, newConvoMade) {
            if (err) return res.status(500).send({
              err: "There was an error querying the database"
            });
            newConvoMade.populate('participantOne participantTwo', function(error, newConvoMadePopulated) {
              if (error) res.status(500).send({
                err: "Error populating new conversation"
              });
              res.send(newConvoMadePopulated);

            })
          })
        } else {
          secondConvoFound.populate('participantOne participantTwo', function(error, secondConvoFoundPopulated) {
            if (error) res.status(500).send({
              err: "Error populating new conversation"
            });
            res.send(secondConvoFoundPopulated);

          })
        }
      })
    } else {
      firstConvoFound.populate('participantOne participantTwo', '_id username', function(error, firstConvoFoundPopulated) {
        if (error) res.status(500).send({
          err: "Error populating new conversation"
        });
        res.send(firstConvoFoundPopulated);

      })
    }
  })

});


router.post('/new-message', function(req, res) {
  Conversation.update({
    _id: req.body.convoId
  }, {
    $push: {
      messages: {
        sender: req.body.sender,
        body: req.body.body,
        createdDate: new Date()
      }
    }
  }, function(error, result) {
    if (error) return res.status(500).send({
      error: 'Something went wrong on the server updating the message'
    });
    if (!result) return res.status(500).send({
      error: 'For some reason this coversation does not exist'
    });
    console.log(result);
    res.send({message: "Success!"});
  });
})

router.get('/rando', function(req, res) {
  var number = Math.floor((Math.random() * 256));
  res.send({
    body: "You got it " + number
  });

})


router.post('/', function(req, res) {
  Conversation.find({
      $or: [{
        participantOne: req.body.userId
      }, {
        participantTwo: req.body.userId
      }]
    })
    .populate("participantOne participantTwo", "username displayName")
    .exec(function(error, convos) {
      if (error) return res.status(500).send({
        err: "There was an error querying the database for conversations"
      });
      if (!convos) return res.status(400).send({
        err: "There are no conversations to display"
      });
      res.send({
        conversations: convos
      });
    })
})




module.exports = router;
