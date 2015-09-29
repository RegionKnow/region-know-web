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
require('./Models/MessageModel.js');
require('./Models/UserModel.js');
require('./config/passport.js');

//-----------------------Adds error handling to mongoose.connect--------------------------------------
mongoose.connect("mongodb://localhost/FinalApp", function(err) {
	if (err) return console.log("Error connecting to database");
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
var questionRoutes = require('./routes/QuestionsRoutes')
//on homepage load, render the index page
app.get('/', function(req, res) {
	res.render('index');
});

//----------SETTING UP THE PATHS--------------------------------------------------------------------
app.use('/api/user', userRoutes);
app.use('/api/question', questionRoutes);

//----------------APP IS LISTENING-----------------------------------------------------------
var server = app.listen(port, function() {
	var host = server.address().address;
	console.log('Example app listening at http://localhost:' + port);
});
