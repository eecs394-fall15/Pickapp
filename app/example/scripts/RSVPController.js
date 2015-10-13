angular.
	module('example')
	.controller('RSVPController', function($scope, supersonic, $compile){

	var EventId=window.localStorage.getItem("event_id");

	$scope.submitrsvp = function()
	{
		var modalView = new supersonic.ui.View("example#getting-started");
		var options = {
			animate: true
		};
		supersonic.ui.modal.hide();
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