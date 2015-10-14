(function(){
	'use strict'
	angular.module('app').controller('RankController', RankController);
	RankController.$inject = ['$state', '$stateParams', 'RankFactory', 'UserFactory', 'QuestionFactory'];

	function RankController($state, $stateParams, RankFactory, UserFactory, QuestionFactory){

		var vm = this;
		var user_id = UserFactory.status._user.id
		getRanks();
		function getRanks(){
			RankFactory.getAll().then(function(res){
				vm.rankObj = res
			})
		}

	}

})();
