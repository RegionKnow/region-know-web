(function() {
  angular.module('app').controller("PasswordResetController", PasswordResetController);
  PasswordResetController.$inject = ["$state", '$http', "$timeout", "$stateParams", "$window"];

  function PasswordResetController($state, $http, $timeout, stateParams, $window) {
    var vm = this;
    vm.sendEmail = sendEmail;
    vm.changePassword = changePassword;
    vm.newPassword;
    vm.confirmPassword;
    vm.errorMessage = "";


    function changePassword() {
      var token = JSON.parse(urlBase64Decoder(stateParams.info.split(".")[1]));
      if (token.expirationDate < Date.now()) {
        vm.errorMessage = "Link expired...Sorry";
      } else {
        vm.errorMessage = "Link still valid!";
        if (!vm.newPassword || !vm.confirmPassword) {
          vm.errorMessage = " Password fields are empty!"
        } else {
          if (vm.newPassword !== vm.confirmPassword) {
            vm.errorMessage = "Your Passwords don't match!"
          } else {
            $http.post("/api/password-reset/finish", {
                userId: token.user.id,
                newPassword: vm.newPassword
              })
              .then(function(res) {
                vm.errorMessage = res.data.success;
                $timeout(function() {
                  $state.go('Home')
                }, 500);
              }, function(res) {
                console.log(res.data);
              })
          }
        }

      }
    }


    function sendEmail() {
      if (!vm.username) return vm.errorMessage = "No input";
      $http.post("/api/password-reset", {
          username: vm.username
        })
        .then(function(responseSuccess) {
          vm.errorMessage = "Success! Email Sent!!! Check your email, please.\nRedirecting to login page.."
          $timeout(function() {
            $state.go("Login");
          }, 3000)
        }, function(responseError) {
          vm.errorMessage = responseError.data.err;
          $timeout(function() {
            vm.errorMessage = '';
          }, 2000);
        })
    } //End of sendEmail function




    function urlBase64Decoder(str) {
      var output = str.replace(/-/g, '+').replace(/_/g, '/');
      switch (output.length % 4) {
        case 0:
          {
            break;
          }
        case 2:
          {
            output += '==';
            break;
          }
        case 3:
          {
            output += '=';
            break;
          }
        default:
          throw 'Illegal base64url string'
      }
      return decodeURIComponent(escape($window.atob(output)));
    } //End of base 64 decoder function





  } //End of PasswordResetContoller function
})();