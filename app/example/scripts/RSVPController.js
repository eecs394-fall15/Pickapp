angular.
	module('example')
	.controller('RSVPController', function($scope, supersonic, $compile){
		$scope.rsvp = {};
		var EventId=window.localStorage.getItem("event_id");
		var rsvpData = supersonic.data.model('RSVPDetails');


	$scope.submitrsvp = function(rsvp)
	{
		var rsvpObject = {
			Event_ID: parseInt(EventId),
			Guest_Count:parseInt(rsvp.guest),
			Phone_No: parseInt(rsvp.phone),
			Comments: rsvp.comment
		};
		var RsvpDet = new rsvpData(rsvpObject);
		RsvpDet.save().then(function(){
			var options = {
				message: "You have RSVPd Successfully",
				buttonLabel: "Close"
			};

			supersonic.ui.dialog.alert("Success!", options).then(function() {
				supersonic.ui.modal.hide();
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