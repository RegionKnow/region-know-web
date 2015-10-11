(function() {
  'use strict';
  angular.module('app')
    .controller('QuestionAnwserController', QuestionAnwserController);

  QuestionAnwserController.$inject = ['$state', 'QuestionFactory', '$stateParams', 'AnswerFactory', 'UserFactory', '$http'];

  function QuestionAnwserController($state, QuestionFactory, $stateParams, AnswerFactory, UserFactory, $http) {
    var vm = this;
    vm.edit = {}
    vm.status = UserFactory.status;
    vm.AnswerObj = {};


    //logic for grabing individual question From questions feed
    if (!$stateParams.id) {

      alert('no question found')
    } else {
      vm.thisQuesitonId = $stateParams.id;
      // console.log($stateParams.id)
      QuestionFactory.findQuestion($stateParams.id).then(function(res) {

        vm.question = res
        vm.isAnswered = vm.question.answered
      })
    }
    //options for showing edit and delete buttons
    vm.showOptions = function() {
      vm.options = true;
    }
    vm.hideOptions = function() {
      vm.options = false;
      vm.showEdit = false;
    }

    // Answer Logic
    vm.addAnswer = function() {
      //AnswerObj is the answer for question
      // vm.AnswerObj.answerBody = vm.answer // sets answer
      vm.AnswerObj.user_id = vm.status._user.id // sets user who submited it
      vm.AnswerObj.questionId = vm.thisQuesitonId;
      console.log(vm.AnswerObj)
      AnswerFactory.addAnswer(vm.AnswerObj).then(function(res) {

          // ;
          vm.loading = true; // showing loading gif
          vm.AnswerObj = {} // removes local object answer
            //
          var AnswerId = {}
          AnswerId.id = res._id // saves id of answer
          var QuestionId = $stateParams.id


          QuestionFactory.addIdRef(AnswerId, QuestionId).then(function(res) { // function to add ref to question

            QuestionFactory.findQuestion($stateParams.id).then(function(res) {

              vm.question = res


              vm.loading = false;
            })
          })
        }
        //hadling errors
        // , function(res){
        // 	;
        // 	vm.errorMessage = res;
        // }
      )
    }


    function findAnswerVote(answer_id) {
      // console.log(answer_id)
      //gets whole question again to reload populate on answers!
      QuestionFactory.findQuestion($stateParams.id).then(function(res) {

        vm.question = res

        AnswerFactory.findAnswer(answer_id).then(function(res) {
          // console.log(res)

          vm.upOrdown = res;

        })

      })
    }


    vm.chooseAnswer = function(AnswerId, postedBy){
      console.log('inside choseAnswer')
      if(vm.status._user.id != vm.question.postedBy) return;
      if(vm.question.answered) return;
      QuestionFactory.confirmAnswer(vm.thisQuesitonId, AnswerId, vm.status._user.id).then(function(res){
        findAnswerVote(AnswerId);
        vm.isAnswered = AnswerId;
      })
    }

    vm.cancelChoseAnswer = function(AnswerId, postedBy){
      console.log('inside UnchoseAnswer')
      if(vm.status._user.id != vm.question.postedBy) return;
      QuestionFactory.deConfirmAnswer(vm.thisQuesitonId, AnswerId, vm.status._user.id).then(function(res){
        findAnswerVote(AnswerId);
        vm.isAnswered = null;
      })
    }

    vm.upVoteAnswer = function(answer_id) {
      vm.voteError = false;
      // vm.UpvoteColor = '';
      // vm.DownvoteColor = '';
      $http.post('/api/answer/upvote/' + answer_id + '/' + vm.status._user.id, null).success(function(res) {
        console.log(res)
        if (res == "You already voted!") {
          vm.voteError = true;
        }
        // vm.VoteAnimation = 'animated fadeInUp';
        findAnswerVote(answer_id);
      })
    }

    vm.downVoteAnswer = function(answer_id) {
      vm.voteError = false;
      // vm.UpvoteColor = '';
      // vm.DownvoteColor = '';
      $http.post('/api/answer/downvote/' + answer_id + '/' + vm.status._user.id, null).success(function(res) {
        // console.log(res)
        if (res == 'You already downvoted!') {
          vm.voteError = true;
        }
        // vm.VoteAnimation = 'animated fadeInDown';
        findAnswerVote(answer_id);
      })
    }

    vm.deleteQuestion = function(quesiton_id) {

      QuestionFactory.deleteQuestion(quesiton_id).then(function(res) {

        $state.go('QuestionsFeed')
      })
    }


    vm.deleteAnswer = function(answer_id) {

      AnswerFactory.deleteAnswer(answer_id).then(function(res) {
        QuestionFactory.findQuestion($stateParams.id).then(function(res) {

            vm.question = res
          })
          // $state.go('QuestionFeed')
      })
    }

    vm.editQuestion = function() {
      vm.showEdit = true;

    }

    vm.submitEdit = function(edit) {
      vm.showEdit = false;

      // vm.edit.questionBody  = edit
      QuestionFactory.editQuestion($stateParams.id, vm.edit).then(function(res) {
        QuestionFactory.findQuestion($stateParams.id).then(function(res) {

          vm.question = res

          vm.loading = false;
          vm.edit = {}
        })
      })
    }
  }
})();
