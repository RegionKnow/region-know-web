(function() {
	'use strict';
	angular.module('app')
	.factory('UserSettingsFactory', UserSettingsFactory);

	UserSettingsFactory.$inject = ['$http', '$q'];

	function UserSettingsFactory($http, $q) {
		var o = {};
		var key = 'AIzaSyDEQ3oCFj1hp7uqTeb8YLmXYrgtmQk-KmM'

		o.searchLocation = function(){
			console.log('trying to get location')
			var q = $q.defer();
			$http.post('https://maps.googleapis.com/maps/api/geocode/?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=' + key, null).success(function(res){
				q.resolve(res);
			})
			return q.promise;
		}

		o.getUserInfo = function(id){
			var q = $q.defer();
			$http.get('/api/user/' + id).success(function(res){
				q.resolve(res);
			})
			return q.promise;
		}
		o.filterOn = function(id){
			var q = $q.defer();
			$http.post('/api/user/filterOn/' + id).success(function(res){
				q.resolve();
			})
			return q.promise;
		}

		o.filterOff = function(id){
			var q = $q.defer();
			$http.post('/api/user/filterOff/' + id).success(function(res){
				q.resolve();
			})
			return q.promise;
		}

		o.addTags = function(tags, id){
			console.log(tags, id)
			var q = $q.defer();
			$http.post('/api/user/tags/' + id, tags).success(function(res){
				q.resolve();
			})
			return q.promise;
		}

		o.removeTags = function(id){
			var q = $q.defer();
			$http.delete('/api/user/tags/' + id).success(function(res){
				q.resolve();
			})
			return q.promise;
		}

		o.getTags = function(id){
			var q = $q.defer();
			$http.get('/api/user/tags/' + id).success(function(res){
				q.resolve(res);
			})
			return q.promise;
		}

		o.getLocation = function(){

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
				q.resolve('HomeLocation Saved!');
			})
			return q.promise;
		}

		return o;
	}
})();
