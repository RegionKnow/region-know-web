var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var request = require('request');
var nodemailer = require('nodemailer');
var env = require('../env') || {};
var jwt = require("jsonwebtoken");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'regionknow@gmail.com',
    pass: process.env.EMAIL_PASS || env.EMAIL_PASS
  }
});


//Send email function
function SendEmail(user, resObj) {
  var passwordSecret = process.env.PASSWORD_RESET_SECRET || env.PASSWORD_RESET_SECRET;
  var date = new Date().getTime();
  var fiveMinutesInMilliseconds = 1000 * 600;
  date += fiveMinutesInMilliseconds;
  resetPassToken = jwt.sign({
    expirationDate: date,
    user: {
      id: user._id,
      name: user.username
    }
  }, passwordSecret);
  var name = user.displayName || user.username;
  var link = "http://localhost:3000/#/resetEnd/" + resetPassToken;
  var text = "<h2>Hello, " + name + "!<br><br>You recently requested to have your password reset. If you received this in error, ignore this message it will expire. Otherwise, click <a href='" + link + "'>here</a> to begin the process......... you have 10 minutes. Let the games begin.</h2>" +
  "<br><br>" +
  "<p>Sincerely,</p>" + "<p>RegionKnow Team</p>";
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
});


router.post('/finish', function(req, res) {
  User.findOne({
    _id: req.body.userId
  }, function(error, user) {
    if (error) return res.status(500).send({
      err: "Error on the server finding user for password change"
    });
      if (!user) return res.status(400).send({
        err: "For some reason we couldn't find you on the server"
      });
        else {
          user.setPassword(req.body.newPassword);
          user.save(function(error, result) {
            if (error) return res.status(500).send({
              err: "Error on the server saving user for password change"
            });
              if (!result) return res.status(400).send({
                err: "For some reason we couldn't find you on the server"
              });
                else {
                  res.send({
                    success: "Password succesfully changed"
                  });
                }
              })
        }

      })
})


module.exports = router;
