(function() {
  'use strict';
  angular.module('app')
  .controller('NavBarController', NavBarController);

  NavBarController.$inject = ['$mdSidenav', '$timeout', '$mdUtil', 'UserFactory', '$state', '$rootScope'];

  function NavBarController($mdSidenav, $timeout, $mdUtil, UserFactory, $state, $rootScope) {
    var vm = this;
    vm.status = UserFactory.status;




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
      $timeout(function() {
        UserFactory.grabAlert(vm.status._user.id).then(function(res) {
          // console.log('watching for alerts')
          if(!res.alerts) return;
            if (res.alerts.length > 0) {              vm.alertObj.status = true;
              vm.alertObj.alertNum = res.alerts.length;
              vm.alertObj.alerts = res.alerts;
            } else {              
              vm.alertStatus = false;
            }

        })
        alertWatch();
      }, 3000);

    }
    vm.openAlerts = function() {
      vm.showAlertTab = true;
      $timeout(function() {
        UserFactory.deleteAlerts(vm.status._user.id).then(function() {
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
        vm.status = UserFactory.status;
        vm.user = null;
        $state.go("QuestionsFeed");
      });
    };

    vm.logoutUser = function() {
      UserFactory.logoutUser().then(function() {
        vm.status = null;
        $state.go("Home");
      });
    };

  }
})();
