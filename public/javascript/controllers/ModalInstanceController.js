(function() {
  'use strict';
  angular.module('app')
    .controller('ModalInstanceController', ModalInstanceController);

  ModalInstanceController.$inject = ["$modalInstance", "$state", "UserFactory", "$timeout", '$modal'];

  function ModalInstanceController($modalInstance, $state, UserFactory, $timeout, $modal) {
    var vm = this;
    vm.user = {};


    vm.openPasswordResetModal = function() {
      var loginModal = $modal.open({
        template: "<div><form ng-submit='vm.sendEmail()'><md-input-container class='col-md-12'><label>Email</label><input type='email' ng-model='vm.email'></md-input-container></form><br><center><md-button class='md-raised md-primary' ng-click='vm.sendEmail()'>Send Email</md-button></center></div><h1>{{vm.errorMessage}}</h1><center><div ng-show='vm.loading' layout='row' layout-sm='column' layout-align='space-around'><md-progress-circular md-mode='indeterminate' md-diameter='80'></md-progress-circular> </div><center>",
        controller: 'PasswordResetController',
        controllerAs: "vm",
        size: "md"
      });
      loginModal.result.then(function(){

        });
    };


    vm.closeModal = function () {
      $modalInstance.dismiss();
    }



    vm.registerUser = function() {
      UserFactory.registerUser(vm.user).then(function() {
        $modalInstance.close();
      });
    };



    vm.loginUser = function() {
      UserFactory.loginUser(vm.user).then(function(succesRes) {
        vm.user = null;
        $modalInstance.close();
      }, function() {
			vm.loginError = true;
			$timeout(function () {
				vm.loginError = false;
			}, 1000);

      })
    };

  }
})();
