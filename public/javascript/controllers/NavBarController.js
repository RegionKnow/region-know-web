(function() {
	'use strict';
	angular.module('app')
	.controller('NavBarController', NavBarController);

	NavBarController.$inject = ['$mdSidenav', '$timeout', '$mdUtil'];

	function NavBarController($mdSidenav, $timeout, $mdUtil) {
		var vm = this;
		

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
			vm.user.body = "";
			$state.go("Login");
		});
	};


}
})();


