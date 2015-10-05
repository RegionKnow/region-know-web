var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var mongoose = require('mongoose');
var User = mongoose.model("User");
var request = require('request');





router.get("/", function(req, res) {
  res.redirect("/#/" + uuid() + "/reset")
})

router.post("/", function(req, res) {
  User.findOne({
    username: req.body.username
  }, {
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
      console.log(user.email, "reset routes 30");
      request({
        url: "http://localhost:3000/reset-password-email",
        method: "POST",
        body: 'user.email',
      }, function(err, success) {
        if (err) res.redirect("/404.html");
        res.redirect("/#/login");
      })
    }
  })
})


module.exports = router;