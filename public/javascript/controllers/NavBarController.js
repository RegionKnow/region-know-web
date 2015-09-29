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
			console.log("User created!")
			$state.go("Login");
		});
	};

	vm.loginUser = function() {
		UserFactory.loginUser(vm.user).then(function(){
			console.log(vm.user);
			vm.status = $rootScope._user;
			$state.go("QuestionsFeed");
		});
	};

}
})();


