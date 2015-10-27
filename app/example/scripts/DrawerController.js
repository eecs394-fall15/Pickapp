angular.
	module('example')
	.controller('DrawerController', function($scope, supersonic, $compile){
		$scope.sports = ['Basketball', 'Football', 'Soccer', 'Ultimate Frisbee', 'Baseball', 'Golf', 'Tennis', 'Volleyball'];
		$scope.sportsFilters = [false, false, false, false, false, false, false, false];

		$scope.submitFilters = function() {
			supersonic.data.channel('filters').publish($scope.sportsFilters);
			supersonic.ui.drawers.close();
		};
		$scope.resetFilters = function() {
			$('.sports-filter').attr('checked', false);
			$scope.sportsFilters = [false, false, false, false, false, false, false, false];
			supersonic.data.channel('filters').publish($scope.sportsFilters);
		};
	});