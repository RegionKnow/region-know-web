(function() {
  'use strict';
  angular.module('app')
    .controller('CreateQuestionController', CreateQuestionController);

  CreateQuestionController.$inject = ['$state', 'QuestionFactory', '$rootScope'];

  function CreateQuestionController($state, QuestionFactory, $rootScope) {
    var vm = this;
    vm.tag = "";
    var counter = 0;
    vm.tags = [];
    vm.status = $rootScope._user
    vm.question = {}

    vm.showTagInput = function() {
      counter += 1
      vm.showInput = true;
      if (counter % 2 === 0) {
        vm.showInput = false;
      }

    }
    vm.addTag = function(tag) {
      vm.tagError = false;
      if (tag == "") {
        return
      }
      var split_tag = tag.split('')
      for (var k = 0; k < split_tag.length; k++) {
        if (split_tag[k] == ' ') {
          vm.tagError = true;
          return
        }
      }
      vm.tags.push(tag.toLowerCase());
      vm.tag = ""
    }
    vm.deleteTag = function(index) {
      vm.tags.splice(index, 1)
    }

    vm.saveTags = function(question_id) {
      QuestionFactory.addTags(vm.tags, question_id).then(function(res) {

      })
    }

    vm.getQuestions = function() {

      QuestionFactory.findQuestions(vm.status.id).then(function(res) {
        //
        vm.allquestions = res
      })
    }
    vm.getQuestions(); //getting all questions when page loads

    vm.createQ = function() {
      vm.question.questionBody = vm.desc // setting desc to questionbody

      vm.question.user_id = vm.status.id;


      QuestionFactory.createQuestion(vm.question).then(function(res) {

        vm.saveTags(res);
        delete vm.question // deleting question object
        delete vm.desc // deleting question in html
        $state.go('QuestionsFeed')
      })
    }


  }
})();
