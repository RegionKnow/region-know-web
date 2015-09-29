(function() {
	'use strict';
	angular.module('app')
	.factory('HomeFactory', HomeFactory);

	HomeFactory.$inject = ['$http', '$q'];

	function HomeFactory($http, $q) {
		var o = {};

		o.createQuestion = function(question){
			var q = $q.defer();
			console.log('this is the question in factory' + question)
			$http.post('api/question/create', question).success(function(){
				q.resolve();
			})
			return q.promise;
		}
		return o;
	}
})();
