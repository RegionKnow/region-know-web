(function() {
	'use strict';
	angular.module('app', ['ui.router', 'ngMaterial'])
	.config(Config);
	Config.$inject = ['$stateProvider', '$urlRouterProvider'];
	function Config($stateProvider, $urlRouterProvider) {
		$stateProvider.state('Home',{
			url: '/',
			templateUrl: 'templates/home.html'
		}).state('Register',{
			url: '/register',
			templateUrl: 'templates/register.html',
			controller: 'NavBarController',
			controllerAs: 'nav'
		}).state('Login',{
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'NavBarController',
			controllerAs: 'nav'
		}).state('QuestionsFeed',{
			url: '/questionsFeed',
			controller: 'CreateQuestionController',
			controllerAs: 'vm',
			templateUrl: 'templates/questionsFeed.html'
		})
		.state('updateProfile',{
			url: '/updateProfile',
			templateUrl: 'templates/updateProfile.html'
		})
		.state('CreateQuestion',{
			url: '/createQ',
			templateUrl: 'templates/CreateQuestion.html',
			controller: 'CreateQuestionController',
			controllerAs: 'vm'
		}).state('ViewQuesiton', {
			url: '/Quesiton/:id',
			templateUrl: 'templates/ViewQuesiton.html',
			controller: 'QuestionAnwserController',
			controllerAs: 'vm'
		}).state('UserProfile',{
			url: '/UserProfile',
			templateUrl: 'templates/userProfile.html',
			controller: 'UserProfileController',
			controllerAs: 'vm'
		});

		$urlRouterProvider.otherwise('/');
	}
})();
