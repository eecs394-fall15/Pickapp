angular.
	module('example')
	.controller('JoinGameController', function($scope, supersonic, $compile){
		var gamesData = supersonic.data.model('Game');
		var joinMap;
		var loadingGames = false; //Checking if the data is currently being loaded from the database.
		var testLocation = new google.maps.LatLng(42.053576, -87.672727);
		$scope.loadedGames = [];
		$scope.displayedGames = [];
		$scope.sports = ['Basketball', 'Football', 'Soccer', 'Ultimate Frisbee', 'Baseball', 'Golf', 'Tennis', 'Volleyball'];
		$scope.sportsFilters = [0, 0, 0, 0, 0, 0, 0, 0];
		$scope.placeGame = false;
		$scope.currentUUID;

		$scope.$on('mapInitialized', function(evt, evtMap) {
			joinMap = evtMap;
			joinMap.panTo(testLocation);
			$scope.loadData();
		});

		supersonic.ui.tabs.whenDidChange( function() {
			if(!loadingGames){
				loadingGames = true;
				$scope.loadData();
			}
		});

		$scope.getURL = function(sport)
		{
			var url;
			sport = sport.toLowerCase();
			switch(sport) {
				case "ultimate frisbee":
				case "frisbee":
					url = "/icons/frisbee.png";
					break;
				case "soccer":
					url = "/icons/soccer.png";
					break;
				case "football":
					url = "/icons/football.png";
					break;
				case "basketball":
					url = "/icons/basketball.png";
					break;
				case "baseball":
					url = "/icons/baseball.png";
					break;
				case "golf":
					url = "/icons/golf.png";
					break;
				case "tennis":
					url = "/icons/tennis.png";
					break;
				case "volleyball":
					url = "/icons/volleyball.png";
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
				$scope.loadedGames = [];
				for (var i =0; i < games.length; i++){
					var currentGame = games[i];
					var currentLocation = currentGame.Lat + ", " + currentGame.Lng;
					var currentSport = currentGame.Sport;
					var currentTime = currentGame.Time;

					$scope.currentUUID = device.uuid;

					$scope.loadedGames.push({
						Position : currentLocation,
						Sport: currentSport,
						Time: currentTime,
						Max : currentGame.Max_Allowed,
						Count : currentGame.RSVP_Count,
						Eventid : currentGame.Event_ID,
						Creatorid : currentGame.Creator_ID,
						MarkerID: i + 1

					});
				}
				$scope.displayedGames = $scope.loadedGames;
				$scope.$apply();
				loadingGames = false;
			});

		};

		supersonic.data.channel('filters').subscribe( function(message) {
			$scope.sportsFilters = message.sports;
			$scope.userGames = message.userGames;
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
			if($scope.userGames){
				for (var j = 0; j < $scope.displayedGames.length; j++){
					game = $scope.displayedGames[j];
					if(game.Creator_ID !== device.uuid){
						$scope.displayedGames.splice(j, 1);
					}
				}
			}
			$scope.$apply();
		};
		$scope.openSidebar = function(){
			supersonic.ui.drawers.open('left');
		};
	});
