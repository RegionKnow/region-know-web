(function() {
	'use strict';
	angular.module('app')
	.controller('CreateQuestionController', CreateQuestionController);

	CreateQuestionController.$inject = ['$state', 'QuestionFactory'];

	function CreateQuestionController($state, QuestionFactory) {
		var vm = this;
		vm.question = {}
		vm.getQuestions = function(){
			QuestionFactory.findQuestions().then(function(res){
				console.log(res)
				vm.allquestions = res
			})
		}
		vm.getQuestions(); //getting all questions when page loads
		vm.createQ = function(){
			vm.question.questionBody = vm.desc // setting desc to questionbody
			// vm.question.tag = vm.tag
			console.log('creating quesiton');
			console.log(vm.question)
			QuestionFactory.createQuestion(vm.question).then(function(res){
				delete vm.question // deleting question object
				delete vm.desc // deleting question in html
				$state.go('CreateQuestion')
			})
		}
	}
})();