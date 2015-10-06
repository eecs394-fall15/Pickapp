angular.
	module('example')
	.controller('GettingStartedController', function($scope, supersonic){
		var gamesData = supersonic.data.model('Game');
		var map;
		var loadedGames;
		$scope.$on('mapInitialized', function(evt, evtMap) {
			map = evtMap;
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
				$scope.loadedGames = [];
				for (var i =0; i < games.length; i++){
					var currentGame = games[i];
					var currentLocation = new google.maps.LatLng(parseFloat(currentGame.Lat), parseFloat(currentGame.Lng));
					var currentSport = currentGame.Sport;
					var currentTime = currentGame.Time;
					$scope.loadedGames.push({
						Position : currentLocation,
						Sport: currentSport,
						Time: currentTime,
						MarkerID: i
					});
					map.panTo(currentLocation);
				}

			});

			console.log('working');
		};
	});
