angular.
	module('example')
	.controller('CreateGameController', function($scope, supersonic, $compile){
		var gamesData = supersonic.data.model('Game');
		var map;
		var loadedGames;
		var testLocation = new google.maps.LatLng(42.053576, -87.672727);
		var markers = [];
		$scope.loadedGames = [];
		$scope.placeGame = true;
		$scope.$on('mapInitialized', function(evt, evtMap) {
			map = evtMap;
			map.panTo(testLocation);
			map.addListener('click', function(e) {
				$scope.placeMarkerAndPanTo(e.latLng, map);
			});
		});
		
		$scope.placeMarkerAndPanTo = function(latLng, map) {
			if(true){
					$scope.placeGame = false;
					var marker = new google.maps.Marker({
						position: latLng,
						animation: google.maps.Animation.DROP,
						map: map
					});

					map.panTo(latLng);
					$scope.game = {};
					$scope.game.lat = latLng.J.toString();
					$scope.game.lng = latLng.M.toString();
					var contentString = "<div id='content'> <h2>Create new event</h2>" +
						"<form novalidate class='simple-form'>" +
						//" Time: <div class=input-group bootstrap-timepicker>'
						//			<input id = 'timepicker1' type='text' class='form-control input-small'>
					//				<span class='input-group-addon'><i class='glyphicon glyphicon-time'></i></span>
					//			</div>" +
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
					infowindow.open(map, marker);
					$('.sport-selector').autocomplete({
						source: Sports,
						minLength: 0,
						scroll: true
					}).focus(function() {
						$(this).autocomplete("search", "");
					});
					// $('#timepicker1').`timepicker();
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
