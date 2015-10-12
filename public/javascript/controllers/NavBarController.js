(function() {
  'use strict';
  angular.module('app')
  .controller('NavBarController', NavBarController);

  NavBarController.$inject = ['$mdSidenav', '$timeout', '$mdUtil', 'UserFactory', '$state', '$rootScope', "$modal"];

  function NavBarController($mdSidenav, $timeout, $mdUtil, UserFactory, $state, $rootScope, $modal) {

    var vm = this;
    vm.status = UserFactory.status;
    console.log(vm.status)

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
    // alertWatch();
    checkVotes();

    function alertWatch() {
      $timeout(function() {
        UserFactory.grabAlert(vm.status._user.id).then(function(res) {
          console.log('watching for alerts')
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

    function checkVotes(){
      $timeout(function() {
        console.log('reloading Nav')
        UserFactory.getGeneralPoints(vm.status._user.id).then(function(response){
          // console.log(response)
          UserFactory.reloadNav(vm.status._user.id).then(function(res){
            // console.log(res)
            vm.status._user.generalPoints = res.generalPoints
            vm.status._user.knowledgePoints = res.knowledgePoints
          }); 
        })
        checkVotes();
      }, 30000);
    }


    //---------FUNCTIONALITY FOR REGISTER & LOGIN USER----------------------------------------------------------

    // vm.registerUser = function() {
    //   UserFactory.registerUser(vm.user).then(function() {
    //     vm.user = null;
    //     $state.go("Login");
    //   });
    // };

    // vm.loginUser = function() {
    //   UserFactory.loginUser(vm.user).then(function(res) {
    //     vm.status = UserFactory.status;
    //     vm.user = null;
    //     $state.go("QuestionsFeed");
    //   });
    // };

    vm.logoutUser = function() {
      UserFactory.logoutUser().then(function() {
        vm.status = null;
        $state.go("Home");
      });
    };



    //---------FUNCTIONALITY FOR MODALS----------------------------------------------------------
    vm.openLoginModal = function() {
      var loginModal = $modal.open({
        templateUrl: 'templates/login.html',
        controller: 'ModalInstanceController',
        controllerAs: "vm",
        size: "md"
      });
      loginModal.result.then(function(user){
        UserFactory.loginUser(user).then(function(res) {
          vm.status = UserFactory.status;
          vm.user = null;
          $state.go("QuestionsFeed");
        });
      });
    };



    vm.openRegisterModal = function() {
      var registerModal = $modal.open({
        templateUrl: 'templates/register.html',
        controller: 'ModalInstanceController',
        controllerAs: "vm",
        size: "md"
      });
      registerModal.result.then(function(newUser){
        console.log(newUser);
        UserFactory.registerUser(newUser).then(function() {
          vm.user = null;
          vm.openLoginModal();
        });
      });
    };

  }
})();
