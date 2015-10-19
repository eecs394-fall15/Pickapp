angular.
	module('example')
	.controller('CreateGameController', function($scope, supersonic, $compile){
		var gamesData = supersonic.data.model('Game');
		gamesData.findAll().then(function(games){$scope.numGames = games.length;});
		var map;
		console.log(device.cordova);
		var loadedGames;
		var testLocation = new google.maps.LatLng(42.053576, -87.672727);
		var markers = [];
		var infowindow;
		var marker;
		$scope.placeGame = true;
		$scope.$on('mapInitialized', function(evt, evtMap) {
			map = evtMap;
			map.panTo(testLocation);
			map.addListener('click', function(e) {
				$scope.placeMarkerAndPanTo(e.latLng, map);
			});
		});


		$scope.placeMarkerAndPanTo = function(latLng, map) {
			if($scope.placeGame){
					$scope.placeGame = false;
					marker = new google.maps.Marker({
						position: latLng,
						animation: google.maps.Animation.DROP,
						map: map
					});

					map.panTo(latLng);
					$scope.game = {};
					$scope.game.lat = latLng.lat();
					$scope.game.lng = latLng.lng();
					var contentString = "<div id='content'> <h2>Create new event</h2>" +
						"<form novalidate class='simple-form'>" +
						//" Time: <div class=input-group bootstrap-timepicker>'
						//			<input id = 'timepicker1' type='text' class='form-control input-small'>
					//				<span class='input-group-addon'><i class='glyphicon glyphicon-time'></i></span>
					//			</div>" +
						"   Time: <input ng-model='game.time'></input>" +
						//"Sport: <input ng-model='game.sport' class='sport-selector'> </input><br>" +
						"   Sport: <input ng-model='game.sport'></input>" +
						"   Max: <input ng-model='game.max'></input><br><br>" +
						"<input type='submit' ng-click='submitNewEvent(game)'></button>" +
						"</form>";
					var compiledContent = $compile(contentString)($scope);
					infowindow = new google.maps.InfoWindow({
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

					google.maps.event.addListener(infowindow, 'closeclick', function(){
						$scope.placeGame = true;
						marker.setMap(null);
					});
					// $('#timepicker1').`timepicker();
				}
		};


		$scope.submitNewEvent = function(game){

			if (!$scope.$$phase) $scope.$apply();
			var uuid = device.uuid;
			var gameObject = {
				Creator_ID: uuid,
				Event_ID: 1000 + 1 + $scope.numGames,
				Lat: game.lat,
				Lng: game.lng,
				Max_Allowed: game.max,
				RSVP_Count: 1,
				Time: game.time,
				Sport: game.sport
			};
			var newGame = new gamesData(gameObject);
			newGame.save().then(function(){
				console.log('Created new game with values: sport ' + game.sport + 'time ' + game.time);
			});
			infowindow.close();
			$scope.placeGame = true;
			marker.setMap(null);
		};



		$scope.openSidebar = function(){
			supersonic.ui.drawers.open('left').then( function(){
				console.log('Opened drawers');
			});
		};
	});
