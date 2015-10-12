(function() {
  'use strict';
  angular.module('app', ['ui.router', 'ngMaterial', 'ngFileUpload', 'ui.bootstrap'])
  .config(Config)
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('teal')
    .accentPalette('grey');
  });
  Config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function Config($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider.state('Home', {
      url: '/',
      templateUrl: 'templates/home.html'
    })
    // .state('Register', {
    //   url: '/register',
    //   templateUrl: 'templates/register.html',
    // })
    // .state('Login', {
    //   url: '/login',
    //   templateUrl: 'templates/login.html',
    // })
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
    .state("PasswordResetStart", {
      url: "/reset",
      template: "<div id='reset-password'><md-input-container class='col-md-3'><label>Username</label><input type='text' ng-model='vm.username'></md-input-container><br><md-button class='md-raised md-primary' ng-click='vm.sendEmail()'>Send Email</md-button></div><h1>{{vm.errorMessage}}</h1><div ng-show='vm.loading' layout='row' layout-sm='column' layout-align='space-around'><md-progress-circular md-mode='indeterminate' md-diameter='80'></md-progress-circular> </div>",
      controller: "PasswordResetController",
      controllerAs: "vm"
    })
    .state("PasswordResetFinish", {
      url: "/resetEnd/:info",
      template: "<div>" +
      "<md-input-container class='col-md-3'><label>New Password</label><input type='password' ng-model='vm.newPassword'></md-input-container><md-input-container class='col-md-3'><label>Confirm Password</label><input type='password' ng-model='vm.confirmPassword'></md-input-container><br><md-button class='md-raised md-primary' ng-click='vm.changePassword()'>Change Password</md-button></div><h1>{{vm.errorMessage}}</h1>",
      controller: "PasswordResetController",
      controllerAs: "vm",
    });

    $urlRouterProvider.otherwise('/');
  }
})();
