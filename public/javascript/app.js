(function() {
  'use strict';
  angular.module('app', ['ui.router', 'ngMaterial', 'ngFileUpload', 'ui.bootstrap'])
  .config(Config)
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('light-green')
    .accentPalette('grey');
  });
  Config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function Config($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider.state('Home', {
      url: '/',
      templateUrl: 'templates/main.html'
    })
    .state('QuestionsFeed', {
      url: '/questionsFeed',
      templateUrl: 'templates/questions_feed.html',
      controller: 'CreateQuestionController',
      controllerAs: 'vm'
    })
    .state('updateProfile', {
      url: '/updateProfile',
      templateUrl: 'templates/update_profile.html',
      controller: 'UserProfileController',
      controllerAs: 'vm'
    })
    .state('CreateQuestion', {
      url: '/createQ',
      templateUrl: 'templates/create_question.html',
      controller: 'CreateQuestionController',
      controllerAs: 'vm'
    })
    .state('ViewQuesiton', {
      url: '/Quesiton/:id',
      templateUrl: 'templates/question_detail.html',
      controller: 'QuestionAnwserController',
      controllerAs: 'vm'
    })
    .state('UserProfile', {
      url: '/UserProfile',
      templateUrl: 'templates/user_profile.html',
      controller: 'UserProfileController',
      controllerAs: 'vm'
    })
    .state('Message', {
      url: '/Messaging/:recipient',
      templateUrl: 'templates/messaging.html',
      controller: 'MessageController',
      controllerAs: 'msg'
    })
    .state('Settings', {
      url: '/settings/:id',
      templateUrl: 'templates/user_settings.html',
      controller: 'UserSettingsController',
      controllerAs: 'vm'
    })
    .state("EditAnswer", {
      url: '/edit/:ans_id/:ques_id',
      templateUrl: 'templates/edit_answer.html',
      controller: 'EditAnswerController',
      controllerAs: 'vm'
    }).state('Rank', {
      url: '/rank/:id',
      templateUrl: 'templates/rank.html',
      controller: 'RankController',
      controllerAs: 'vm'
    })




    //Facebook Auth with embedded Controller

    .state("FBAuth", {
      url: '/auth/token/:token',
      template: "<h1>Authenticating</h1>",
      controller: ['$rootScope', "$stateParams", '$state', 'UserFactory', function($rootScope, $stateParams, $state, UF) {
        var vm = this;
        localStorage.setItem("token", $stateParams.token);
        UF.setLoggedinUserToRootScope();
        $state.go("QuestionsFeed");
      }]
    })

    .state("PasswordResetFinish", {
      url: "/resetEnd/:info",
      template: "<div>" +
      "<md-card class='col-md-offset-2 col-md-8'><md-card-content><md-input-container ><label>New Password</label><input type='password' ng-model='vm.newPassword'></md-input-container><br><md-input-container ><label>Confirm Password</label><input type='password' ng-model='vm.confirmPassword'></md-input-container><br><center><md-button class='md-raised md-primary' ng-click='vm.changePassword()'>Change Password</md-button><md-button class='md-raised md-warn' ng-click='vm.goHome()'>Go Home</md-button><h1>{{vm.errorMessage}}</h1></center></div></md-card-content></md-card>",
      controller: ['$http', "$timeout", "$window", "$stateParams", '$state', function($http, $timeout, $window, $stateParams, $state) {
        var vm = this;
        vm.changePassword = changePassword;
        vm.goHome = function() {
          $state.go("Home");
        }

        function changePassword() {
          var token = JSON.parse(urlBase64Decoder($stateParams.info.split(".")[1]));
          if (token.expirationDate < Date.now()) {
            vm.errorMessage = "Link expired...Sorry";
          } else {
            vm.errorMessage = "Link still valid!";
            if (!vm.newPassword || !vm.confirmPassword) {
              vm.errorMessage = " Password fields are empty!"
            } else {
              if (vm.newPassword !== vm.confirmPassword) {
                vm.errorMessage = "Your Passwords don't match!"
              } else {
                vm.loading = true;
                $http.post("/api/password-reset/finish", {
                  userId: token.user.id,
                  newPassword: vm.newPassword
                })
                .then(function(res) {
                  vm.loading = false;
                  vm.errorMessage = res.data.success;
                  $timeout(function() {
                    $state.go('Home')
                  }, 850);
                }, function(res) {
                  console.log(res.data);
                })
              }
            }

          }
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
        } //End of base 64 decoder function



      }],
      controllerAs: "vm",
    });

$urlRouterProvider.otherwise('/');
}
})();
