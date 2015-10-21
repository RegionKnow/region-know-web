(function() {
	'use strict';
	angular.module('app')
	.controller('EditAnswerController', EditAnswerController);

	EditAnswerController.$inject = ['$state', 'QuestionFactory', '$stateParams', 'AnswerFactory'];

	function EditAnswerController($state, QuestionFactory, $stateParams, AnswerFactory) {
		var vm = this;
		vm.edit = {};
//========================================================================================
						//deleteAnswer//

// 		vm.deleteAnswer = function(answer_id){
// console.log("hi");
// 			AnswerFactory.deleteAnswer(answer_id).then(function(res){
//
// 				$state.go('QuestionsFeed')
// 			})
// 		}

//===========================================================================================
								//editAnswer//

		vm.submitEdit = function(){
			console.log(vm.edit);
			AnswerFactory.editAnswer($stateParams.ans_id, vm.edit).then(function(res){
				console.log(vm.edit);

						vm.answer = res;

						vm.loading = false;
						delete vm.edit;
						$state.go('QuestionsFeed');
					});
				};
}
})();
