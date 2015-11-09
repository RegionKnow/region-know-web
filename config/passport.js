var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //It's requiring the passport for our local database authentication.
var FacebookStrategy = require('passport-facebook').Strategy; //It's requiring the passport for our local database authentication.
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;; //It's requiring the passport for our local database authentication.
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
function moduleAvailable(name) {
  try {
    require.resolve(name);
    return true;
  } catch(e){}
  return false;
}

if (moduleAvailable('../env.js')) {
  var env = require('../env.js');
} else {
  var env = {
    facebook: {
      SECRET: false,
      CLIENTID: false,
      CALLBACKURL: false
    },
    google: {
      SECRET: false,
      CLIENTID: false,
      CALLBACKURL: false
    }
  };
}


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

//=================================================for linkedin login---------------------------------------------
// function generateLinkedInPhotoUrl(id, accessToken, height, width) {
//   var picUrl = "https://media.licdn.com/";
//   picUrl += id;
//   picUrl += "/picture?width=";
//   picUrl += width;
//   picUrl += "&height=";
//   picUrl += height;
//   picUrl += "&access_token=";
//   picUrl += accessToken;
//   return picUrl;
// }

passport.use(new LinkedInStrategy({
  clientID: env.linkedin.CLIENTID || process.env['linkedin.CLIENTID'],
  clientSecret: env.linkedin.SECRET || process.env['linkedin.SECRET'],
  callbackURL: "http://127.0.0.1:3000/api/user/auth/linkedin/callback", 
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true,
  passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    // To keep the example simple, the user's LinkedIn profile is returned to
    // represent the logged-in user. In a typical application, you would want
    // to associate the LinkedIn account with a user record in your database,
    // and return that user instead.
    User.findOne({
      'linkedInId': profile.id
    }, function(err, user) {
        // console.log("DEBUG: Contents of profile:") ;
        if (err) {
          console.log('DEBUG: Error connecting');
          return done(err);
        }
        if (user) {
          console.log('DEBUG: Current user');
          // console.log('user', req.body)
          req.tempUser  = user;
          return done(null, user);
        }
        // Else no user is found. We need to create a new user.
        else {

          var newUser = new User();
          newUser.linkedInId = profile.id;
          // According to the Google API, the name is in
          // displayName
          newUser.username = profile.displayName;

          newUser.email = profile.emails ? profile.emails[0].value : null;

          // Photo
          // newUser.image = generateLinkedInPhotoUrl(profile.photos[0].value, 500);;
          newUser.image = profile.photos[0].value, 500;

          // Created stores date created in the database.
          newUser.createdDate = new Date();

          // Save the newUser to the database.
          newUser.save(function(err) {
            if (err)
              throw err;
            // Otherwise return done, no error and newUser.
            req.tempUser = newUser;
            return done(null, newUser);
          })
        }
      });
});
}));

// Generates url for Facebook photo of size height x width====================================
function generateFacebookPhotoUrl(id, accessToken, height, width) {
  var picUrl = "https://media.licdn.com/";
  picUrl += id;
  picUrl += "/picture?width=";
  picUrl += width;
  picUrl += "&height=";
  picUrl += height;
  picUrl += "&access_token=";
  picUrl += accessToken;
  return picUrl;
}



passport.use(new FacebookStrategy({
  clientID:  env.facebook.CLIENTID || process.env['facebook.CLIENTID'],
  clientSecret: env.facebook.SECRET || process.env['facebook.SECRET'] ,
  callbackURL: env.facebook.CALLBACKURL || process.env['facebook.CALLBACKURL'],
  passReqToCallback: true,
  profileFields: ['id', 'name', 'emails', 'photos']
},
function(req, accessToken, refreshToken, profile, done) {
  User.findOne({
    email: profile.emails[0].value
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
        // userModel.image = profile.photos[0].value;

        userModel.image = generateFacebookPhotoUrl(profile.id, accessToken, 500, 500);
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




function generateGooglePhotoUrl(photoUrl, size) {
  var img = photoUrl;
  var index = img.indexOf("50");
  var s = img.split("");

  s.splice(index, 2);
  s = s.join("");
  s += size;
  return s;
}
// For Google login
passport.use(new GoogleStrategy({
  clientID: env.google.CLIENTID || process.env['google.CLIENTID'],
  clientSecret: env.google.SECRET || process.env['google.SECRET'],
  callbackURL: env.google.CALLBACKURL || process.env['google.CALLBACKURL']
      // profileFields: ['id', 'name', 'emails', 'photos']
    },
    function(accessToken, refreshToken, profile, done) {
    // process.nextTick is a Node.js function for asynchronous
    // Waits for data to come back before continuing.
    process.nextTick(function() {
      // Information for accessing our database
      // Whatever is returned will be stored in profile.
      // Returns err if it cannot connect
      User.findOne({
        'email': profile.emails[0].value
      }, function(err, user) {
        // console.log("DEBUG: Contents of profile:") ;
        // console.log(profile) ;
        if (err) {
          console.log('DEBUG: Error connecting');
          return done(err);
        }
        if (user) {
          console.log('DEBUG: Current user');
          return done(null, user);
        }
        // Else no user is found. We need to create a new user.
        else {
          console.log("DEBUG: New User.");
          console.log(profile.id);

          var newUser = new User();
          newUser.googleId = profile.id;
          // According to the Google API, the name is in
          // displayName
          newUser.username = profile.displayName;

          // According to Google API, emails come back as an array
          // So, need the first element of the array.
          newUser.email = profile.emails ? profile.emails[0].value : null;

          // Photo
          // Get bigger photo URL from Google. Sending size = 300
          newUser.image = generateGooglePhotoUrl(profile.photos[0].value, 500);


          // Created stores date created in the database.
          newUser.createdDate = new Date();

          // Save the newUser to the database.
          newUser.save(function(err) {
            if (err)
              throw err;
            // Otherwise return done, no error and newUser.
            return done(null, newUser);
          })
        }
      });
});
}
));
