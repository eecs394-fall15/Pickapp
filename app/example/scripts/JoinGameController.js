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

		supersonic.ui.drawers.whenWillClose(function() {
			// $scope.createFilters();
		});

		$scope.hasDatePassed =function(gametime, systemtime) {
			return gametime > systemtime;
		};

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
				supersonic.ui.layers.push(modalView, options);
			};

		supersonic.data.channel('refresh').subscribe(function(message)
		{
			$scope.loadData();
		});


		supersonic.data.channel('cancelevent').subscribe(function(message)
		{
			supersonic.logger.log("test works");
			$scope.loadData();
		});


		$scope.cancelevent = function(id)
		{
			window.localStorage.setItem("event_id",id);
			var modalView = new supersonic.ui.View("example#cancel");
			var options = {
				animate: true
			};
			supersonic.ui.layers.push(modalView, options);
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
					var uuid = device.uuid;
					var systemdate = new Date();
					var currentDescription = currentGame.Description;

					$scope.currentUUID = device.uuid;

					$scope.loadedGames.push({
						Position : currentLocation,
						Sport: currentSport,
						Time: currentTime,
						Date1 : Date.parse(currentGame.Date),
						Max : currentGame.Max_Allowed,
						SystemDate : Date.parse(systemdate),
						Count : currentGame.RSVP_Count,
						Eventid : currentGame.Event_ID,
						Creatorid : currentGame.Creator_ID,
						Description : currentDescription,
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
				displayedGames = [],
				tempGame;
			$scope.displayedGames = [];
			//First filter by sport
			if(sports.length || $scope.userGames){ //If there are any filters selected
				if($scope.userGames){ //If they only want to show user games find only those games
					for(var i = 0; i < $scope.loadedGames.length; i++){
						tempGame = $scope.loadedGames[i];
						if(tempGame.Creatorid == device.uuid){
							displayedGames.push(tempGame);
						}
					}
				} else { //set the displayed games equal to all loaded games
					displayedGames = $scope.loadedGames;
				}
				if(sports.length){ //If there are any sports filters
					for(var j = 0; j < displayedGames.length; j++){
						tempGame = displayedGames[j];
						if(sports.includes(tempGame.Sport)){
							$scope.displayedGames.push(tempGame);
						}
					}
				} else { //If no sports filters
					$scope.displayedGames = displayedGames;
				}
			} else{ //If there were no filters at all load all games
				$scope.displayedGames = $scope.loadedGames;
			}
			$scope.$apply();
		};
		$scope.openSidebar = function(){
			supersonic.ui.drawers.open('left');
		};
	});
