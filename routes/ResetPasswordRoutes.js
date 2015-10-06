var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var request = require('request');
var nodemailer = require('nodemailer');
var env = require('../env');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'regionknow@gmail.com',
    pass: env.EMAIL_PASS
  }
});


//Send email function
function SendEmail(user, resObj) {
  var date = new Date().getTime();
  var name = user.displayName || user.username;
  var link = "http://localhost:3000/#/password-reset/" + user._id + "/" + date;
  var text = "Hello, " + name + "!\n\nYou recently requested to have your password reset. If you received this in error, ignore this message it will expire. Otherwise, click <a href='" + link + "'>here</a> to begin the process......... you have fifteen minutes. Let the games begin."
  var mailOptions = {
    from: 'Region Know Admins  <no-reply@regionknow.com>', // sender address
    to: user.email, // list of receivers
    subject: 'Password Reset', // Subject line
    // text: 'Hello world', // plaintext body
    html: text // html body
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
      SendEmail(user, res);
    }
  })
})


module.exports = router;