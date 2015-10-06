(function() {
  'use strict';
  angular.module('app')
    .controller('CreateQuestionController', CreateQuestionController);

  CreateQuestionController.$inject = ['$state', 'QuestionFactory', '$rootScope'];

	function CreateQuestionController($state, QuestionFactory, $rootScope) {
		var vm = this;
		
		vm.status = $rootScope._user;

		vm.getQuestions = function(){

			QuestionFactory.findQuestions(vm.status.id).then(function(res){
				// console.log(res)

				vm.allquestions = res;
			})
		}
		vm.getQuestions(); //getting all questions when page loads


		//////Method to create question!
		vm.question = {}

		vm.createQ = function(){
			vm.question.questionBody = vm.desc; // setting desc to questionbody
			console.log(vm.status.id);
			vm.question.user_id = vm.status.id;
			// vm.question.tag = vm.tag
			
			
			if(!vm.question.lat && !vm.question.lng){
				QuestionFactory.getLocation().then(function(res){
					console.log(res);
					//setting lng and lat if user has not selected it
					console.log('getting location');
					
						vm.question.lat = res.location.lat; 
						vm.question.lng = res.location.lng;
					
					// console.log(vm.question)
					// console.log('creating quesiton');
					QuestionFactory.createQuestion(vm.question).then(function(res){
						console.log(res);
						vm.saveTags(res);
							vm.question = {}; // deleting question object
							vm.desc = '';// deleting question in html
							$state.go('QuestionsFeed');
					})
				})
			}else{ //skips api call to find location
				console.log('skipped getting locaiton');
					QuestionFactory.createQuestion(vm.question).then(function(res){
							console.log(res);
							vm.saveTags(res);
								vm.question = {}; // deleting question object
								vm.desc = ''; // deleting question in html
								$state.go('QuestionsFeed');
						})

			}
			
		}

		//handling tag creation!
		vm.tag = "";
		var counter = 0;
		vm.tags = [];

		vm.showTagInput = function(){
			counter += 1
			vm.showInput = true;
			if(counter % 2 === 0){
				vm.showInput = false;
			}
			console.log(vm.showInput);
		}

		vm.addTag = function(tag){
			vm.tagError = false;
			if(tag == ""){
				return;
			}
			var split_tag = tag.split('')
			console.log(split_tag)
			for(var k= 0; k< split_tag.length; k++){
				if(split_tag[k] == ' '){
					vm.tagError = true;
					return;
				}
			}
			vm.tags.push(tag.toLowerCase());
			vm.tag = ""
		}

		vm.deleteTag = function(index){
			vm.tags.splice(index, 1);
		}

		vm.saveTags = function(question_id){
			console.log('in save tags' + question_id);
				QuestionFactory.addTags(vm.tags, question_id).then(function(res){
					console.log('saved tags');
					//alerts all users!
					QuestionFactory.sendAlerts(question_id).then(function(res){
						console.log('lookng to send alerts');
					})
				}, function(){
					console.log('skpped tags, still trying to alert');
					QuestionFactory.sendAlerts(question_id).then(function(res){
						console.log('lookng to send alerts');
					})
				})		
		}
		////Map Search
		vm.addQlocaiton = function(){
				vm.mapStatus = true;
				var geocoder = new google.maps.Geocoder();
				var geocoderRequest = { address: vm.quesitonLoction };
				geocoder.geocode(geocoderRequest, function(results, status){
					console.log(results);
					var loc = results[0].geometry.location;
					console.log(loc);
					vm.question.lat = loc.H;
					vm.question.lng = loc.L;
				vm.map = new google.maps.Map(document.getElementById('map'), {
						    center: {lat: loc.H, lng: loc.L},
						    scrollwheel: true,
						    zoom: 11,
		 		})
		 		var marker = new google.maps.Marker({
						            map: vm.map,
						            position: new google.maps.LatLng(loc.H, loc.L),
						            title: 'Your Current Location',
						            draggable: true
				});
				google.maps.event.addListener(marker, 'dragend', function(){
								if(vm.cityCircle){
									vm.cityCircle.setMap(null); 
								}
							
					        	vm.question.lat = marker.internalPosition.H;
					        	vm.question.lng = marker.internalPosition.L;
					        	console.log(vm.question);

					           	
				});
			});
			
		}
	}

})();
