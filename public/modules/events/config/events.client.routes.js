'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function($stateProvider) {
		// Activity groups state routing
		$stateProvider.
			state('listEvents', {
				url: '/events',
				templateUrl: 'modules/events/views/list-events.client.view.html'
			}).
			state('createEvent', {
				url: '/events/create',
				templateUrl: 'modules/events/views/event.client.view.html'
			}).
			state('viewEvent', {
				url: '/events/:EventId',
				templateUrl: 'modules/events/views/event.client.view.html'
			}).
			state('editEvent', {
				url: '/events/:EventId/edit',
				templateUrl: 'modules/events/views/event.client.view.html'
			});
	}
]);
