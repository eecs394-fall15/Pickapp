angular.
	module('example')
	.controller('GettingStartedController', function($scope, supersonic, $compile){
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

				var modalView = new supersonic.ui.View("example#rsvp");
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
					$scope.placeGame = false;
					var marker = new google.maps.Marker({
						position: latLng,
						animation: google.maps.Animation.DROP,
						map: map
					});
					map.panTo(latLng);
					var contentString = "<div id='content'> <h2>Create new event</h2>" +
						"<form novalidate class='simple-form'>" +
						" Time: <input ng-model='game.time'></input><br>" +
						"Sport: <input ng-model='game.sport' class='sport-selector'> </input><br>" +
						"  Min: <input ng-model='game.min' style='width: 10%;'></input>" +
						"  Max: <input ng-model='game.max' style='width: 10%;'></input><br><br>" +
						"<input type='submit' ng-click='submitNewEvent(game)'></button>" +
						"</form>";
					var compiledContent = $compile(contentString)($scope);
					var infowindow = new google.maps.InfoWindow({
						content: compiledContent[0]
					});
					var Sports = ['Basketball', 'Football', 'Soccer', 'Ultimate Frisbee'];
					infowindow.open(map, marker);
					$('.sport-selector').autocomplete({
						source: Sports,
						minLength: 0,
						scroll: true
					}).focus(function() {
						$(this).autocomplete("search", "");
					});
				}
		};
		$scope.submitNewEvent = function(game){
			var gameObject = {
				Time: game.time,
				Sport: game.sport
			}
			var newGame = new gamesData(gameObject);
			newGame.save().then(function(){
				console.log('Created new game with values: sport ' + game.sport + 'time ' + game.time);
			});
		};
	});
