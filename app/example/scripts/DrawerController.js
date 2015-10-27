angular.
	module('example')
	.controller('DrawerController', function($scope, supersonic, $compile){
		$scope.sports = ['Basketball', 'Football', 'Soccer', 'Ultimate Frisbee', 'Baseball', 'Golf', 'Tennis', 'Volleyball'];
		$scope.sportsFilters = [false, false, false, false, false, false, false, false];
		$scope.userGames = false;

		$scope.submitFilters = function() {
			var filters = {
				sports: $scope.sportsFilters,
				userGames: $scope.userGames
			};
			supersonic.data.channel('filters').publish(filters);
			supersonic.ui.drawers.close();
		};
		$scope.resetFilters = function() {
			$('.sports-filter').attr('checked', false);
			$scope.sportsFilters = [false, false, false, false, false, false, false, false];
			$scope.userGames = false;
			var filters = {
				sports: $scope.sportsFilters,
				userGames: $scope.userGames
			};
			supersonic.data.channel('filters').publish(filters);
		};
	});