(function() {
  'use strict';
  angular.module('app')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$http', '$rootScope', "$stateParams", "$state", "$mdDialog", "UserFactory", "$q"];

  function MessageController($http, $rootScope, $stateParams, $state, $mdDialog, UserFactory, $q) {
    var vm = this;
    vm.status = UserFactory.status;
    vm.title = 'Messaging';
    vm.button = "Test call button";


    if(!vm.status._user){
      $state.go("Home")
    }

    //Setup function/variable associations for controller
    vm.inConversation;
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







    function getConversations() {
      vm.loading = true;
      $http.post('/api/convo', {
        userId: UserFactory.status._user.id
      }).then(function(successResponse) {
        if (successResponse.data.conversations.length < 1) {
          vm.title = "No converstions to display";
        } else {
          vm.conversations = successResponse.data.conversations;
          vm.loading = false;
        }

      }, function(errorResponse) {

        console.log(errorResponse.data);
      })
    }

    function liveConvo() {
      vm.cancel = $q.defer();

      if(!vm.convoInFocus) return;
      // var config = {
      //   timeout: 60000
      // }
      var config = {
        timeout: vm.cancel.promise
      }
      $http.post("/api/convo/live-convo", {
        convoId: vm.convoInFocus._id,
        user: vm.status._user.id
      }, config).then(
        function(successResponse) {
          getOneConvo();
          liveConvo();
        },
        function(errorResponse) {
          console.log(errorResponse.data);
        })
    }
    function openConvo(convoIndex) {
      vm.convoInFocus = vm.conversations[convoIndex];
      vm.inConversation = true;
      activateConvo();
      liveConvo();

    }

    function activateConvo() {

      $http.post('/api/convo/activate-convo', {
        convoId: vm.convoInFocus._id,
        numMessages: vm.convoInFocus.messages.length,
        user: vm.status._user.id
      }).then(function (successResponse) {
        console.log("DEBUG: Convo active");
      }, function (errorResponse) {
        console.log(errorResponse.data);
      });
    }


    function closeConvo() {
      vm.inConversation = false;
      vm.getConversations();
      deactivateConvo();
      vm.cancel.resolve();
      vm.cancel = null;


    }

    function deactivateConvo() {

      $http.post('/api/convo/deactivate-convo', {convoId: vm.convoInFocus._id, user: vm.status._user.id}).then(function (successResponse) {
        console.log(successResponse.data);
        vm.convoInFocus = null;
      }, function (errorResponse) {
        console.log(errorResponse.data);
      });
    }


    function sendMessage() {
      if(!vm.newMessage) return;
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
      vm.loadingInConvo = true;
      if(!participants) {
        participants = {
          participantOne: vm.convoInFocus.participantOne,
          participantTwo: vm.convoInFocus.participantTwo
        }
      }
      $http.post('/api/convo/convo-finder', participants).then(function(successResponse) {
        vm.convoInFocus = successResponse.data;
        vm.loading = false;
      }, function(errorResponse) {
        console.log(errorResponse.data);
        vm.loading = false;
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
