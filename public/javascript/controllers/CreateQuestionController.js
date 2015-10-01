(function() {
	'use strict';
	angular.module('app')
	.controller('CreateQuestionController', CreateQuestionController);

	CreateQuestionController.$inject = ['$state', 'QuestionFactory', '$rootScope'];

	function CreateQuestionController($state, QuestionFactory, $rootScope) {
		var vm = this;

		vm.status = $rootScope._user
		// console.log(vm.status)
		vm.question = {}

		

		vm.getQuestions = function(){

			QuestionFactory.findQuestions().then(function(res){
				// console.log(res)
				vm.allquestions = res
			})
		}
		vm.getQuestions(); //getting all questions when page loads

		vm.createQ = function(){
			vm.question.questionBody = vm.desc // setting desc to questionbody
			console.log(vm.status.id)
			vm.question.user_id = vm.status.id
			// vm.question.tag = vm.tag
			console.log('creating quesiton');
			console.log(vm.question)

			QuestionFactory.createQuestion(vm.question).then(function(res){
				delete vm.question // deleting question object
				delete vm.desc // deleting question in html
				$state.go('QuestionsFeed')
			})
		}

	
	}
})();