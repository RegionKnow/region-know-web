var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var passport = require('passport');
var uuid = require('uuid');
var mailer = require('express-mailer');
var app = express();


//----------------------------Basic require for mongodb---------------------------------------------
require('./Models/AnswerModel.js');
require('./Models/ConversationModel.js');
require('./Models/QuestionModel.js');
require('./Models/UserModel.js');
require('./config/passport.js');

//-----------------------Adds error handling to mongoose.connect--------------------------------------

var db = process.env.MONGOLAB_URI || "mongodb://localhost/FinalApp";
mongoose.connect(db, function(err) {
  if (err) return console.log("Error connecting to database. Make sure you ran mongod :)");

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


mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.aim.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'kareemmarch@aim.com',
    pass: ''
  }
});

app.post('/reset-password-email', function(req, res, next) {
  console.log(req.body, "Server.jss");
  res.send();
  // app.mailer.send('email', {
  //   to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
  //   subject: 'Test Email', // REQUIRED.
  //   otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
  // }, function(err) {
  //   if (err) {
  //     // handle error
  //     console.log(err);
  //     res.send('There was an error sending the email');
  //     return;
  //   }
  //   res.send('Email Sent');
  // });
});



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
  // res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
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