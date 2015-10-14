(function() {
  'use strict';
  angular.module('app')
  .controller('NavBarController', NavBarController);

  NavBarController.$inject = ['$mdSidenav', '$timeout', '$mdUtil', 'UserFactory', '$state', '$rootScope', "$modal", 'RankFactory'];

  function NavBarController($mdSidenav, $timeout, $mdUtil, UserFactory, $state, $rootScope, $modal, RankFactory) {

    var vm = this;
    vm.status = UserFactory.status;
    if(vm.status._user){
      $state.go("QuestionsFeed")
    }
    console.log(vm.status._user)

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


    //alerts. ranking, score collections ALL TIME OUT EVENTS RUNNING
    vm.alertObj = {}

    alertWatch();
    checkVotes();
    CollectRanks();

    function alertWatch() {
      $timeout(function() {
        UserFactory.grabAlert(vm.status._user.id).then(function(res) {
          console.log('watching for alerts')
          if(!res.alerts) return;
          if (res.alerts.length > 0) {
            vm.alertObj.status = true;
            vm.alertObj.alertNum = res.alerts.length;
            vm.alertObj.alerts = res.alerts;
          } else {
            vm.alertStatus = false;
          }

        })
        alertWatch();
      }, 3000);
    }

    var count = 1;

    vm.openAlerts = function() {
      count += 1
      console.log('cought alerts')
      if(count % 2 === 0 ){
        vm.showAlertTab = true;
      }else{
        vm.showAlertTab = false;
      }

      $timeout(function() {
        UserFactory.deleteAlerts(vm.status._user.id).then(function() {
          vm.alertObj.status = false;
          vm.showAlertTab = false;
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
      }, 300000);
    }

    function CollectRanks(){
      console.log('collecting Ranks')
      $timeout(function() {
        RankFactory.collectRanks().then(function(res){
          console.log('Ranks Organized')
        })
        CollectRanks();
      }, 300000);
    }


    //---------FUNCTIONALITY FOR REGISTER & LOGIN USER----------------------------------------------------------




    //USER login/REG

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
      loginModal.result.then(function(){
        vm.status = UserFactory.status;
        $state.go("QuestionsFeed");
        });
    };

    vm.openRegisterModal = function() {
      var registerModal = $modal.open({
        templateUrl: 'templates/register.html',
        controller: 'ModalInstanceController',
        controllerAs: "vm",
        size: "md"
      });
      registerModal.result.then(function(){
        console.log("Registered User");
        vm.openLoginModal();
      });
    };

  }
})();
