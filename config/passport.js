var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //It's requiring the passport for our local database authentication.
var FacebookStrategy = require('passport-facebook').Strategy; //It's requiring the passport for our local database authentication.
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;; //It's requiring the passport for our local database authentication.
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
  User.findOne({
      username: username
    }) //find the username in the model from where it's being called.
    .exec(function(err, user) {
      if (err) return done({
        err: "Server has issues."
      });
      if (!user) return done({
        err: "User does not exist"
      });
      if (!user.checkPassword(password)) return done({
        err: "Invalid username and password combination."
      });
      return done(null, user);
    });
}));

passport.use(new FacebookStrategy({
    clientID: '755751737864267',
    clientSecret: '52a091ce024ba14be912204cf3dd17bc',
    callbackURL: "http://localhost:3000/api/user/auth/facebook/callback",
    passReqToCallback: true,
    profileFields: ['id', 'name', 'emails', 'photos']
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findOne({
      facebookId: profile.id
    }, function(err, user) {
      if (err) return done(err, null);
      if (user) {
        console.log("Current User, Logging In");
        return done(null, user);
      } else {
        console.log("New User, Registering and Logging In");
        var userModel = new User();
        if (profile.emails) {
          userModel.email = profile.emails[0].value;
        } else {
          userModel.email = profile.username + "@facebook.com";
        }
        userModel.image = profile.photos[0].value;
        userModel.facebookId = profile.id;
        userModel.username = profile.name.givenName + " " + profile.name.familyName;
        userModel.save(function(err, userSaved) {
          if (err) {
            return err;
          }
          return done(err, userSaved);
        })
      }
    });
  }
));

passport.use(new GoogleStrategy({
    consumerKey: '484030355290-9jal1apd50jqrvla3hdi8ml4r25h8n48.apps.googleusercontent.com',
    consumerSecret: 'jC0gn7QTj2gdEVaKMuHHR3ot',
    callbackURL: "http://localhost:3000/api/user/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return done(err, user);
    });
  }
));
