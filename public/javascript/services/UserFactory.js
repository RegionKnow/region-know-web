(function() {
	"use strict";
	angular.module('app').factory('UserFactory', UserFactory);
	UserFactory.$inject = ['$q', '$http', "$window", "$rootScope"];

	function UserFactory($q, $http, $window, $rootScope) {
		var o = {};

		//---------------------TOKENS----------------------------------------------------

		function setToken(token) {
			localStorage.setItem("token", token);
		}

		function removeToken() {
			localStorage.removeItem("token");
		}

		function getToken() {
			return localStorage.token;
		}

		function isLoggedIn() {
			var token = getToken();
			if(token) {
				var payload = JSON.parse(urlBase64Decoder(token.split(".")[1]));
				if(payload.exp > Date.now() / 1000) {
					return payload;
				}
			} else {
				return false;
			}
		}
		//---------------------LOGIN, REGISTER, LOGOUT----------------------------------------------------

		o.registerUser = function(user) {
			var q = $q.defer();
			$http.post('/api/user/register', user).success(function(res) {
				// o.status.isLoggedIn = true;
				// o.status.username = user.username;
				q.resolve();
			});
			return q.promise;
		};


		//---------------------DECODER FUNCTIONALITY----------------------------------------------------
		function urlBase64Decoder(str) {
			var output = str.replace(/-/g, '+').replace(/_/g, '/');
			switch(output.length % 4) {
				case 0:{break; }
				case 2: {output += '=='; break;}
				case 3: {output += '='; break;}
				default:
				throw 'Illegal base64url string'
			}
			return decodeURIComponent(escape($window.atob(output)));
		}

		
		
		return o;
	}
})();
