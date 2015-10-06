(function() {
  'use strict';
  angular.module('app')
    .controller('NavBarController', NavBarController);

  NavBarController.$inject = ['$mdSidenav', '$timeout', '$mdUtil', 'UserFactory', '$state', '$rootScope'];

  function NavBarController($mdSidenav, $timeout, $mdUtil, UserFactory, $state, $rootScope) {
    var vm = this;
    vm.status = $rootScope._user;


    //---------FUNCTIONALITY FOR SIDE NAVBAR----------------------------------------------------------
    vm.toggleLeft = buildToggler('left');

    function buildToggler(navID) {
      var debounceFn = $mdUtil.debounce(function() {
        $mdSidenav(navID)
          .toggle()
      }, 200);
      return debounceFn;
    }

    vm.close = function() {
      $mdSidenav('left').close()
    };

    vm.alertObj = {}
    alertWatch();

    function alertWatch() {
      console.log('watching for alerts')
      $timeout(function() {
        UserFactory.grabAlert(vm.status.id).then(function(res) {
          // console.log(res.alerts[0])
          if (res.alerts.length > 0) {
            // console.log('grabbing alerts')
            vm.alertObj.status = true;
            vm.alertObj.alertNum = res.alerts.length;
            vm.alertObj.alerts = res.alerts;
            console.log(vm.alertObj)
          } else {
            // console.log('hiding alerts')
            vm.alertStatus = false;
          }

        })
        alertWatch();
      }, 3000);

    }
    vm.openAlerts = function() {
      console.log('trying to open alerts')
      vm.showAlertTab = true;
      $timeout(function() {
        UserFactory.deleteAlerts(vm.status.id).then(function() {
          console.log('deleted alerts')
          vm.alertObj.status = false;
        })
      }, 30000);

    }


    //---------FUNCTIONALITY FOR REGISTER & LOGIN USER----------------------------------------------------------

    vm.registerUser = function() {
      UserFactory.registerUser(vm.user).then(function() {
        vm.user = null;
        $state.go("Login");
      });
    };

    vm.loginUser = function() {
      UserFactory.loginUser(vm.user).then(function(res) {

        vm.status = $rootScope._user;
        vm.user = null;
        $state.go("QuestionsFeed");
      });
    };

    vm.logoutUser = function() {
      UserFactory.logoutUser().then(function() {
        vm.status = null;
      });
    };

  }
})();

