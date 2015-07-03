'use strict';

(function() {
    // Events Controller Spec
    describe('Events Controller Tests', function() {
        // Initialize global variables
        var EventsController,
            scope,
            $httpBackend,
            $state,
            $stateParams,
            StaticLookup,
            $location,
            $rootScope,
            Login, 
            Utilities, 
            Idle;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function($controller, _$rootScope_, _$httpBackend_, _$stateParams_, _Login_) {
            // Set a new global scope
            $rootScope = _$rootScope_;

            scope = $rootScope.$new();
            
            Login = _Login_;
            Login.loggedIn = true;
            // Point global variables to injected services
            $httpBackend = _$httpBackend_;
            
            // Initialize the Events controller.
            EventsController = $controller('EventsController', {
                $scope: scope
            });
        }));

        it('$scope.createBlankEvent() should create a blank event on the scope', inject(function(Events) {
            // Create sample event.
            var sampleEvent = {
				WBNumber: '',
				Notes: '',
				Start: '',
				end: '',
				End: '',
                EventDate: moment().toDate(),
                CreatedDate: moment().toDate(),
				Uploaded: false,
				Error: false,
				ErrorText: ''
            };

            // // Run controller functionality
            scope.createBlankEvent();

            $rootScope.$digest();

            // Test scope value
            expect(scope.wbevent).toEqual(sampleEvent);
                
        }));

        it('$scope.find() should create an array with at least one event object fetched from local store', inject(function(Events) {

            // Create sample event.
            var sampleEvent = {
                WBNumber: '2',
                Notes: 'Some client notes',
                Start: '12:00',
                End: '12:30',
                Duration: 30,
                EventDate: moment().toDate(),
                CreatedDate: moment().toDate(),
                Uploaded: false,
                Error: false,
                ErrorText: ''
            };

            // Create a sample events array that includes the new event
            var sampleEvents = [sampleEvent];

            // Set GET response
            $httpBackend.expectGET('events').respond(sampleEvents);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.wbevents).toEqualData(sampleEvents);
        }));

        it('$scope.findOne() should create an array with one event object fetched from XHR using a eventId URL parameter', inject(function(Events) {
            // Create sample event.
            var sampleEvent = {
                WBNumber: '2',
                Notes: 'Some client notes',
                Start: '12:00',
                End: '12:30',
                Duration: 30,
                EventDate: moment().toDate(),
                CreatedDate: moment().toDate(),
                Uploaded: false,
                Error: false,
                ErrorText: ''
            };
        
           // Set the URL parameter
           $stateParams.EventId = '2';
        
           // Set GET response
           $httpBackend.expectGET(/events\/([0-9a-fA-F]{24})$/).respond(sampleEvent); 
        
           // Run controller functionality
           scope.findOne();
           $httpBackend.flush();
        
           // Test scope value
           expect(scope.wbevent).toEqualData(sampleEvent);
        }));
        
        it('$scope.create() redirect back to the events route', inject(function(Events) {
        
           // Run controller functionality
           scope.create();
        
           // Test URL redirection after the article was created
           expect($location.path()).toBe('/events');
        }));

        it('$scope.update() redirect back to the events route', inject(function(Events) {
            
           // Run controller functionality
           scope.update();
        
           // Test URL redirection after the article was created
           expect($location.path()).toBe('/events');
        }));
        
        //it('$scope.update() should update a valid article', inject(function(Articles) {
        //    // Define a sample article put data
        //    var sampleArticlePutData = new Articles({
        //        _id: '525cf20451979dea2c000001',
        //        title: 'An Article about MEAN',
        //        content: 'MEAN Rocks!'
        //    });
        //
        //    // Mock article in scope
        //    scope.article = sampleArticlePutData;
        //
        //    // Set PUT response
        //    $httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/).respond();
        //
        //    // Run controller functionality
        //    scope.update();
        //    $httpBackend.flush();
        //
        //    // Test URL location to new object
        //    expect($location.path()).toBe('/articles/' + sampleArticlePutData._id);
        //}));
        //
        //it('$scope.remove() should send a DELETE request with a valid articleId and remove the article from the scope', inject(function(Articles) {
        //    // Create new article object
        //    var sampleArticle = new Articles({
        //        _id: '525a8422f6d0f87f0e407a33'
        //    });
        //
        //    // Create new articles array and include the article
        //    scope.articles = [sampleArticle];
        //
        //    // Set expected DELETE response
        //    $httpBackend.expectDELETE(/articles\/([0-9a-fA-F]{24})$/).respond(204);
        //
        //    // Run controller functionality
        //    scope.remove(sampleArticle);
        //    $httpBackend.flush();
        //
        //    // Test array after successful delete
        //    expect(scope.articles.length).toBe(0);
        //}));
    });
}());