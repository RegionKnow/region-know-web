(function() {
	'use strict';
	angular.module('app')
	.controller('NavBarController', NavBarController);

	NavBarController.$inject = ['$mdSidenav', '$timeout', '$mdUtil', 'UserFactory', '$state', '$rootScope'];

	function NavBarController($mdSidenav, $timeout, $mdUtil, UserFactory, $state, $rootScope) {
		var vm = this;
		vm.status = $rootScope._user;


	//---------FUNCTIONALITY FOR SIDE NAVBAR----------------------------------------------------------
	vm.toggleLeft = buildToggler('left');

	function buildToggler(navID) {
		var debounceFn =  $mdUtil.debounce(function(){
			$mdSidenav(navID)
			.toggle()
		},200);
		return debounceFn;
	}

	vm.close = function () {
		$mdSidenav('left').close()
	};

	

	//---------FUNCTIONALITY FOR REGISTER & LOGIN USER----------------------------------------------------------

	vm.registerUser = function() {
		UserFactory.registerUser(vm.user).then(function(){
			vm.user = {};
			delete vm.user;
			$state.go("Login");
		});
	};

	vm.loginUser = function() {
		UserFactory.loginUser(vm.user).then(function(){

			vm.status = $rootScope._user;
			console.log(vm.status);
			$state.go("QuestionsFeed");
		});
	};
	console.log(vm.status)

	vm.logoutUser = function() {
		UserFactory.logoutUser().then(function(){
			delete vm.status;
		});
	};

}
})();
