(function() {
  'use strict';
  angular.module('app')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$http', '$rootScope', "$stateParams", "$state", "$mdDialog", "UserFactory"];

  function MessageController($http, $rootScope, $stateParams, $state, $mdDialog, UserFactory) {
    var vm = this;
    vm.status = UserFactory.status;
    vm.title = 'Messaging';
    vm.button = "Test call button";

    //Setup function/variable associations for controller
    vm.inConversation;
    vm.testRequest = testRequest;
    vm.getConversations = getConversations;
    vm.openConvo = openConvo;
    vm.closeConvo = closeConvo;
    vm.conversations;
    vm.sendMessage = sendMessage;
    vm.getConversations();


    //Handles if user came from another the navbar or the question detail state
    if ($stateParams.recipient) {
      vm.inConversation = true;
      vm.recipient = $stateParams.recipient;
      var participants = {
        participantOne: UserFactory.status._user.id,
        participantTwo: vm.recipient,
      }
      $http.post('/api/convo/convo-finder', participants).then(function(successResponse) {
        vm.convoInFocus = successResponse.data;
      }, function(errorResponse) {
        console.log(errorResponse.data);
      });
    } else {
      $stateParams.recipient = ""
    }
    //End of if bracket
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
      vm.getConversations();
    }


    function sendMessage() {
      $http.post("/api/convo/new-message", {
        convoId: vm.convoInFocus._id,
        sender: vm.status._user.username,
        body: vm.newMessage
      }).then(function(successResponse) {
        getOneConvo(participants);
        vm.newMessage = "";

      }, function(errorResponse) {
        console.log(errorResponse.data);
      })


    }



    //gets one convo with the participants being an object with the properties participantOne and participantTwo
    function getOneConvo(participants) {
      console.log(participants, "getOneConvo");
      $http.post('/api/convo/convo-finder', participants).then(function(successResponse) {
        vm.convoInFocus = successResponse.data;
      }, function(errorResponse) {
        console.log(errorResponse.data);
      });

    }




    function openConvoFancy(ev, convoIndex) {
      vm.convoInFocus = vm.conversations[convoIndex];
      $mdDialog.show({
          controller: [function() {
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
