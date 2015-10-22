angular.
	module('example')
	.controller('JoinGameController', function($scope, supersonic, $compile){
		var gamesData = supersonic.data.model('Game');
		var joinMap;
		var loadedGames;
		var testLocation = new google.maps.LatLng(42.053576, -87.672727);
		$scope.loadedGames = [];
		$scope.placeGame = false;
		$scope.$on('mapInitialized', function(evt, evtMap) {
			joinMap = evtMap;
			joinMap.panTo(testLocation);
			joinMap.addListener('click', function(e) {
				$scope.placeMarkerAndPanTo(e.latLng, joinMap);
			});
			$scope.loadData();
		});
		supersonic.ui.tabs.whenDidChange( function() {
			$scope.loadData();
		});
		$scope.getURL = function(sport)
		{
			var url;
			switch(sport) {
				case "Ultimate Frisbee":
				case "Frisbee":
					url = "/icons/frisbee.png";
					break;
				case "Soccer":
					url = "/icons/soccer.png";
					break;
				case "Football":
					url = "/icons/football.png";
					break;
				case "Basketball":
					url = "/icons/basketball.png";
					break;
				default:
					url = "/icons/default.png";

			}

			return url;

		};
		$scope.rsvpevent = function(id)
			{
				window.localStorage.setItem("event_id",id);
				var modalView = new supersonic.ui.View("example#rsvp");
				var options = {
					animate: true
				};
				supersonic.ui.modal.show(modalView, options);
			};
		$scope.cancelevent = function(id)
		{
			window.localStorage.setItem("event_id",id);
			var modalView = new supersonic.ui.View("example#cancel");
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
					var uuid = device.uuid;

					$scope.loadedGames.push({
						Position : currentLocation,
						Sport: currentSport,
						Time: currentTime,
						Max : currentGame.Max_Allowed,
						Count : currentGame.RSVP_Count,
						Eventid : currentGame.Event_ID,
						Creatorid : currentGame.Creator_ID,
						Uuid : uuid,
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
						map: joinMap
					});
					joinMap.panTo(latLng);
					$scope.game = {};
					$scope.game.lat = latLng.J.toString();
					$scope.game.lng = latLng.M.toString();
					var contentString = "<div id='content'> <h2>Create new event</h2>" +
						"<form novalidate class='simple-form'>" +
						"  Time: <input ng-model='game.min'></input>" +
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
					infowindow.open(joinMap, marker);
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

			if (!$scope.$$phase) $scope.$apply();
			var gameObject = {
				Lat: game.lat,
				Lng: game.lng,
				Time: game.time,
				Sport: game.sport
			};
			var newGame = new gamesData(gameObject);
			newGame.save().then(function(){
				console.log('Created new game with values: sport ' + game.sport + 'time ' + game.time);
			});


		};
		$scope.openSidebar = function(){
			supersonic.ui.drawers.open('left').then( function(){
				console.log('Opened drawers');
			});
		};
	});
