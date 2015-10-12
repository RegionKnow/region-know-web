(function(){
	'use strict'
	angular.module('app').controller('RankController', RankController);
	RankController.$inject = ['$state', '$stateParams', 'RankFactory', 'UserFactory', 'QuestionFactory'];

	function RankController($state, $stateParams, RankFactory, UserFactory, QuestionFactory){

		// var vm = this;
		// var user_id = UserFactory.status._user.id

		// vm.generalPoints = function(){
		// 	RankFactory.getGeneralPoints(user_id).then(function(res){
		// 		// console.log(res)
		// 		vm.gP = res.count;

		// 	})
		// }
		// vm.knowledgePoints = function(){
		// 	QuestionFactory.getKpoints(user_id).then(function(res){
		// 		// console.log(res);
		// 		vm.kP = res.knowledgePoints;
		// 	})
		// }
		// vm.knowledgePoints();
		// vm.generalPoints();

	}

})();
