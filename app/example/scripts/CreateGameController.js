angular.
	module('example')
	.controller('CreateGameController', function($scope, supersonic, $compile){
		var gamesData = supersonic.data.model('Game');
		gamesData.findAll().then(function(games){$scope.numGames = games.length;});
		var createMap;
		var loadedGames;
		var testLocation = new google.maps.LatLng(42.053576, -87.672727);
		$scope.sports = ['Basketball', 'Football', 'Soccer', 'Ultimate Frisbee', 'Baseball', 'Tennis', 'Volleyball'];
		var markers = [];
		var infowindow;
		var marker;
		var firstTime = true;
		$scope.placeGame = true;


		$scope.$on('mapInitialized', function(evt, evtMap) {



			createMap = evtMap;
			createMap.panTo(testLocation);
			createMap.addListener('click', function(e) {
				$scope.placeMarkerAndPanTo(e.latLng, createMap);
			});
		});

		supersonic.ui.tabs.whenDidChange( function() {
			if(firstTime){
				firstTime = false;
				var instructions = {
					message: "Click on the map to create a game for today",
					buttonLabel: "Got it!"
				};

				supersonic.ui.dialog.alert("Instructions", instructions).then(function() {

				});
			}

			$scope.placeGame = true;
			if(marker) {
				marker.setMap(null);
			}
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
					var contentString = "<div id='content'> <h4>Create Event</h4>" +
						"<table style='width:100%'>"+
							"<tr>"+
								"<td>    Time: </td>" +
								"<td> <form novalidate class='simple-form'> <input type='time' ng-model='game.time' placeholder='HH:mm:ss' style='width: 125px; height: 20px; border: solid 1px #dcdcdc; transition: box-shadow .3s, border .3s;'  required></input> </form> </td>" +
							"</tr>"+
							"<tr>"+
								"<td>    Sport: </td>" +
								"<td>" +
									"<form novalidate class='simple-form'>" +
										"<select ng-model='game.sport' style='width: 125px; height: 20px; border: solid 1px #dcdcdc; transition: box-shadow .3s, border .3s;' required>"+
											"<option value='Baseball'>Baseball</option>" +
											"<option value='Basketball'>Basketball</option>" +
											"<option value='Football'>Football</option>" +
											"<option value='Frisbee'>Frisbee</option>" +
											"<option value='Soccer'>Soccer</option>" +
											"<option value='Tennis'>Tennis</option>" +
											"<option value='Volleyball'>Volleyball</option>" +
											"<option value='other'>Other</option>" +
										"</select>" +
									"</form>" +
								"</td>" +
							"</tr>"+
							"<tr>"+
								"<td>    Max Players: </td>" +
								"<td>" +
									"<form novalidate class='simple-form'>" +
										"<select ng-model='game.max' style='width: 125px; height: 20px; border: solid 1px #dcdcdc; transition: box-shadow .3s, border .3s;' required>" +
											"<option value=1>1</option>" +
											"<option value=2>2</option>" +
											"<option value=3>3</option>" +
											"<option value=4>4</option>" +
											"<option value=5>5</option>" +
											"<option value=6>6</option>" +
											"<option value=7>7</option>" +
											"<option value=8>8</option>" +
											"<option value=9>9</option>" +
											"<option value=10>10</option>" +
											"<option value=11>11</option>" +
											"<option value=12>12</option>" +
											"<option value=13>13</option>" +
											"<option value=14>14</option>" +
											"<option value=15>15</option>" +
											"<option value=16>16</option>" +
											"<option value=17>17</option>" +
											"<option value=18>18</option>" +
											"<option value=19>19</option>" +
											"<option value=20>20</option>" +
											"<option value=21>21</option>" +
											"<option value=22>22</option>" +
											"<option value=23>23</option>" +
											"<option value=24>24</option>" +
											"<option value=25>25</option>" +
											"<option value=26>26</option>" +
											"<option value=27>27</option>" +
											"<option value=28>28</option>" +
											"<option value=29>29</option>" +
											"<option value=30>30</option>" +
										"</select>"+
									"</form>" +
								"</td>" +
							"</tr>"+
							"<tr>"+
								"<td>Description: </td>"+
						"</table>"+
						"<textarea ng-model='game.description' rows='2' columns='40' style='border: solid 1px #dcdcdc; transition: box-shadow .3s, border .3s;' maxlength='105'></textarea>" +
						"<button class='button button-full button-balanced' ng-click='submitNewEvent(game)' style='border-radius: 10px'>Submit</button></div>";
					var compiledContent = $compile(contentString)($scope);
					infowindow = new google.maps.InfoWindow({
						content: compiledContent[0]
					});



					infowindow.open(createMap, marker);
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

			if(!game.sport || !game.time || !game.max){
					var alert = {
						message: "Please fill out all fields",
						buttonLabel: "Close"
					};

				supersonic.ui.dialog.alert("Missing Entry", alert).then(function() {
						supersonic.ui.modal.hide();
				});
				return;
			}

			if (!$scope.$$phase) $scope.$apply();
			var curtime=game.time;
			var curdate = new Date();
			var datetime = new Date(curdate.getFullYear(), curdate.getMonth(), curdate.getDate(), curtime.getHours(), curtime.getMinutes(), curtime.getSeconds());
			var uuid = device.uuid;
			var maxPlayers = parseInt(game.max, 10);
			var eventid = (1000 + 1 + $scope.numGames).toString();
			var eventnum = (Math.floor(Math.random() * 10000000)).toString();
			var gameObject = {
				Description: game.description,
				Creator_ID: uuid,
				Event_ID: eventnum,
				Lat: game.lat,
				Lng: game.lng,
				Max_Allowed: maxPlayers,
				RSVP_Count: 1,
				Time: game.time,
				Date: datetime,
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
			});
		};
	});
