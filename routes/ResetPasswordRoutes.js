var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var request = require('request');
var nodemailer = require('nodemailer');
// var env = require('../env');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'regionknow@gmail.com',
    pass: 'codercamps'
  }
});

//Send email function
function SendEmail(email, resObj) {
  var mailOptions = {
    from: 'Region Know Admins  <no-reply@regionknow.com>', // sender address
    to: email, // list of receivers
    subject: 'Hello', // Subject line
    // text: 'Hello world', // plaintext body
    html: '<b>Hello world </b>' // html body
  }
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      return resObj.status(500).send({
        Err: "Error sending email"
      })
    }
    console.log('Message sent: ' + info.response);
    return resObj.send()
  });
}

//============================================


router.get("/", function(req, res) {
  res.redirect("/#/" + uuid() + "/reset")
})

router.post("/", function(req, res) {
  User.findOne({
    username: req.body.username
  }, {
    //Selecting for these fields
    username: 1,
    email: 1
  }, function(error, user) {
    if (error) return res.status(500).send({
      err: "Something happened on the server,"
    });
    if (!user) return res.status(404).send({
      err: "That user doesn't exist"
    });
    else {
      SendEmail(user.email, res);
    }
  })
})


module.exports = router;