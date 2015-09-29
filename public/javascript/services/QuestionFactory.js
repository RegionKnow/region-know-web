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
	
		return o;
	}
})();
