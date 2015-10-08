(function() {
  "use strict";
  angular.module('app').factory('AnswerFactory', AnswerFactory);
  AnswerFactory.$inject = ['$q', '$http', "$window", "$rootScope"];

  function AnswerFactory($q, $http, $window, $rootScope) {
    var o = {};

    o.addAnswer = addAnswer;

    o.findAnswer = findAnswer;

    o.editAnswer = editAnswer;

    o.deleteAnswer = deleteAnswer;

    function addAnswer(answer) {
      var q = $q.defer();
      $http.post('/api/answer/', answer).success(function(res) {
        q.resolve(res);

      })
      return q.promise;
    }

    function findAnswer(id) {
      var q = $q.defer();
      $http.post('/api/answer/' + id, null).success(function(res) {
        q.resolve(res);
      })
      return q.promise;
    }

    function editAnswer(id, edit) {
      var q = $q.defer();
      $http.post('/api/answer/edit/' + id, edit).success(function(res) {
        q.resolve(res);
      })
      return q.promise;
    }

    function deleteAnswer(answer_id) {
      var q = $q.defer();
      console.log('hitting delete in factory')
      $http.post('/api/answer/delete/', {
        answerId: answer_id
      }).success(function(res) {
        q.resolve();
      })
      return q.promise;
    }


    return o;
  }
})();
