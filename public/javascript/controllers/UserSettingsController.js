(function() {
  'use strict';
  angular.module('app')
    .controller('UserSettingsController', UserSettingsController);

  UserSettingsController.$inject = ['$http', '$stateParams', 'UserSettingsFactory'];

  function UserSettingsController($http, $stateParams, UserSettingsFactory) {
    var vm = this;
    vm.CUI; //Current User Informaton
    vm.userId = $stateParams.id // current user Id
      //FUNCTIONS to change Filter Question Settings

    vm.filterOn = function() {
      UserSettingsFactory.filterOn(vm.userId).then(function(res) {
        vm.getUser(vm.userId)
      })
    }
    vm.filterOff = function() {
      UserSettingsFactory.filterOff(vm.userId).then(function(res) {
        vm.getUser(vm.userId)
      })
    }
    vm.filterAlertOn = function() {
      UserSettingsFactory.filterAlertOn(vm.userId).then(function(res) {
        vm.getUser(vm.userId)
      })
    }
    vm.filterAlertOff = function() {
      UserSettingsFactory.filterAlertOff(vm.userId).then(function(res) {
        vm.getUser(vm.userId)
      })
    }
    vm.getUser = function(userId) {
      UserSettingsFactory.getUserInfo(userId).then(function(res) {
        vm.CUI = res;
      })
    }
    vm.getUser(vm.userId)

    //////FUNCTIONS to deal with Tags
    vm.tag = "";
    var counter = 0;

    function getTags() {
      UserSettingsFactory.getTags(vm.userId).then(function(res) {
        vm.tags = res
      })
    }
    getTags(); // gets all tags when user loads settings
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
      vm.saveTags();
    }
    vm.deleteTag = function(index) {
      vm.tags.splice(index, 1)
      vm.saveTags();
    }

    vm.saveTags = function() {
        // if(vm.tags.length === 0){
        // 	return
        // }
        UserSettingsFactory.removeTags(vm.userId).then(function(res) {
          UserSettingsFactory.addTags(vm.tags, vm.userId).then(function(res) {
          })
        })

      }
      //////////// MAP functions

    vm.homeLocation = {};

    vm.currentLocation = {};

    vm.infoWindow = new google.maps.InfoWindow();

    function getMeters(miles) {
      return miles * 1609.344;
    }
    vm.openhomeMap = function() {
      UserSettingsFactory.getUserInfo(vm.userId).then(function(res) {
        vm.currentRadius = res.radius
        vm.map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: res.lat,
            lng: res.lng
          },
          scrollwheel: true,
          zoom: 11,
        })
        var marker = new google.maps.Marker({
          map: vm.map,
          position: new google.maps.LatLng(res.lat, res.lng),
          title: 'Your Current Location',
          draggable: false
        });
        getCircle(res.lat, res.lng);


      })

      vm.mapHomeStatus = true;
    }

    vm.openMap = function() {
      vm.hlError = null;
      vm.successMes = null;
      vm.mapHomeStatus = false;
      vm.distanceSet = angular.copy(vm.distance)
        // UserSettingsFactory.getMap()
        // gets current location
      vm.mapStatus = true;
      UserSettingsFactory.getLocation().then(function(res) {

        //Sets up vm.circle with a value so there is no undefined error in the change event listener below
        getCircle(0, 0)

        vm.currentLocation.lat = res.location.lat;
        vm.currentLocation.lng = res.location.lng;
        vm.homeLocation.lat = res.location.lat;
        vm.homeLocation.lng = res.location.lng;
          //building map with current location
        vm.map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: vm.currentLocation.lat,
            lng: vm.currentLocation.lng
          },
          scrollwheel: true,
          zoom: 11,
        })
        var marker = new google.maps.Marker({
          map: vm.map,
          position: new google.maps.LatLng(vm.currentLocation.lat, vm.currentLocation.lng),
          title: 'Your Current Location',
          draggable: true
        });

        //Makes it so user can just select radius and go instead of needing to drag the pin
        document.getElementById('settingsRadius').addEventListener("change", function() {
          vm.cityCircle.setMap(null);
          console.log(vm.homeLocation);
          vm.currentLocation.lat = vm.homeLocation.lat || marker.position.J
          vm.currentLocation.lng = vm.homeLocation.lng || marker.position.M
          getCircle(vm.currentLocation.lat, vm.currentLocation.lng);
        });

        google.maps.event.addListener(marker, 'dragend', function() {
          if (vm.cityCircle) {
            vm.cityCircle.setMap(null);
          }
          // resets circle
          vm.homeLocation.lat = this.position.J
          vm.homeLocation.lng = this.position.M
            // vm.infoWindow.setContent('<h6>' + 'Your Current Location' + '</h6>');
            // vm.infoWindow.open(vm.map, marker);
          getCircle(vm.homeLocation.lat, vm.homeLocation.lng);


        });


      })


    }

    function getCircle(Pinlat, Pinlng) {
      vm.cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: vm.map,
        center: {
          lat: Pinlat,
          lng: Pinlng
        },
        radius: getMeters(vm.distance)
      });
    }

    vm.submitHomeLocation = function() { // submits location user selects
      vm.mapStatus = false;
      //makes sure there is a lat and lng
      if (!vm.homeLocation.lat) {
        vm.hlError = true;
        return;
      }
      if (!vm.homeLocation.lng) {
        vm.hlError = true;
        return;
      }
      if (vm.distance == "Select Radius") {
        vm.hlError = true;
        return;
      }


      getCircle(); // gets circle around radius

      vm.homeLocation.radius = vm.distance
      var id = vm.userId

      UserSettingsFactory.addHomeLocation(vm.homeLocation, id).then(function(res) {
        vm.hlAdded = true;
        vm.successMes = res;
      })
    }

    vm.closeMap = function() {
      vm.mapStatus = false;
      vm.distance = null;
    }

    vm.searchLocation = function() {
      var geocoder = new google.maps.Geocoder();
      var geocoderRequest = {
        address: vm.searchLoc
      };
      geocoder.geocode(geocoderRequest, function(results, status) {
        var loc = results[0].geometry.location
        vm.map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: loc.J,
            lng: loc.M
          },
          scrollwheel: true,
          zoom: 11,
        })
        var marker = new google.maps.Marker({
          map: vm.map,
          position: new google.maps.LatLng(loc.J, loc.M),
          title: 'Your Current Location',
          draggable: true
        });
        google.maps.event.addListener(marker, 'dragend', function() {
          if (vm.cityCircle) {
            vm.cityCircle.setMap(null);
          }
          // resets circle
          vm.homeLocation.lat = this.position.J
          vm.homeLocation.lng = this.position.M
            // vm.infoWindow.setContent('<h6>' + 'Your Current Location' + '</h6>');
            // vm.infoWindow.open(vm.map, marker);
          getCircle(vm.homeLocation.lat, vm.homeLocation.lng);

        });
      });

    }


  }

})();
