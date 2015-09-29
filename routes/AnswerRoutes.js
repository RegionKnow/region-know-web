var mongoose = require('mongoose');
var Questions = mongoose.model('Answer');
var express = require('express');
var router = express.Router();
var jwt = require("express-jwt");
var User = mongoose.model('User');



module.exports = router;