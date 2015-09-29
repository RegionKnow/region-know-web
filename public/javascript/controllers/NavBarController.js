(function() {
	'use strict';
	angular.module('app')
	.controller('NavBarController', NavBarController);

	NavBarController.$inject = ['$mdSidenav', '$log', '$timeout', '$mdUtil'];

	function NavBarController($mdSidenav, $log, $timeout, $mdUtil) {
		var vm = this;
		vm.toggleLeft = buildToggler('left');


		function buildToggler(navID) {
			var debounceFn =  $mdUtil.debounce(function(){
				$mdSidenav(navID)
				.toggle()
				.then(function () {
					console.log("toggle " + navID + " is done");
				});
			},200);
			return debounceFn;
		}

		vm.close = function () {
			$mdSidenav('left').close()
			.then(function () {
				console.log("close LEFT is done");
			});
		};

	}
})();


