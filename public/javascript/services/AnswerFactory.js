(function() {
	"use strict";
	angular.module('app').factory('AnswerFactory', AnswerFactory);
	AnswerFactory.$inject = ['$q', '$http', "$window", "$rootScope"];

	function AnswerFactory($q, $http, $window, $rootScope) {
		var o = {};
		
		o.addAnswer = function(answer, questionId){
			$http.post('/api/answer/')
		}
	
		return o;
	}
})();