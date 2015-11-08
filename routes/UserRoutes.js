var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport'); //Multiple ways of bringing authentication from different providers. such as fb, local, google, twitch
var uuid = require('uuid');
var cloudinary = require('cloudinary');
var multiparty = require('multiparty');
var express_jwt = require('express-jwt');
var Questions = mongoose.model('Question');

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
  var env = {};
}

var auth = express_jwt({
  'userProperty': 'payload',
  'secret': process.env.APP_SECRET || env.APP_SECRET
});



//-----------CLOUDNARY.CONFIG and ROUTES----------------------------------------------------

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY || env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET || env.CLOUDINARY_SECRET
});

router.post('/uploadPhoto', function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, data, fileObject){
    cloudinary.uploader.upload(fileObject.file[0].path, function(picInfo){
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
  passport.authenticate('local', function(err, user) { //calling from the passport
    if (!user) return res.status(400).send({err: "Invalid username or password"});
    res.send({
      token: user.generateJWT()
    }); //generating a token when there is a user in the collection.

  })(req, res, next);
});


//THIRD PARTY LOGIN OR REGISTRATION =============================================================
router.get('/auth/linkedin', passport.authenticate('linkedin', {
  // scope: ['profile']

}));


router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    if (req.user) {
      console.log(req.user, "167 userroutes");
      var token = {
        token: req.user.generateJWT()
      }
      res.redirect("/#/auth/token/" + token.token);
    } else {
      console.log(req.user, "173 userroutes");
      res.send("You are not authenticated");
    }
  });


//FACEBOOK O AUTH....................
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

router.get('/liked/:userId', function(req, res){
  res.send(req.user)
})

router.get('/all/:userId', function(req, res){
  User.findOne({_id: req.user._id}).populate('questions answers likedQuestions').exec(function(err, response){
    res.send(response)
  })
})

router.post('/location/:userId', function(req, res) {

  User.update({
    _id: req.user._id
  }, req.body, function(err, response) {

    res.send()
  })

})

router.post('/tags/:userId', function(req, res) {
  var tags = req.body

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
    res.send(response)
  })
})

router.post('/filterOff/:userId', function(req, res) {
  User.update({
    _id: req.user._id
  }, {
    filter: false
  }, function(err, response) {
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
      res.send(response)
    })
  })

  router.post('/filterAlertOff/:userId', function(req, res) {
    User.update({
      _id: req.user._id
    }, {
      filterAlert: false
    }, function(err, response) {
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

  router.get('/gp/:userId', function(req, res){ // function to get points
    var voteCountObj = {}
    var temp_fullUserObject
    var kPointCount = 1 ;
    // grabs all the user information, including his quesitons and answers
    User.findOne({_id: req.user._id}).populate('questions answers').exec(function(err, response){
      temp_fullUserObject = response
      var voteCount = 0; //count the number of votes a user has
      var currentGp = response.generalPoints



        //gets all votes from users questions
        for(var i =0; i < response.questions.length; i++){
          // console.log(voteCount)
          voteCount += response.questions[i].voteNum
        }
        //gets all votes from user answers
        for(var k =0; k < response.answers.length; k++){
          // console.log(voteCount)

          voteCount += response.answers[k].voteNum;
        }

        //function to get knowledgePoints and push them into userModel for refresh
        for(var j =0; j < response.answers.length; j++){
          var temp_id = response.answers[j].questionId // saves the question id of answer
          var temp_A_id = response.answers[j]._id // saves the id of the answer

          findKpoints(temp_id, temp_A_id, j, req.user._id) // runs comparision

        }

        voteCountObj.count = voteCount + 1 // adds one point from userModel default

        User.update({_id: req.user._id}, {generalPoints: voteCountObj.count}, function(err, update){
            // res.send('updated General Points' + voteCountObj.count)
          })
      })
function findKpoints(questionId, answerId,l1, userId){
        var loopcount = 0 // counts how many times this function runs
        // var kPointCount = 0
        Questions.findOne({_id: questionId}, function(err, QA){
          if(err) return res.status(500).send({err: "Server hit an error searching for QA"});
          if(!QA) return res.status(400).send({err: "No QA"});
          loopcount += 1
                if(QA.answered){ // makes sure quesiton has an answer
                  console.log(QA.answered, answerId)

                  if(QA.answered.toString() === answerId.toString()){

                    kPointCount += 1

                      // console.log(countObj)
                    }
                  }
                if(l1 === loopcount) { // all viable questions have been searched, update KP's
                    // console.log('current K point count'  + kPointCount)
                  User.update({_id: userId}, {knowledgePoints: kPointCount}, function(err, update){
                  })
                }
              })
      }
    // setTimeout(function() {
    //   res.send('updated both knowledgepoints and general points')
    // }, 3000);


})

module.exports = router;
