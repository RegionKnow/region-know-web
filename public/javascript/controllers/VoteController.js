(function(){
	'use strict'
	angular.module('app').controller('VoteController', VoteController);
	VoteController.$inject = ['$state', '$http', '$stateParams', 'UserFactory', 'QuestionFactory'];
	function VoteController($state, $http, $stateParams, UserFactory, QuestionFactory){
		var vm = this;
		vm.isliked = false;
		var question_id = $stateParams.id;
		vm.status = UserFactory.status;
		
		findQuestionVote(question_id);
		findQuestionLike(question_id);
		// findQuestionVote();
		 vm.favoriteQuesiton = function(){
		 	console.log(vm.isliked)
		 	if(!vm.isliked){
			 	$http.post('/api/question/favorite/' + question_id + '/' + vm.status._user.id, null).success(function(res){
					// console.log(res)
					// vm.favQAnimation = 'animated shake redHeart';
					findQuestionLike(question_id)


				})
			}else{
				$http.post('/api/question/unfavorite/' + question_id + '/' + vm.status._user.id, null).success(function(res){
					// console.log(res)
					vm.isliked = false;
				})
				vm.favQAnimation = 'blackHeart';

			}
		 }
		vm.upVote = function(){
			$http.post('/api/question/upvote/' + question_id + '/' + vm.status._user.id, null).success(function(res){
				console.log(res)
				findQuestionVote(question_id);

				vm.VoteAnimation = 'animated fadeInUp';


			})
		}

		vm.downVote = function(){
			$http.post('/api/question/downvote/' + question_id + '/' + vm.status._user.id, null).success(function(res, callback){
				console.log(res)
				findQuestionVote(question_id);

				vm.VoteAnimation = 'animated fadeInDown';

			})
		}
		function findQuestionVote(question_id){
			QuestionFactory.findQuestion(question_id).then(function(res){
				vm.DownvoteColor = '';
				vm.UpvoteColor = '';
				vm.voteNum = res.voteNum;
				vm.upOrdown = res;

				// console.log(vm.upOrdown.downvote.indexOf(vm.status._user.id))
				if(vm.upOrdown.downvote.indexOf(vm.status._user.id) != -1){
					vm.DownvoteColor = 'orange';
				}
				if(vm.upOrdown.upvote.indexOf(vm.status._user.id) != -1){
					vm.UpvoteColor = 'orange';
				}
			})
		}

		function findQuestionLike(question_id){
			UserFactory.findUser(vm.status._user.id).then(function(res){
				vm.liked = res.likedQuestions
				QuestionFactory.findQuestion(question_id).then(function(res){
					var currentQ = res
					if(vm.liked.indexOf(currentQ._id) != -1){
						// console.log('this question is liked alreayd')
						vm.favQAnimation = 'redHeart';
						vm.isliked = true;

					}
				})

			})
		}

	}
})();
