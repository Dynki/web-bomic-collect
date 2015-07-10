'use strict';

// Activities controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$state', 'Events', 'StaticLookup','$location','Login', '$rootScope','Utilities','Idle',
	function($scope, $stateParams, $state, Events, StaticLookup, $location, Login, $rootScope, Utils, Idle) {
		
		// If not logged in the redirect the user back to the log in screen.
		if(!Login.loggedIn){
			$state.go('login');
		}

		// If we have timed out due to inactivity then redirect the user back to the login screen.
		// This event is broadcast by ng-idle and is set up in event.client.config.js 
		$scope.$on('IdleTimeout', function() {
			$state.go('login');
		});

		// When synchronisation is complete then reload the event list.
		$scope.$on('sync-complete', function(event, args) {
			$scope.find();
		});

		$scope.wbevent = {};

		// Add a blank event to the view model.
		$scope.createBlankEvent = function(){

			var time = Utils.padMinutes(Utils.getRoundedTime(),2);

			StaticLookup.query('times').$promise.then(function(response){
				$scope.timeOpts = response;

				var timeFrom = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, time)];

				// Clear form fields
				$scope.wbevent = {
					WBNumber: '',
					Notes: '',
					Start: timeFrom,
					end: '',
					End: '',
					EventDate: moment().toDate(),
					CreatedDate: moment().toDate(),
					Uploaded: false,
					Error: false,
					ErrorText: '',
					User: Login.user
				};
			});
		};

		// Used by ng-if statements in events.client.view.html to determine if in create or edit state.
		$scope.currentState = function(stateToCheck){
			stateToCheck = stateToCheck + 'Event';
			return $state.is(stateToCheck) ?  true : false;
		};

		// Used by floating fab button (bottom right) in list-events.client.view to trigger new event and 
		// force the app to go to the 'createEvent' state that loads the view to enter the event details.
		$scope.createEvent = function(){
			$location.path('/events/create');
			$state.go('createEvent');
			$rootScope.showBack = true;
		};
		
		// Used when you click on an event in the list in list-events.client.view. This then loads the 'editEvent'
		// state that loads the view to edit the event details.
		$scope.loadEvent = function(id){
			$rootScope.showBack = true;
			$state.go('editEvent', {EventId: id});
			$location.path('/events/'+id+'/edit');
		};

		// Calls find() that loads an array of events into $scope.wbevents
		$scope.loadEvents = function(){
			$scope.find();
		};
		
		// Listen to broadcast of sync-complete event. This trigger the reloading of the events in the list.
		// This should then refresh this list to only show events that have failed to be synchronised, if any.
		$scope.$on('sync-complete', function(event, args) {
			$scope.loadEvents();
		});

		$scope.init = function(){
            $scope.createBlankEvent();
        };

		// Used by datetime picker, if removed datetime picker will not work correctly.
		$scope.open = function ($event, opened) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope[opened] = true;
		};

        // Create new Event in the device storage.
        $scope.create = function() {
            var event = $scope.wbevent;

			var timeFrom = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, event.Start.text)];
			var timeTo = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, event.End.text)];

			event.Duration = (timeTo.id - timeFrom.id) * 5;

			// Redirect after save
			Events.$save(event).$promise.then(function(response) {
				$location.path('events');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Remove existing Event
        $scope.remove = function( event ) {
			if ( $scope.wbevents ) {

				Events.$remove(event.EventId).$promise.then(function(){
					for (var i in $scope.wbevents ) {
						if ($scope.wbevents [i] === event ) {
							$scope.wbevents.splice(i, 1);
						}
					}

					$location.path('events');
				});
			} else {
				Events.$remove(event.EventId).$promise.then(function() {
					$location.path('events');
				});
			}
        };

        // Update existing Event
        $scope.update = function() {
			var event = $scope.wbevent ;

			var timeFrom = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, event.Start.text)];
			var timeTo = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, event.End.text)];

			event.Duration = (timeTo.id - timeFrom.id) * 5;

			event.IsDirty = true;
			event.Error = false;
			event.ErrorText = '';

			Events.$update(event).$promise.then(function() {
				$location.path('events');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Get a list of Events that have not been uploaded and are for this user.
        $scope.find = function() {
			// Hide the back button on the toolbar.
			$rootScope.showBack = false;
			Events.$query().$promise.then(function(response){
				$scope.wbevents = response;
			});
        };

        // Find existing Event based on the event id passed in on the route.
        $scope.findOne = function() {
            Events.$get({
                EventId: $stateParams.EventId
            }).$promise.then(function(data){
                    $scope.wbevent = data;
					
					$scope.wbevent.Start = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, $scope.wbevent.Start.text)];
					$scope.wbevent.End = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, $scope.wbevent.End.text)];
					$scope.wbevent.Keyworker = $scope.lookupData.keyworkers[Utils.indexOfObject($scope.lookupData.keyworkers, $scope.wbevent.Keyworker.text)];
					$scope.wbevent.EventType = $scope.lookupData.eventTypes[Utils.indexOfObject($scope.lookupData.eventTypes, $scope.wbevent.EventType.text)];
					$scope.wbevent.Location = $scope.lookupData.locations[Utils.indexOfObject($scope.lookupData.locations, $scope.wbevent.Location.text)];
					$scope.wbevent.Status = $scope.lookupData.eventStatus[Utils.indexOfObject($scope.lookupData.eventStatus, $scope.wbevent.Status.text)];
                });
        };

		// This code directs the flow of execution to a function dependant on the route, i.e. edit or create.
		if ($state.is('editEvent')) {
			StaticLookup.query('times').$promise.then(function(response) {
				$scope.timeOpts = response;
				$scope.findOne();
				Idle.watch();
			});
		} else if ($state.is('createEvent')){
			$scope.init();
			Idle.watch();
		}

		// -------------------------------- Event Start/End time validation ---------------------------------- //

		$scope.formErrors = false;
		
		// If the wbevent.Start value changes then call selectStart() function.
		$scope.$watch('wbevent.Start', function() {
			if ($scope.wbevent.Start){
				$scope.selectStart();
			}
		});

		// If the wbevent.End value changes then call selectStart() function.
		$scope.$watch('wbevent.End', function() {
			if ($scope.wbevent.Start){
				$scope.selectStart();
			}
		});

		// Check if the start time is before the end time if it is then stop the user from saving and display an error.
		$scope.selectStart = function(){
			var startTimeObj = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, $scope.wbevent.Start.text)];
			var startId = startTimeObj.id;
			var endTimeObj = $scope.timeOpts[Utils.indexOfObject($scope.timeOpts, $scope.wbevent.End.text)];

			if (endTimeObj){
				var endId = endTimeObj.id;

				if (startId > endId){
					$scope.formError = "Start Time cannot be after End Time.";
					$scope.formErrors = true;
				} else {
					$scope.formErrors = false;
				}
			}
		};

		// --------------------- Load Lookups ---------------------------------------- // 
		$scope.lookupData = {};

		StaticLookup.query('eventStatus').$promise.then(function(response){
			$scope.lookupData.eventStatus = response;
		});

		StaticLookup.query('eventTypes').$promise.then(function(response){
			$scope.lookupData.eventTypes = response;
		});

		StaticLookup.query('locations').$promise.then(function(response){
			$scope.lookupData.locations = response;
		});

		StaticLookup.query('keyworkers').$promise.then(function(response){
			$scope.lookupData.keyworkers = response;
		});
	}
]);
