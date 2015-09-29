(function() {
	'use strict';
	angular.module('app')
	.controller('QuestionAnwserController', QuestionAnwserController);

	QuestionAnwserController.$inject = ['$state', 'QuestionFactory', '$stateParams', 'AnswerFactory'];

	function QuestionAnwserController($state, QuestionFactory, $stateParams, AnswerFactory) {
		var vm = this;
		console.log($stateParams)
		vm.AnswerObj = {};
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
			vm.AnswerObj.answerBody = vm.answer
			AnswerFactory.addAnswer(vm.AnswerObj).then(function(res){
				console.log('added answer')
				delete vm.AnswerObj  // removes local object answer
				// console.log(res)
				var AnswerId = {}
				AnswerId.id = res._id // saves id of answer
				var QuestionId = $stateParams.id
				QuestionFactory.addIdRef(AnswerId, QuestionId).then(function(res){ // function to add ref to question
					// delete AnswerId
				})
			})
		}
	}
})();