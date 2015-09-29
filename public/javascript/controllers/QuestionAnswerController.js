(function() {
	'use strict';
	angular.module('app')
	.controller('QuestionAnwserController', QuestionAnwserController);

	QuestionAnwserController.$inject = ['$state', 'QuestionFactory', '$stateParams'];

	function QuestionAnwserController($state, QuestionFactory, $stateParams, AnswerFactory) {
		var vm = this;
		console.log($stateParams)
		
		//logic for grabing individual question From questions feed
		if(!$stateParams.id){
			console.log('question error')
			alert('no question found')
		}else{

			QuestionFactory.findQuestion($stateParams.id).then(function(res){
				console.log('found question')
				vm.question = res
				console.log(vm.question)
			})
		}
		// Answer Logic

		vm.addAnswer = function(){
			AnswerFactory.addAnswer(vm.answer, $stateParams.id).then(function(res){

			})
		}
	}
})();