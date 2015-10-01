(function() {
	"use strict";
	angular.module('app').factory('QuestionFactory', QuestionFactory);
	QuestionFactory.$inject = ['$q', '$http', "$window", "$rootScope"];

	function QuestionFactory($q, $http, $window, $rootScope) {
		var o = {};

		o.createQuestion = function(question){ // create the question
			var q = $q.defer();
			// console.log('this is the question in factory' + question)
			$http.post('api/question/create', question).success(function(){
				q.resolve();
			})
			return q.promise;
		}

		o.findQuestions = function(){ // find all questions
			var q = $q.defer();
			$http.get('api/question').success(function(res){
				q.resolve(res);
			})
			return q.promise;
		}

		o.findQuestion = function(id){ // function to find indiv question
			var q = $q.defer();
			$http.get('api/question/' + id).success(function(res){
				// console.log('got past routes')
				q.resolve(res);
			})
			return q.promise;
		}
		o.addIdRef = function(Answer_id, id){
			var q = $q.defer();
			$http.post('api/question/' + id, Answer_id).success(function(res){
				q.resolve();
			})
			return q.promise;
		}
		o.deleteQuestion = function(question_id){
			var q = $q.defer();
			console.log('hitting delete in factory')
			$http.post('api/question/delete/' + question_id, null).success(function(res){
				q.resolve();
			})
			return q.promise;
		}
		o.editQuestion = function(id, edit){
			var q = $q.defer();
			console.log('tis is id ' + id )
			console.log('tis is edit ' + edit)
			$http.post('api/question/edit/' +  id, edit).success(function(res){
				q.resolve(res);
			})
			return q.promise;
		}
		return o;
	}
})();
