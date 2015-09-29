(function() {
	'use strict';
	angular.module('app')
	.controller('UserProfileController', UserProfileController);

	UserProfileController.$inject = ['UserFactory', '$state', '$rootScope'];

	function UserProfileController(UserFactory, $state, $rootScope) {
		var vm = this;

	//-------------GET LOGGED IN USER-------------------------

	if($rootScope._user) {
		UserFactory.getUserLoggedIn($rootScope._user.id).then(function(res) {
			vm.userLoggedIn = res;
		});
	};

}
})();