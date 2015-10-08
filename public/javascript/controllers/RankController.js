(function(){
	'use strict'
	angular.module('app').controller('RankController', RankController);
	RankController.$inject = ['$state', '$stateParams'];

	function RankController($state, $stateParams){

		var vm = this;
		var user_id = $stateParams.id
		console.log(user_id)
		vm.worldRank = function(){

		}
	}

})();