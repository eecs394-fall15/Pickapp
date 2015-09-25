angular.
	module('example')
	.controller('GettingStartedController', function($scope, supersonic){
		$scope.pickupGameName = "NU pickup Soccer";
		var pickupGame = supersonic.data.model('PickupGame');
		var object = {
			Location: '0.0005, 1.0234, 123.00033',
			Sport: 'Soccer',
			Time: 1235
		};
		var game1 = new pickupGame(object);
		game1.save().then(function(){
			PickupGame.findall().then(function(games){
				$scope.pickupGameName = games[0].Sport;
			});
		});
	});
