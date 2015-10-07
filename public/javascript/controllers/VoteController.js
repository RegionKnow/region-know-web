(function(){
	'use strict'
	angular.module('app').controller('VoteController', VoteController);
	VoteController.$inject = ['$state', '$http', '$stateParams'];
	function VoteController($state, $http, $stateParams){
		var vm = this; 
		console.log()
		var question_id = $stateParams.id;

		vm.upVote = function(){
			
			$http.post('/api/question/upvote/' + question_id, null).success(function(res){
				console.log('upvoted')
			})
		}

		vm.downVote = function(){

		}
	}
})();