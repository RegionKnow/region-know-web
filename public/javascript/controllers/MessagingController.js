(function() {
  'use strict';
  angular.module('app')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$http', '$rootScope', "$stateParams", "$state", "$mdDialog", "UserFactory", "$q", '$scope'];

  function MessageController($http, $rootScope, $stateParams, $state, $mdDialog, UserFactory, $q, $scope) {
    var vm = this;
    vm.status = UserFactory.status;
    vm.title = 'Messaging';
    vm.button = "Test call button";

    var pusher = new Pusher('92f79ef8623c09c0511e', {
      encrypted: true
    });


    if (!vm.status._user) {
      $state.go("Home");
    }

    //Setup function/variable associations for controller
    vm.inConversation;
    vm.getConversations = getConversations;
    vm.openConvo = openConvo;
    vm.closeConvo = closeConvo;
    vm.conversations;
    vm.sendMessage = sendMessage;
    vm.getConversations();

    var messageList = angular.element('#convoList');
    var messageForm = angular.element('#messageForm');
    messageForm.css('width', messageList.css('width'));


    //Handles if user came from another the navbar or the question detail state
    if ($stateParams.recipient) {
      vm.inConversation = true;
      vm.recipient = $stateParams.recipient;
      var participants = {
        participantOne: vm.status._user.id,
        participantTwo: vm.recipient,
      };
      getOneConvo(participants);
    } else {
      $stateParams.recipient = "";
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
      });
    }

    // function liveConvo() {
    //   vm.cancel = $q.defer();
    //
    //   var config = {
    //     timeout: vm.cancel.promise
    //   }
    //   $http.post("/api/convo/live-convo", {
    //     convoId: vm.convoInFocus._id,
    //     user: vm.status._user.id
    //   }, config).then(
    //     function(successResponse) {
    //       getOneConvo();
    //       liveConvo();
    //     },
    //     function(errorResponse) {
    //       console.log(errorResponse.data);
    //     })
    // }

    function openConvo(convoIndex) {
      vm.convoInFocus = vm.conversations[convoIndex];
      vm.channel = pusher.subscribe(vm.convoInFocus._id);
      vm.channel.bind('newMessage', function(data) {
        $scope.$apply(function() {
        vm.convoInFocus.messages.push(data.message);
        angular.element("html, body").animate({ scrollTop: angular.element(document).height() }, 1000);
        });
      });
      vm.inConversation = true;


    }

    // function activateConvo() {
    //
    //   $http.post('/api/convo/activate-convo', {
    //     convoId: vm.convoInFocus._id,
    //     numMessages: vm.convoInFocus.messages.length,
    //     user: vm.status._user.id
    //   }).then(function(successResponse) {
    //     console.log("DEBUG: Convo active");
    //   }, function(errorResponse) {
    //     console.log(errorResponse.data);
    //   });
    // }


    function closeConvo() {
      vm.inConversation = false;
      vm.getConversations();
      vm.channel = null;

    }

    // function deactivateConvo() {
    //
    //   $http.post('/api/convo/deactivate-convo', {
    //     convoId: vm.convoInFocus._id,
    //     user: vm.status._user.id
    //   }).then(function(successResponse) {
    //     console.log(successResponse.data);
    //     vm.convoInFocus = null;
    //   }, function(errorResponse) {
    //     console.log(errorResponse.data);
    //   });
    // }


    function sendMessage() {
      if (!vm.newMessage) return;
      $http.post("/api/convo/new-message", {
        convoId: vm.convoInFocus._id,
        sender: vm.status._user.username,
        body: vm.newMessage
      }).then(function() {
        vm.newMessage = "";

      }, function(errorResponse) {
        console.log(errorResponse.data);
      });


    }



    //gets one convo with the participants being an object with the properties participantOne and participantTwo
    function getOneConvo(participants) {
      // vm.loadingInConvo = true;
      if (!participants) {
        participants = {
          participantOne: vm.convoInFocus.participantOne,
          participantTwo: vm.convoInFocus.participantTwo
        };
      }
      $http.post('/api/convo/convo-finder', participants).then(function(successResponse) {
        vm.convoInFocus = successResponse.data;
      }, function(errorResponse) {
        console.log(errorResponse.data);
      });

    }



  }
})();
