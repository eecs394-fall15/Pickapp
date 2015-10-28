angular.
	module('example')
	.controller('CancelController', function($scope, supersonic, $compile){
		var EventId=window.localStorage.getItem("event_id");
		var gameDelete = supersonic.data.model('Game');


		$scope.submitcancel = function()
		{

			var query = { "Event_ID" : EventId };
			gameDelete.findAll({query: JSON.stringify(query)}).then(function(games)
				{
					supersonic.logger.log(query);
					supersonic.logger.log("hi");
					games[0].delete().then(function(){
						var options = {
							message: "You have Cancelled the Event Successfully",
							buttonLabel: "Close"
						};
						supersonic.ui.dialog.alert("Success!", options).then(function() {
						 	supersonic.data.channel('cancelevent').publish(true);
							// var view = new supersonic.ui.View("example#join-game");
							supersonic.ui.layers.pop();
						});

					});
				});
		};

		$scope.toHome = function()
				{
					var modalView = new supersonic.ui.View("example#getting-started");
					var options = {
						animate: true
					};
					supersonic.ui.modal.hide();
				};
		});

