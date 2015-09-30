(function() {
	'use strict';
	angular.module('app')
	.controller('MessageController', MessageController);

	MessageController.$inject = ['$http'];

	function MessageController($http) {
		var vm = this;
		vm.title = 'Messaging - RegionKnow';
		vm.button = "Test call button";
		vm.testRequest = function () {
			$http.get('/api/convo/').success(function (res) {
				vm.testMessage = res.body;
			})
		}
	}
})();
