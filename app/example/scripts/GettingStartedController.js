angular.
	module('example')
	.controller('GettingStartedController', function($scope, supersonic){
		var gamesData = supersonic.data.model('Game');
		var map;
			$scope.$on('mapInitialized', function(evt, evtMap) {
			map = evtMap;
			gamesData.findAll().then(function(games){
				for (var i =2; i < games.length; i++){
					currentGame = games[i];
					var contentString = "<b>" + currentGame.Sport + "</b> <br> " + currentGame.Time;
					var contentWindow = new google.maps.InfoWindow({
						content: contentString
					});
					var gameLocation = new google.maps.LatLng(parseFloat(currentGame.Lat), parseFloat(currentGame.Lng));
					var  testMarker= new google.maps.Marker({position: gameLocation, map: map});
					(function (_contentWindow){
						testMarker.addListener('click', function(){
							_contentWindow.open(map, this);
						});
					})(contentWindow);
				}
				map.panTo(gameLocation);
			})
		});


		$scope.loadData = function(){
			var firstGame;
			var contentWindows = [];
			gamesData.findAll().then(function(games){

				for (var i =0; i < 2; i++){
					currentGame = games[i];
					var contentString = "<b>" + currentGame.Sport + "</b> <br> " + currentGame.Time;
					var contentWindow = new google.maps.InfoWindow({
						content: contentString
					});
					var gameLocation = new google.maps.LatLng(parseFloat(currentGame.Lat), parseFloat(currentGame.Lng));
					var  testMarker= new google.maps.Marker({position: gameLocation, map: map});
					(function (_contentWindow){
						testMarker.addListener('click', function(){
							_contentWindow.open(map, this);
						});
					})(contentWindow);
				}

			});

			console.log('working');
		};
	});
