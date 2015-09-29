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
			controller: 'CreateQuestionController',
			controllerAs: 'vm',
			templateUrl: 'views/questionsFeed.html'
		}).state('CreateQuestion',{
			url: '/createQ',
			templateUrl: 'views/CreateQuestion.html',
			controller: 'CreateQuestionController',
			controllerAs: 'vm'
		}).state('ViewQuesiton', {
			url: '/Quesiton/:id',
			templateUrl: 'views/ViewQuesiton.html',
			controller: 'QuestionAnwserController',
			controllerAs: 'vm'
		})
		$urlRouterProvider.otherwise('/');
	}
})();
