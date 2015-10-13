(function() {
	'use strict';
	angular.module('app')
	.factory('RankFactory', RankFactory);

	RankFactory.$inject = ['$http', '$q'];

	function RankFactory($http, $q){
		var o = {}

		o.collectRanks = function(){
			
			var q = $q.defer();

			$http.get('/api/rank/getRanks').success(function(){
				q.resolve();
			})
			return q.promise;
		}

		o.getAll = function(){

			var q = $q.defer();

			$http.get('/api/rank').success(function(res){
				q.resolve(res);
			})
			return q.promise;
		}

		return o;
	}
})();