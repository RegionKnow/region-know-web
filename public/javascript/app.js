(function() {
	'use strict';
	angular.module('app', ['ui.router', 'ngMaterial'])
	.config(Config);
	Config.$inject = ['$stateProvider', '$urlRouterProvider'];
	function Config($stateProvider, $urlRouterProvider) {
		$stateProvider.state('Home',{
			url: '/',
			templateUrl: 'views/home.html'
		}).state('Register',{
			url: '/register',
			templateUrl: 'views/register.html',
			controller: 'NavBarController',
			controllerAs: 'nav'
		}).state('Login',{
			url: '/login',
			templateUrl: 'views/login.html',
			controller: 'NavBarController',
			controllerAs: 'nav'
		}).state('QuestionsFeed',{
			url: '/questionsFeed',
			templateUrl: 'views/questionsFeed.html'
		}).state('updateProfile',{
			url: '/updateProfile',
			controller: 'UserProfileController',
			templateUrl: 'views/updateProfile.html',
			controllerAs: 'vm'
		}).state('CreateQuestion',{
			url: '/createQ',
			templateUrl: 'views/CreateQuestion.html',
			controller: 'CreateQuestionController',
			controllerAs: 'vm'
		}).state('UserProfile',{
			url: '/UserProfile',
			templateUrl: 'views/userProfile.html',
			controller: 'UserProfileController',
			controllerAs: 'vm'
		});
		$urlRouterProvider.otherwise('/');
	}
})();
