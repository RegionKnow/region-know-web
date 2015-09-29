(function() {
	'use strict';
	angular.module('app')
	.controller('CreateQuestionController', CreateQuestionController);

	CreateQuestionController.$inject = ['$state', 'HomeFactory'];

	function CreateQuestionController($state, HomeFactory) {
		var vm = this;
		vm.question = {}
		
		vm.createQ = function(){
			vm.question.questionBody = vm.desc
			// vm.question.tag = vm.tag
			console.log('creating quesiton');
			console.log(vm.question)
			HomeFactory.createQuestion(vm.question).then(function(res){
				$state.go('CreateQuestion')
			})
		}
	}
})();