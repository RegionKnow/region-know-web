(function() {
	'use strict';
	angular.module('app')
	.controller('UserSettingsController', UserSettingsController);

	UserSettingsController.$inject = ['$http', '$stateParams', 'MapFactory'];

	function UserSettingsController($http, $stateParams, MapFactory) {
		var vm = this;
		console.log($stateParams)
		vm.homeLocation = {};
		vm.currentLocation = {};
		// vm.distance = 0;
		vm.infoWindow = new google.maps.InfoWindow();
		//funciton to get miles
		function getMeters(miles) {
		     return miles*1609.344;
		}

		//map function
		vm.openMap = function(){
			vm.distanceSet = angular.copy(vm.distance)
			// MapFactory.getMap()
			vm.mapStatus = true;
			MapFactory.getLocation().then(function(res){ // gets current location
				console.log(res)
				vm.currentLocation.lat = res.location.lat
				vm.currentLocation.lng = res.location.lng
				//building map with current location
				vm.map = new google.maps.Map(document.getElementById('map'), {
						    center: {lat: vm.currentLocation.lat, lng: vm.currentLocation.lng},
						    scrollwheel: true,
						    zoom: 11,
		 		})
		 		var marker = new google.maps.Marker({
						            map: vm.map,
						            position: new google.maps.LatLng(vm.currentLocation.lat, vm.currentLocation.lng),
						            title: 'Your Current Location',
						            draggable: true
				});
				google.maps.event.addListener(marker, 'dragend', function(){
								if(vm.cityCircle){
									vm.cityCircle.setMap(null); 
								}
								// resets circle
					        	console.log(marker)
					        	vm.homeLocation.lat = this.position.H
					        	vm.homeLocation.lng = this.position.L
					        	console.log(vm.homeLocation)
					            // vm.infoWindow.setContent('<h6>' + 'Your Current Location' + '</h6>');
					            // vm.infoWindow.open(vm.map, marker);
					            getCircle(vm.homeLocation.lat, vm.homeLocation.lng);
					           	
				});
				
				
			})
			
			
		}
		function getCircle(Pinlat, Pinlng){
					vm.cityCircle = new google.maps.Circle({
							    strokeColor: '#FF0000',
								strokeOpacity: 0.8,
								strokeWeight: 2,
								fillColor: '#FF0000',
								fillOpacity: 0.35,
								map: vm.map,
								center: {lat: Pinlat, lng: Pinlng},
								radius: getMeters(vm.distance)
			    	});
		}

		vm.submitHomeLocation = function(){ // submits location user selects
			vm.mapStatus = false;
			 //makes sure there is a lat and lng
			if(!vm.homeLocation.lat) return;
			if(!vm.homeLocation.lng) return;
			if(vm.distance == "Select Radius") return;
			getCircle(); 
			vm.homeLocation.radius = vm.distance
			console.log(vm.homeLocation)
			var id = $stateParams.id

			MapFactory.addHomeLocation(vm.homeLocation, id).then(function(res){
				vm.hlAdded = true;
				console.log('added homeLocation to UserModel')
			})
		}


	}
})();
