(function(){
	'use strict'
	angular.module('app').controller('VoteController', VoteController);
	VoteController.$inject = ['$state', '$http'];
	function VoteController($state, $http){
		var vm = this; 
		vm.testObj = 'hello world'

		vm.upVote = function(){

		}

		vm.downVote = function(){
			
		}
	}
})();