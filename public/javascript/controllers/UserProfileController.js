(function() {
	'use strict';
	angular.module('app')
	.controller('UserProfileController', UserProfileController);

	UserProfileController.$inject = ['UserFactory', '$state', '$scope', 'Upload', '$http'];

	function UserProfileController(UserFactory, $state,  $scope, Upload, $http) {
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

		//submitting file and checking if valid
		$scope.submit = function() {
			console.log($scope.form.file.$valid);
			console.log($scope.file);
			console.log(!$scope.file.$error);

			if ($scope.form.file.$valid && $scope.file && !$scope.file.$error) {
				$scope.upload($scope.file);
			}
		};

    // upload on file select or drop
    $scope.upload = function (file) {
    	
    	// console.log(file.$ngfDataUrl);
    	// console.log($scope.profilePhoto);
    	// $http.post('/api/user/uploadPhoto', file).then(function(successRes){
    	// 	console.log(successRes.data)
    	// });
Upload.upload({
	url: '/api/user/uploadPhoto',
	data: {file: file, 'userId': vm.status._user.id}
}).then(function (resp) {
	console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
}, function (resp) {
	console.log('Error status: ' + resp.status);
}, function (evt) {
	var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
});
};



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
