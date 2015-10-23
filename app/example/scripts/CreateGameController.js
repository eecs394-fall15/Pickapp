angular.
	module('example')
	.controller('CreateGameController', function($scope, supersonic, $compile){
		var gamesData = supersonic.data.model('Game');
		gamesData.findAll().then(function(games){$scope.numGames = games.length;});
		var createMap;
		var loadedGames;
		var testLocation = new google.maps.LatLng(42.053576, -87.672727);
		var markers = [];
		var infowindow;
		var marker;
		$scope.placeGame = true;
		$scope.$on('mapInitialized', function(evt, evtMap) {


			createMap = evtMap;

			createMap.panTo(testLocation);
			createMap.addListener('click', function(e) {
				$scope.placeMarkerAndPanTo(e.latLng, createMap);
			});
		});

		supersonic.ui.tabs.whenDidChange( function() {
			google.maps.event.trigger(createMap, 'resize');
			createMap.setZoom( createMap.getZoom() );
		});


		$scope.placeMarkerAndPanTo = function(latLng, map) {
			if($scope.placeGame){
					$scope.placeGame = false;
					marker = new google.maps.Marker({
						position: latLng,
						animation: google.maps.Animation.DROP,
						map: createMap
					});

					createMap.panTo(latLng);
					$scope.game = {};
					$scope.game.lat = latLng.lat();
					$scope.game.lng = latLng.lng();
					var contentString = "<div id='content'> <h2>Create new event</h2>" +
						"<form novalidate class='simple-form'>" +
						"   Time: <input type='time' ng-model='game.time' placeholder='HH:mm:ss' required></input><br>" +
						"  Sport: <input ng-model='game.sport' required></input> <br>" +
						"    Max: <input ng-model='game.max' required width='40%'></input>Players <br><br>" +
						"<input type='submit' ng-click='submitNewEvent(game)'></input>" +
						"</form>";
					var compiledContent = $compile(contentString)($scope);
					infowindow = new google.maps.InfoWindow({
						content: compiledContent[0]
					});



					var Sports = ['Basketball', 'Football', 'Soccer', 'Ultimate Frisbee'];
					infowindow.open(createMap, marker);
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

					marker.addListener('click', function(){
						infowindow.open(createMap, marker);
					});
				}
		};


		$scope.submitNewEvent = function(game){

			if (!$scope.$$phase) $scope.$apply();
			var uuid = device.uuid;
			var maxPlayers = parseInt(game.max, 10);
			var eventid = (1000 + 1 + $scope.numGames).toString();
			var eventnum = (Math.floor(Math.random() * 100000)).toString();
			var gameObject = {
				Creator_ID: uuid,
				Event_ID: eventnum,
				Lat: game.lat,
				Lng: game.lng,
				Max_Allowed: maxPlayers,
				RSVP_Count: 1,
				Time: game.time,
				Sport: game.sport
			};
			var newGame = new gamesData(gameObject);
			newGame.save().then(function(){
				var options = {
					message: "New game created sucessfully!",
					buttonLabel: "Close"
				};

			supersonic.ui.dialog.alert("Success!", options).then(function() {
					supersonic.ui.modal.hide();
				});
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
