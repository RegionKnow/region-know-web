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
		});
		$urlRouterProvider.otherwise('/');
	}
})();
