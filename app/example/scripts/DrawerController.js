angular.
	module('example')
	.controller('DrawerController', function($scope, supersonic, $compile){
		$scope.sports = ['Basketball', 'Football', 'Soccer', 'Ultimate Frisbee', 'Baseball', 'Tennis', 'Volleyball'];
		$scope.sportsFilters = [false, false, false, false, false, false, false];
		$scope.userGames = false;
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
		$scope.submitFilters = function() {
			var filters = {
				sports: $scope.sportsFilters,
				userGames: $scope.userGames
			};
			supersonic.data.channel('filters').publish(filters);
			// supersonic.ui.drawers.close();
		};
	});
