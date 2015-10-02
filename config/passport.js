var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //It's requiring the passport for our local database authentication.
var FacebookStrategy = require('passport-facebook').Strategy; //It's requiring the passport for our local database authentication.
var GoogleStrategy = require('passport-google').Strategy; //It's requiring the passport for our local database authentication.
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});





passport.use(new LocalStrategy(function(username, password, done) { //This password is called from password.authenticate, from user routes.
  User.findOne({username: username}) //find the username in the model from where it's being called.
  .exec(function(err, user) {
  	if(err) return done({err: "Server has issues."});
  	if(!user) return done({err: "User does not exist"});
  	if(!user.checkPassword(password)) return done({err: "Invalid username and password combination."});
  	return done(null, user);
  });
}));

passport.use(new FacebookStrategy({
    clientID: 755751737864267,
    clientSecret: '52a091ce024ba14be912204cf3dd17bc',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, done) {
    User.findByOpenID({ openId: identifier }, function (err, user) {
      return done(err, user);
    });
  }
));
