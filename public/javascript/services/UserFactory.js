(function() {
  "use strict";
  angular.module('app').factory('UserFactory', UserFactory);
  UserFactory.$inject = ['$q', '$http', "$window", "$rootScope"];

  function UserFactory($q, $http, $window, $rootScope) {
    var o = {};
    o.status = {};
    //---------------------TOKENS----------------------------------------------------
    o.setLoggedinUserToRootScope = function() {
      o.status._user = isLoggedIn();
    }

    function setToken(token) {
      if(!token) return;
      localStorage.setItem("token", token);
    }

    function removeToken() {
      localStorage.removeItem("token");
    }

    function getToken() {
      return localStorage.token;
    }

    function isLoggedIn() {
      var token = getToken();
      if (token) {
        var payload = JSON.parse(urlBase64Decoder(token.split(".")[1]));
        if (payload.exp > Date.now() / 1000) {
          return payload;
        }
      } else {
        return false;
      }
    }

    //-------------------------------CLOUDINARY FUNCTIONALITY------------------------------------------

    // o.cloudinary.uploader.upload("my_picture.jpg", function(result) {
    //       console.log(result)
    //     });


    // o.postImage()= function(image) {
    //   return JSON.parse(urlBase64Decode(getToken().split('.')[1])).image;
    // }

    // o.getImage()= function(image) {
    //   return JSON.parse(urlBase64Decode(getToken().split('.')[1])).image;
    // }
    //---------------------LOGIN, REGISTER, LOGOUT----------------------------------------------------

    o.registerUser = function(user) {
      var q = $q.defer();
      $http.post('/api/user/register', user).then(function(res) {
        q.resolve();
      }, function(res) {
        q.reject();
      });
      return q.promise;
    };

    o.loginUser = function(user) {
      var q = $q.defer();
      user.username = user.username.toLowerCase();
      $http.post('/api/user/login', user).then(function(successRes) {
        setToken(successRes.data.token);
        o.status._user = isLoggedIn();
        q.resolve();
      }, function (errorRes) {
        q.reject();
      });
      return q.promise;
    };

    o.reloadNav = function(id){
      var q = $q.defer();

      $http.get('/api/user/' + id).success(function(res){
        q.resolve(res)
      })

      // console.log(o.status._user)
      return q.promise;
    }

    o.getGeneralPoints = function(id){
      console.log('hitting gp factory')
      var q = $q.defer();
      $http.get('/api/user/gp/' + id).success(function(res){
        q.resolve(res);
      })
      return q.promise;
    }

    o.logoutUser = function() {
      var q = $q.defer()
      removeToken();
      o.status._user = isLoggedIn();
      q.resolve();
      return q.promise;
    };
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------//
    //DELETE Profile
    o.deleteUserProfile = function(Profile) {
      // alert("Are you sure you want to remove your Profile?");
      var q = $q.defer();
      $http.delete('/api/user/' + Profile).success(function(res) {
        // console.log(res);
        q.resolve();
      });
      return q.promise;
    };
    //===================ADDING PROFILE IMAGE==========================================================================

    o.addProfileImage = function(image) {
      var q = $q.defer();
      $http.post("", image).success(function(res) {
        q.resolve(res);
      });
      return q.promise;
    }


    //===================Update Profile===============================
    o.updateProfile = function(userId, user) {
      console.log(user);

      // alert("Are you sure you want to remove your Profile?");
      var q = $q.defer();
      $http.post('/api/user/' + userId, user).success(function(res) {
        //  console.log(res);
        q.resolve(res);
      });
      return q.promise;
    };

    //-----------GET USER LOGGED IN-----------------------------------------------------------

    o.getUserLoggedIn = function(userId) {
      // console.log(userId);
      var q = $q.defer();
      $http.get('/api/user/' + userId).success(function(res) {
        q.resolve(res);
      });
      return q.promise;
    }


    function urlBase64Decoder(str) {
      var output = str.replace(/-/g, '+').replace(/_/g, '/');
      switch (output.length % 4) {
        case 0:
        {
          break;
        }
        case 2:
        {
          output += '==';
          break;
        }
        case 3:
        {
          output += '=';
          break;
        }
        default:
        throw 'Illegal base64url string'
      }
      return decodeURIComponent(escape($window.atob(output)));
    }
    //alerts
    o.grabAlert = function(user_id) {
      var q = $q.defer();
      $http.get('/api/user/alert/' + user_id).success(function(res) {
        q.resolve(res);
      })
      return q.promise;
    }
    o.deleteAlerts = function(id) {
      var q = $q.defer();
      $http.post('/api/user/delete/alert/' + id).success(function(res) {
        q.resolve(res);
      })
      return q.promise;
    }
    o.findUser = function(id){
      var q = $q.defer();
      $http.get('/api/user/liked/' + id).success(function(res){
        q.resolve(res);
      })
      return q.promise;
    }
    o.getallUserInfo = function(id){
      var q = $q.defer();
      $http.get('/api/user/all/' + id).success(function(res){
        q.resolve(res);
      })
      return q.promise; 
    }

    o.status._user = isLoggedIn();
    return o;
  }
})();
