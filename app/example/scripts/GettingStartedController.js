angular.
	module('example')
	.controller('GettingStartedController', function($scope, supersonic){
		var gamesData = supersonic.data.model('Game');
		var map;
		var loadedGames;
		var testLocation = new google.maps.LatLng(42.053576, -87.672727);
		$scope.loadedGames = [];
		$scope.placeGame = false;
		$scope.$on('mapInitialized', function(evt, evtMap) {
			map = evtMap;
			map.panTo(testLocation);
			map.addListener('click', function(e) {
			   $scope.placeMarkerAndPanTo(e.latLng, map);
			 });
			$scope.loadData();
		});
		$scope.rsvpevent = function()
			{

				var modalView = new supersonic.ui.View("example#settings");
				var options = {
					animate: true
				};
				supersonic.ui.modal.show(modalView, options);
			};

		$scope.loadData = function()
			{

			var firstGame;
			var contentWindows = [];
			gamesData.findAll().then(function(games){
				loadedGames = games;

				for (var i =0; i < games.length; i++){
					var currentGame = games[i];
					var currentLocation = currentGame.Lat + ", " + currentGame.Lng;
					var currentSport = currentGame.Sport;
					var currentTime = currentGame.Time;
					$scope.loadedGames.push({
						Position : currentLocation,
						Sport: currentSport,
						Time: currentTime,
						MarkerID: i + 1
					});
				}
				$scope.$apply();

			});

		};
		$scope.placeMarkerAndPanTo = function(latLng, map) {
			if($scope.placeGame){
					var marker = new google.maps.Marker({
						position: latLng,
						animation: google.maps.Animation.DROP,
						map: map
					});
					map.panTo(latLng);
					var contentString = "<div id='content'> <h2>Create new event</h2>" +
						" Time: <input></input><br>" +
						"Sport: <input> </input><br>" +
						"  Cap: <input> </input><br>" +
						"<button ng-click='submitNewEvent()'>Submit</button>";

					var infowindow = new google.maps.InfoWindow({
						content: contentString
					});
					infowindow.open(map, marker);
				}
		};
		$scope.submitNewEvent = function(){

		};
	});
