(function() {
  'use strict';
  angular.module('app')
    .controller('ModalInstanceController', ModalInstanceController);

  ModalInstanceController.$inject = ["$modalInstance", "$state", "UserFactory", "$timeout"];

  function ModalInstanceController($modalInstance, $state, UserFactory, $timeout) {
    var vm = this;
    vm.user = {};

    vm.registerUser = function() {
      UserFactory.registerUser(vm.user).then(function() {
        $modalInstance.close();
      });
    };



    vm.loginUser = function() {
      UserFactory.loginUser(vm.user).then(function(succesRes) {
        vm.user = null;
        $modalInstance.close();
      }, function(errorResponse) {
        console.log(errorResponse.data);
			vm.loginError = true;
			$timeout(function () {
				vm.loginError = false;
			}, 10000);

      })
    };

  }
})();
