(function() {
	'use strict';
	angular.module('app')
	.factory('RankFactory', RankFactory);

	RankFactory.$inject = ['$http', '$q'];

	function RankFactory($http, $q){
		var o = {}

		o.getGeneralPoints = function(id){
			console.log('hitting gp factory')
			var q = $q.defer();
			$http.get('/api/user/gp/' + id).success(function(res){
				q.resolve(res);
			})
			return q.promise;
		}

		return o;
	}
})();