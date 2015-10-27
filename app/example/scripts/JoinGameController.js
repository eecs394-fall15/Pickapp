angular.
	module('example')
	.controller('JoinGameController', function($scope, supersonic, $compile){
		var gamesData = supersonic.data.model('Game');
		var joinMap;
		var loadedGames;
		var testLocation = new google.maps.LatLng(42.053576, -87.672727);
		$scope.loadedGames = [];
		$scope.displayedGames = [];
		$scope.sports = ['Basketball', 'Football', 'Soccer', 'Ultimate Frisbee', 'Baseball', 'Golf', 'Tennis', 'Volleyball'];
		$scope.sportsFilters = [0, 0, 0, 0, 0, 0, 0, 0];
		$scope.placeGame = false;

		$scope.$on('mapInitialized', function(evt, evtMap) {
			joinMap = evtMap;
			joinMap.panTo(testLocation);
			$scope.loadData();
		});

		supersonic.ui.tabs.whenDidChange( function() {
			$scope.loadData();
			$scope.createFilters();
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

					//Code to pull all of the sports in the list so you can filter by those
					// if(!($scope.sports.includes(currentSport))){
					// 	$scope.sports.push(currentSport);
					// }

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
				$scope.displayedGames = $scope.loadedGames;
				$scope.$apply();
			});

		};

		supersonic.data.channel('filters').subscribe( function(message) {
			$scope.sportsFilters = message;
			$scope.createFilters();
		});

		$scope.createFilters = function(){
			var filters = {Sport: []};
			for(var i = 0; i < $scope.sports.length; i++){
				if($scope.sportsFilters[i]){
					filters.Sport.push($scope.sports[i]);
				}
			}
			$scope.filterData(filters);
		};

		$scope.filterData = function(filters)
		{
			//Data must be in format {Sport: ['sport1', 'sport2'], Time: startTime, User: 'UserID'}
			var sports = filters.Sport,
				now = new Date();
			$scope.displayedGames = $scope.loadedGames;
			//First filter by sport
			if(sports.length){ //If there are any filters selected
				$scope.displayedGames = [];
				for(var i = 0; i < $scope.loadedGames.length; i++){
					game = $scope.loadedGames[i];
					if(sports.includes(game.Sport)){
						$scope.displayedGames.push(game);
					}
				}
			}
			$scope.$apply();
		};
		$scope.openSidebar = function(){
			supersonic.ui.drawers.open('left');
		};
	});
