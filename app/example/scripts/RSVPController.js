angular.
	module('example')
	.controller('RSVPController', function($scope, supersonic, $compile){
		$scope.rsvp = {};
		$scope.rsvp.guest = 0;
		var EventId=window.localStorage.getItem("event_id");
		var rsvpData = supersonic.data.model('RSVPDetails');
		var gameUpdate = supersonic.data.model('Game');

	$scope.submitrsvp = function(rsvp)
	{
		var rsvpObject = {
			Event_ID: parseInt(EventId),
			Guest_Count:parseInt(rsvp.guest),
			Phone_No: parseInt(rsvp.phone),
			Comments: rsvp.comment
		};


	var query = { "Event_ID" : EventId}
		gameUpdate.findAll({query: JSON.stringify(query)}).then(function(games)
		 {
			supersonic.logger.log(query);
			games[0].RSVP_Count += parseInt(rsvp.guest)+1;

			 if((games[0].RSVP_Count <= games[0].Max_Allowed))
			 {
				 var RsvpDet = new rsvpData(rsvpObject);
				 RsvpDet.save().then(function(){
					 var options = {
						 message: "You have RSVPd Successfully",
						 buttonLabel: "Close"
					 };

					 supersonic.ui.dialog.alert("Success!", options).then(function() {

						 supersonic.data.channel('refresh').publish(true);

						 supersonic.ui.layers.pop();

					 });



				 });



				 games.save().then(function(){
					 supersonic.logger.log(EventId);
				 });


			 }


			 else
			 {

				 var options = {
					 message: "Total RSVPd Crosses Maximum Players",
					 buttonLabel: "Close"
				 };

				 supersonic.ui.dialog.alert("Oopssss!", options).then(function() {

					 supersonic.ui.layers.pop();
				 });

			 }



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