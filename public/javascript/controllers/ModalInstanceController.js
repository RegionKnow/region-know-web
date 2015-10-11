(function() {
	'use strict';
	angular.module('app')
	.controller('ModalInstanceController', ModalInstanceController);

	ModalInstanceController.$inject = ["$modalInstance", "$state"];

	function ModalInstanceController($modalInstance, $state) {
		var vm = this;
		vm.user = {};

		vm.registerUser = function() {
			$modalInstance.close(vm.user);
		};

		vm.loginUser = function() {
			$modalInstance.close(vm.user);
		};

	}
})();