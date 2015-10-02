var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 3000;
var passport = require('passport');

//----------------------------Basic require for mongodb---------------------------------------------
require('./Models/AnswerModel.js');
require('./Models/ConversationModel.js');
require('./Models/QuestionModel.js');
require('./Models/UserModel.js');
require('./config/passport.js');

//-----------------------Adds error handling to mongoose.connect--------------------------------------

var db = process.env.MONGOLAB_URI || "mongodb://localhost/FinalApp";
mongoose.connect(db , function(err) {
	if (err) return console.log("Error connecting to database. Make sure you ran mongod :)");

	var x = new Date();
	console.log("Connected to mongo at %s", x.toLocaleString());
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

//middleware that allows for us to parse JSON and UTF-8 from the body of an HTTP request
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

//DEFINE/REQUIRE ROUTES BEFORE SETTING UP PATHS---------------------------------------------------
var userRoutes = require('./routes/UserRoutes');
var conversationRoutes = require('./routes/ConversationRoutes');


var questionRoutes = require('./routes/QuestionsRoutes')
var answerRoutes = require('./routes/AnswerRoutes')
//on homepage load, render the index page
app.get('/', function(req, res) {
	res.render('index');
});
//-------to allow remote access--------------------------------------------------------
app.use(function(req, res, next){
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


app.use('/', function (req, res) {
	res.render('404');
})

//----------------APP IS LISTENING-----------------------------------------------------------
var server = app.listen(port, function() {
	var host = server.address().address;
	var x = new Date();
	console.log('Example app listening at http://localhost: %s.\nStarted at %s', port, x.toLocaleString());
});
