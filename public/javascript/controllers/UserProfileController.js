(function() {
	'use strict';
	angular.module('app')
	.controller('UserProfileController', UserProfileController);

	UserProfileController.$inject = ['UserFactory', '$state', '$rootScope'];

	function UserProfileController(UserFactory, $state, $rootScope) {
		var vm = this;
		// console.log('in user profile controller').
	//-------------GET LOGGED IN USER-------------------------
	// vm.test = function(){
	// 	console.log('testing')

	if($rootScope._user) {
		UserFactory.getUserLoggedIn($rootScope._user.id).then(function(res) {
			vm.userLoggedIn = res;
		});
	};
	//----------------------------------------------------------------------------------------------------------------------------------------------------//
	//PROFILE>DELETE
	 vm.deleteUserProfile = function() {
		UserFactory.deleteUserProfile($rootScope._user.id).then(function(res){
			// console.log("res");
			vm.deleteUserProfile = res;
		});

	};
		//-----------------------------------------------------------------------------------
		// EDIT Profile

		vm.updateProfile = function(user){
			console.log('insude updateProifle');
			// console.log(vm.updateProfile);
			 UserFactory.updateProfile($rootScope._user.id, user).then(function (res){

				  // UserFactory.post($rootScope._user.id, vm.updateProfile).then(function (res){
					// 	vm.updateProfile = res;
				  // console.log(vm.updateProfile);
			  // });
			});
		};
	}


})();
