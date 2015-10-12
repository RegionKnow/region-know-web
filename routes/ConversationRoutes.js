
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = mongoose.model('User');
var Conversation = mongoose.model('Conversation');
var User = mongoose.model('User');

//When the server is started this array contains data for all live active conversations
var activeConversations = [];

//This route is for activating the conversaton into the live domain
router.post("/activate-convo", function (req, res) {
  var isConvoInArray = (function(){
    if(activeConversations.length < 1) return false;
    for(var index = 0; index < activeConversations.length; x++){
      if (activeConversations[index].convo === req.body.convoId){
        return true;
      }
    }
    return false;
  })();
  if(!isConvoInArray) {
    activeConversations.push({
      convo: req.body.convoId,
      numMessages: req.body.numMessages,
      participants: {participantOne: {id: req.body.user}}
    });
    res.send()
  } else {
      activeConversations = activeConversations.map(function (item) {
        if(!item) return;
        if(item.convo === req.body.convoId){
          if(item.participants.participantOne){
            item.participants.participantTwo = {id: req.body.user};
            return item;
          } else {
            item.participants.participantOne = {id: req.body.user};
            return item;
          }
        } else {
          return item;
        }
      })
  }
  res.send();

});

router.post("/live-convo", function(req, res) {
  //Search activeConversations for convo, updates response object
  activeConversations = activeConversations.map(function(item) {
    if(!item) return;
    if (item.convo === req.body.convoId){
      if(item.participants.participantOne.id === req.body.user){
        item.participants.participantOne.response = res;
        return item;
      } else if(item.participants.participantTwo.id === req.body.user){
        item.participants.participantTwo.response = res;
        return item;
      }
    } else {
      return item;
    }
  })

})

router.post("/deactivate-convo", function (req, res) {
  activeConversations = activeConversations.filter(function (item) {
    if(!item) return;
    if(!item.participants.participantOne || !item.participants.participantTwo) {
    return item.convo !== req.body.convoId;
  } else {
    if(item.participants.participantOne.id === req.body.user){
      item.participants.participantOne = "";
      return true;
    } else{
      item.participants.participantTwo = "";
      return true;
    }
  }

  });
  console.log(activeConversations);
  res.send();

});

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
  //Finds conversation that message is apart of
  var newMessage = {
    sender: req.body.sender,
    body: req.body.body,
    createdDate: new Date()
  }
  Conversation.update({
    _id: req.body.convoId
  }, {
    //Push into messages array of the conversation and creates a new date for that convo
    $push: {
      messages: newMessage
    }
  }, function(error, result) {
    if (error) return res.status(500).send({
      error: 'Something went wrong on the server updating the message'
    });
    if (!result) return res.status(500).send({
      error: 'For some reason this coversation does not exist'
    });

    activeConversations.forEach(function (item) {
      if(!item) return;
      var convoResponseOne, convoResponseTwo;
      if(item.convo === req.body.convoId){
        if(item.participants.participantOne && item.participants.participantOne.response){
          convoResponseOne = item.participants.participantOne.response;
          convoResponseOne.send(newMessage);
        }
        if(item.participants.participantTwo && item.participants.participantTwo.response){
          convoResponseTwo = item.participants.participantTwo.response;
          convoResponseTwo.send(newMessage);
        }
      }
    })

    res.send({
      message: "Success!"
    });
  });
})

router.get('/rando', function(req, res) {
  var number = Math.floor((Math.random() * 256));
  console.log(typeof res);
  setTimeout(function() {
  res.send({
    body: number
  })
}, 10000)

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
