(function() {
	'use strict';
	angular.module('app')
	.factory('MapFactory', MapFactory);

	MapFactory.$inject = ['$http', '$q'];

	function MapFactory($http, $q) {
		var o = {};

		o.getMap = function(){

		}
		o.getLocation = function(){
			var key = 'AIzaSyDEQ3oCFj1hp7uqTeb8YLmXYrgtmQk-KmM'
			var q = $q.defer();
			console.log('in location homefactory')
			$http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=' + key).success(function(res){
				q.resolve(res);
			
			})
			return q.promise;
		}
		o.addHomeLocation = function(hl, id){
			var q = $q.defer();
			console.log(hl, id)
			$http.post('/api/user/location/' + id, hl).success(function(res){
				q.resolve();
			})
			return q.promise;
		}
		return o;
	}
})();
