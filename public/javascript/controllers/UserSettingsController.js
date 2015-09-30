(function() {
	'use strict';
	angular.module('app')
	.controller('UserSettingsController', UserSettingsController);

	UserSettingsController.$inject = ['$http', '$stateParams'];

	function UserSettingsController($http, $stateParams) {
		var vm = this;
		console.log($stateParams)
	}
})();
