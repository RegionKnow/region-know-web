var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var passport = require('passport');
var uuid = require('uuid');
var app = express();
var env = require('./env.js');

//For Android cloud messaging services testing
// var gcm = require('node-gcm');
//
//
// var message = new gcm.Message({
//     collapseKey: 'demo',
//     priority: 'high',
//     contentAvailable: true,
//     delayWhileIdle: true,
//     timeToLive: 3,
//     restrictedPackageName: "somePackageName",
//     dryRun: true,
//     data: {
//         key1: 'message1',
//         key2: 'message2'
//     },
//     notification: {
//         title: "Hello, World",
//         icon: "ic_launcher",
//         body: "This is a notification that will be displayed ASAP."
//     }
// });
//
// var sender = new gcm.Sender(env.google.GCM_APIKEY)
// console.log(env.google.GCM_APIKEY);
// // sender.send(message, { registrationIds: regIds }, function (err, result) {
// //     if(err) console.error(err);
// //     else    console.log(result);
// // });
















































//----------------------------Basic require for mongodb---------------------------------------------
require('./Models/AnswerModel.js');
require('./Models/ConversationModel.js');
require('./Models/QuestionModel.js');
require('./Models/UserModel.js');
require('./config/passport.js');

//-----------------------Adds error handling to mongoose.connect--------------------------------------

var db = process.env.MONGOLAB_URI || env.MONGOLAB_URI || "mongodb://localhost/FinalApp";
mongoose.connect(db, function(err) {
  if (err) return console.log("Error connecting to database: %s. Make sure you ran mongod :)", db);

  var x = new Date();
  console.log("Connected to %s at %s", db, x.toLocaleString());
});


app.set('views', path.join(__dirname, 'views'));
//set the view engine that will render HTML from the server to the client
app.engine('.html', require('ejs').renderFile);
//Allow for these directories to be usable on the client side
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
//we want to render html files
app.set('view engine', 'html');




app.set('view options', {
  layout: false
});
var newSessionID = uuid();

app.use(session({
    genid: function(req) {
      return newSessionID; // use UUIDs for session IDs
    },
    secret: 'regionknow_secret'
  }))
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


//middleware that allows for us to parse JSON and UTF-8 from the body of an HTTP request
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//DEFINE/REQUIRE ROUTES BEFORE SETTING UP PATHS---------------------------------------------------
var userRoutes = require('./routes/UserRoutes');
var conversationRoutes = require('./routes/ConversationRoutes');
var questionRoutes = require('./routes/QuestionsRoutes');
var answerRoutes = require('./routes/AnswerRoutes');
var resetPassRoutes = require('./routes/ResetPasswordRoutes');


//on homepage load, render the index page
app.get('/', function(req, res) {
  res.render('index');
});
//-------to allow remote access--------------------------------------------------------
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//----------SETTING UP THE PATHS--------------------------------------------------------------------
app.use('/api/user', userRoutes);
app.use('/api/convo', conversationRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/answer', answerRoutes);
app.use('/api/password-reset', resetPassRoutes);


app.use('/', function(req, res) {
  res.render('404');
})

//----------------APP IS LISTENING-----------------------------------------------------------
var server = app.listen(port, function() {
  var host = server.address().address;
  var x = new Date();
  console.log('Example app listening at http://localhost: %s.\nStarted at %s', port, x.toLocaleString());
});
