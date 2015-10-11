angular.
	module('example')
	.controller('RSVPController', function($scope, supersonic, $compile){

	$scope.submitrsvp = function()
	{
		var modalView = new supersonic.ui.View("example#getting-started");
		var options = {
			animate: true
		};
		supersonic.ui.modal.show(modalView, options);
	};
});