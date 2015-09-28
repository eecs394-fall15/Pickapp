angular.
	module('example')
	.controller('GettingStartedController', function($scope, supersonic){
		
		
		// $scope.pickupGameName = "NU pickup Soccer";
		// var pickupGame = supersonic.data.model('PickupGame');
		// var object = {
		// 	Location: '0.0005, 1.0234, 123.00033',
		// 	Sport: 'Soccer',
		// 	Time: 1235
		// };
		// var game1 = new pickupGame(object);
		// game1.save().then(function(){
		// 	PickupGame.findall().then(function(games){
		// 		$scope.pickupGameName = games[0].Sport;
		// 	});
		// });


		var map;
	  $scope.$on('mapInitialized', function(evt, evtMap) {
	    map = evtMap;

	    var gamesData = supersonic.data.model('Game');
		var firstGame = {lat: 42.058431, lng: -87.673650};
		// // gamesData.findall().then(function(games){
		// // 	firstGame = games[0];
		// // });
		var location = {lat: firstGame.lat, lng: firstGame.lng};
	    // var testMarker = new google.maps.Marker({position: firstGame, map: map});
	    // map.panTo(e.latLng);

	    // $scope.placeMarker = function(e) {
	    //   var marker = new google.maps.Marker({position: e.latLng, map: map});
	    //   map.panTo(e.latLng);
	    // }
	  });
	  
	  
	});
