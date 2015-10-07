(function() {
	'use strict';
	angular.module('app')
	.controller('UserProfileController', UserProfileController);

	UserProfileController.$inject = ['UserFactory', '$state', '$scope', 'Upload'];

	function UserProfileController(UserFactory, $state,  $scope, Upload) {
		var vm = this;
		vm.status = UserFactory.status;

	//-------------GET LOGGED IN USER-------------------------

	if(vm.status) {
		UserFactory.getUserLoggedIn(vm.status._user.id).then(function(res) {
			vm.userLoggedIn = res;
		});
	};
	//----------------------------------------------------------------------------------------------------------------------------------------------------//
	//PROFILE>DELETE
	vm.deleteUserProfile = function() {
		UserFactory.deleteUserProfile(vm.status._user.id).then(function(res){
			// console.log("res");
			vm.deleteUserProfile = res;
		});

	};
		//-----------------------------------------------------------------------------------
		// EDIT Profile with Image upload


		// $scope.submit = function() {
		// 	if (form.file.$valid && $scope.file && !$scope.file.$error) {
		// 		$scope.upload($scope.file);
		// 	}
		// };

    // upload on file select or drop
    $scope.upload = function (file) {
    	Upload.upload({
    		url: 'upload/url',
    		data: {file: file, 'username': $scope.username}
    	}).then(function (resp) {
    		console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    	}, function (resp) {
    		console.log('Error status: ' + resp.status);
    	}, function (evt) {
    		var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    		console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    	});
    };

		// vm.addProfileImage = function() {
		// 	console.log("youre image is in controller and below")
		// 	console.log(vm.image);
		// 	UserFactory.addProfileImage(vm.image).then(function (res) {
		// 		vm.image = res;
		// 	});
		// };

		vm.updateProfile = function(user){

			UserFactory.updateProfile(vm.status._user.id, user).then(function (res){

				  // UserFactory.post(vm.status._user.id, vm.updateProfile).then(function (res){
					// 	vm.updateProfile = res;
				  // console.log(vm.updateProfile);
			  // });
		});
		};
	}


})();
