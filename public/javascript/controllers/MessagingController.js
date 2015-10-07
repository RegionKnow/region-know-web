(function() {
  'use strict';
  angular.module('app')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$http', '$rootScope', "$stateParams", "$state", "$mdDialog", "UserFactory"];

  function MessageController($http, $rootScope, $stateParams, $state, $mdDialog, UserFactory) {
    var vm = this;
    console.log("Instantiated");
    vm.title = 'Messaging - RegionKnow';
    vm.button = "Test call button";
    vm.inConversation;
    vm.testRequest = testRequest;
    vm.getConversations = getConversations;
    vm.openConvo = openConvoFancy;
    vm.closeConvo = closeConvo;
    vm.conversations;
    vm.getConversations();

    if ($stateParams.recipient) {
      vm.inConversation = true;
      vm.recipient = $stateParams.recipient;
      var participants = {
        participantOne: UserFactory.status._user.id,
        participantTwo: vm.recipient,
      }
      $http.post('/api/convo/convo-finder', participants).then(function(successResponse) {
        console.log(successResponse.data);
      }, function(errorResponse) {
        console.log(errorResponse.data);
      });
    } else {
      $stateParams.recipient = ""
    }

    function testRequest() {
      $http.get('/api/convo/rando').then(function(successResponse) {
        vm.testMessage = successResponse.body;
      });
    }

    function getConversations() {
      $http.post('/api/convo', {
        userId: UserFactory.status._user.id
      }).then(function(successResponse) {
        if (successResponse.data.conversations.length < 1) {
          vm.title = "No converstions to display";
        } else {
          vm.conversations = successResponse.data.conversations;
        }

      }, function(errorResponse) {

        console.log(errorResponse.data);
      })
    }

    function openConvo(convoIndex) {
      vm.convoInFocus = vm.conversations[convoIndex];
      vm.inConversation = true;

    }

    function closeConvo() {
      vm.inConversation = false;

    }

    function openConvoFancy(ev, convoIndex) {
      vm.convoInFocus = vm.conversations[convoIndex];
      $mdDialog.show({
          controller: [function () {
            var vm = this;
            console.log("Anon Controller");
          }],
          template: '<md-dialog>' +
                    '  <md-dialog-content>' +
                    '     Hi There {{vm.employee}}' +
                    '  </md-dialog-content>' +
                    '</md-dialog>',
          // targetEvent: ev,
          clickOutsideToClose: true,
          controllerAs: 'vm'
        })
        .then(function(answer) {
        console.log('You said the information was "' + answer + '".');
        }, function() {
        console.log('You cancelled the dialog.');
        });
    };
  }
})();
