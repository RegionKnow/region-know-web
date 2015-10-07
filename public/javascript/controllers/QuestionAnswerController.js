(function() {
	'use strict';
	angular.module('app')
	.controller('QuestionAnwserController', QuestionAnwserController);

	QuestionAnwserController.$inject = ['$state', 'QuestionFactory', '$stateParams', 'AnswerFactory'];

	function QuestionAnwserController($state, QuestionFactory, $stateParams, AnswerFactory) {
		var vm = this;
		vm.edit = {}

		vm.AnswerObj = {};


		//logic for grabing individual question From questions feed
		if(!$stateParams.id){

			alert('no question found')
		}else{
			console.log($stateParams.id)
			QuestionFactory.findQuestion($stateParams.id).then(function(res){

				vm.question = res

			})
		}
		//options for showing edit and delete buttons
		vm.showOptions = function(){
			vm.options = true;
		}
		vm.hideOptions = function(){
			vm.options = false;
			vm.showEdit = false;
		}

		// Answer Logic
		vm.addAnswer = function(){
			//AnswerObj is the answer for question
			// vm.AnswerObj.answerBody = vm.answer // sets answer
			vm.AnswerObj.user_id = o.status._user.id // sets user who submited it

			AnswerFactory.addAnswer(vm.AnswerObj).then(function(res){

				// ;
				vm.loading = true; // showing loading gif
				vm.AnswerObj = {}  // removes local object answer
				//
				var AnswerId = {}
				AnswerId.id = res._id // saves id of answer
				var QuestionId = $stateParams.id


				QuestionFactory.addIdRef(AnswerId, QuestionId).then(function(res){ // function to add ref to question

					QuestionFactory.findQuestion($stateParams.id).then(function(res){

						vm.question = res


						vm.loading = false;
					})
				})
			}
			//hadling errors
			// , function(res){
			// 	;
			// 	vm.errorMessage = res;
			// }
			)
		}

		vm.deleteQuestion = function(quesiton_id){

			QuestionFactory.deleteQuestion(quesiton_id).then(function(res){

				$state.go('QuestionsFeed')
			})
		}

		vm.editQuestion = function(){
			vm.showEdit = true;

		}

		vm.submitEdit = function(edit){
			vm.showEdit = false;

			// vm.edit.questionBody  = edit
			QuestionFactory.editQuestion($stateParams.id, vm.edit).then(function(res){
				QuestionFactory.findQuestion($stateParams.id).then(function(res){

						vm.question = res

						vm.loading = false;
						vm.edit = {}
					})
			})
		}
	}
})();
