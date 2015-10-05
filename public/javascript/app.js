(function() {
  'use strict';
  angular.module('app', ['ui.router', 'ngMaterial'])
    .config(Config);
  Config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Config($stateProvider, $urlRouterProvider) {
    $stateProvider.state('Home', {
        url: '/',
        templateUrl: 'templates/home.html'
      })
      .state('Register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'NavBarController',
        controllerAs: 'nav'
      })
      .state('Login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'NavBarController',
        controllerAs: 'nav'
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
        url: '/Messaging',
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
      .state("PasswordReset", {
        url: "/:uuid/reset",
        template: "<div id='reset-password'><md-input-container class='col-md-3'><label>Username</label><input type='text' ng-model='vm.username'></md-input-container><br><md-button class='md-raised md-primary' ng-click='vm.sendEmail()'>Send Email</md-button></div><h1>{{vm.errorMessage}}</h1>",
        controller: ["$state", '$http', "$timeout", function($state, $http, $timeout) {
          var vm = this;
          vm.sendEmail = function() {
            if (!vm.username) return vm.errorMessage = "No input";
            $http.post("/api/password-reset", {
                username: vm.username
              })
              .then(function(responseSuccess) {
                vm.errorMessage = "Success! Email Sent!!!.....Bringing you back to login page...."
                $timeout(function() {
                  $state.go("Login");
                }, 3000)
              }, function(responseError) {
                vm.errorMessage = responseError.data.err;
                $timeout(function() {
                  vm.errorMessage = '';
                }, 2000);
              })
          }


        }],
        controllerAs: "vm"
      });

    $urlRouterProvider.otherwise('/');
  }
})();