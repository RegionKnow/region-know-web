var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport'); //Multiple ways of bringing authentication from different providers. such as fb, local, google, twitch
var uuid = require('uuid');
var cloudinary = require('cloudinary');
var multiparty = require('multiparty');
var express_jwt = require('express-jwt');
var env = require('../env');

var auth = express_jwt({
  'userProperty': 'payload',
  'secret': env.APP_SECRET
});


//-----------CLOUDNARY.CONFIG and ROUTES----------------------------------------------------

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET
});

router.post('/uploadPhoto', function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, data, fileObject){
    cloudinary.uploader.upload(fileObject.file[0].path, function(picInfo){
      console.log(typeof picInfo.url);
      console.log(picInfo.url);
      User.update({_id: data.userId[0]}, {image: picInfo.url}, function(err, updatedUser){
        if(err) return res.status(500).send({err:"Could not find user to update"});
        if(!updatedUser) return res.status(500).send({err:"Client messed something up"});
        res.send(updatedUser);
        console.log(updatedUser);
      })
    })
  })
})

//---------GETTING ID OF USER AND FINDING THAT SPECIFIC USER-------------------------

router.param('userId', function(req, res, next, userId) {
  req.userId = req.params.userId;
  if(req.userId === 'undefined') return res.send();
  User.findOne({
    _id: req.userId
  })
  .exec(function(err, user) {
    if (err) {
      return res.status(500).send({
        err: "Error inside the server. UserId"
      });
    }
    if (!user) return res.status(400).send({
      err: "That user does not exist"
    });
      req.user = user;
      next();
    });

});

//---------Deleteng USER-------------------------


router.param('Profile', function(req, res, next, Profile) {
  req.Profile = Profile;
  // console.log("Hey line 27");
  User.update({
    _id: req.Profile
  }, {
    deactivated: true
  })
  .exec(function(err, user) {
    if (err) return res.status(500).send({
      err: "Error inside the server. Profile"
    });
      if (!Profile) return res.status(400).send({
        err: "That user does not exist"
      });
      // console.log("deleted");
      next();
    });
});

//---------Update USER-------------------------

router.param('updateProfile', function(req, res, next, updateProfile) {
  req.updateProfile = updateProfile;

  User.update({
    _id: req.updateProfile
  }, req.body)

  .exec(function(err, user) {
    if (err) return res.status(500).send({
      err: "Error inside the server. UpdateProfile"
    });
      if (!updateProfile) return res.status(400).send({
        err: "That user does not exist"
      });
        next();
    // res.send();
  });

});



//---------REGISTRATION AND LOGIN---------------------------------------------------------------

router.post('/register', function(req, res) {
  var user = new User(req.body); //bringing in the request, and adding a document from our schema.
  user.setPassword(req.body.password); //We are running a model function, which encrypts our password.
  user.save(function(err, result) { //we are saving that user to our collection
    if (err) console.log(err); //if err console.log err, either 400-500
    if (err) return res.status(500).send({
      err: "Error registering",
    }); //server error
      if (!result) return res.status(400).send({
        err: "You messed up."
    }); //error in saving
    res.send(); //completing the post.
  })
});

router.post('/login', function(req, res, next) { //goes to passport module, in config.
  passport.authenticate('local', function(err, user, info) { //calling from the passport
    if (!user) return res.status(400).send(info);
    res.send({
      token: user.generateJWT()
    }); //generating a token when there is a user in the collection.
  })(req, res, next);
});


//THIRD PARTY LOGIN OR REGISTRATION =============================================================
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));



router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    if (req.user) {
      var token = {
        token: req.user.generateJWT()
      }
      res.redirect("/#/auth/token/" + token.token);
    } else {
      res.send("You are not authenticated");
    }
  });


router.get('/auth/google',
  passport.authenticate('google', {scope : ['profile', 'email']}));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    if (req.user) {
      var token = {
        token: req.user.generateJWT()
      }
      res.redirect("/#/auth/token/" + token.token);
    } else {
      res.send("You are not authenticated");
    }
  });

//END OF THIRD PARTY LOGIN OR REGISTRATION =============================================================



//-----------GETTING ONE USER THAT WE DEFINED ABOVE-------------------------------------------------------

router.get("/:userId", function(req, res) {
  res.send(req.user);
});
router.delete("/:Profile", function(req, res) {
  res.send();
});
router.post("/:updateProfile", function(req, res) {
  res.send();
});


router.post('/location/:userId', function(req, res) {

  User.update({
    _id: req.user._id
  }, req.body, function(err, response) {

    console.log(response)
    res.send()
  })

})

router.post('/tags/:userId', function(req, res) {
  var tags = req.body
    // for(var k = 0; k < req.body.length; k ++){
    // 	console.log(req.body[k])
    // }
    for (var i = 0; i < req.body.length; i++) {
      User.update({
        _id: req.user._id
      }, {
        $push: {
          tags: req.body[i]
        }
      }, function(err, response) {

      })
    }
    res.send()
  })


router.get('/tags/:userId', function(req, res) {
  User.findOne({
    _id: req.user._id
  }, function(err, response) {
    res.send(response.tags);
  })
})

router.delete('/tags/:userId', function(req, res) {
  User.update({
    _id: req.user._id
  }, {
    tags: []
  }, function(err, response) {
    console.log(response)
    res.send(response.tags)
  })

})
  //----------GETTING USER AND USERS-----------------------------------------------



//----------TURNING USER SETTINGS FILTERS ON/OFF-----------------------------------------------


router.post('/filterOn/:userId', function(req, res) {
  User.update({
    _id: req.user._id
  }, {
    filter: true
  }, function(err, response) {
    console.log('truned filter on')
    res.send(response)
  })
})

router.post('/filterOff/:userId', function(req, res) {
  User.update({
    _id: req.user._id
  }, {
    filter: false
  }, function(err, response) {
    console.log('truned filter off')
    res.send(response)
  })
})
  //Alert Filters
  router.post('/filterAlertOn/:userId', function(req, res) {
    User.update({
      _id: req.user._id
    }, {
      filterAlert: true
    }, function(err, response) {
      console.log('truned Alertfilter on')
      res.send(response)
    })
  })

  router.post('/filterAlertOff/:userId', function(req, res) {
    User.update({
      _id: req.user._id
    }, {
      filterAlert: false
    }, function(err, response) {
      console.log('truned Alertfilter off')
      res.send(response)
    })
  })

  router.get('/alert/:userId', function(req, res) {
    User.findOne({
      _id: req.user._id
    }).populate('alerts').exec(function(err, response) {
    // console.log('populated')
    res.send(response)
  })
  })

  router.post('/delete/alert/:userId', function(req, res) {
    User.update({
      _id: req.user._id
    }, {
      alerts: []
    }, function(err, response) {
      res.send('deleted alerts');
    })
  })


  module.exports = router;
