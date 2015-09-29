//Needs setup in server.js

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = mongoose.model('User');
var Conversation = mongoose.model('Conversation');
var Message = mongoose.model('Message');
var User = mongoose.model('User');


router.post("/new-message", function (req, res) {
  // Conversation.findOne({})
  console.log("Hey this is Kareem");

})







module.exports = router;
