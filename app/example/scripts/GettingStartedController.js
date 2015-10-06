angular.
	module('example')
	.controller('GettingStartedController', function($scope, supersonic){
		var gamesData = supersonic.data.model('Game');
		var map;
		var loadedGames;
		var testLocation = new google.maps.LatLng(42.074156, -87.683960);
		$scope.loadedGames = [{Position: "42.074156, -87.683960", Sport: 'Blah', Time: 'Blah o clock', MarkerID: 0}];
		$scope.$on('mapInitialized', function(evt, evtMap) {
			map = evtMap;
			map.panTo(testLocation);
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

			console.log('working');
		};
	});
