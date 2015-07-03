'use strict';

// Static Look ups services used to retrieve static lookup data.
angular.module('general-lookups').factory('StaticLookup', ['$resource', 'settings', '$q', '$rootScope','pouchDB',
    function($resource, settings, $q, $rootScope, pouchDB) {

        var db = pouchDB('WBCollect', {adapter : 'websql'});

        // Load any static data that is defined on the client side into arrays attached to the lookupData object.
        var lookupData = {};

        lookupData.eventTypes = [{ id: 1, text: 'Key Working'}, {id: 2 , text: 'Home Visit'}];
        lookupData.locations = [{ id: 1, text: 'Location 1'}, {id: 2 , text: 'Location 2'}];
        lookupData.keyWorkers = [{ id: 1, text: 'Key Worker 1'}, {id: 2 , text: 'Key Worker 2'}];
        lookupData.eventStatus = [{ id: 1, text: 'OK'}, {id: 2 , text: 'Cancelled by Client'}];
        lookupData.times = [];

        function padMinutes(num, size) {
            var s = num+"";
            while (s.length < size) s = "0" + s;
            return s;
        };

        function loadLookupArrays(){
            var date = new Date(), interval=5;

            date.setHours(0);
            date.setMinutes(0);

            lookupData.times = [];

            for(var i=0; i < 288; i++){
                date.setMinutes(date.getMinutes() + interval);
                lookupData.times.push({text: padMinutes(date.getHours(),2) + ':' + padMinutes(date.getMinutes(),2), id: i});
            }

            settings.$get().$promise.then(function(apiLocation){
                // Load any $resource services and query their data to load a static list into an array attached to the lookupData object.
                var eventTypesService = $resource( apiLocation + '/EventTypes', {},{query: { method: 'GET', params: {}, isArray: true }});

                eventTypesService.query().$promise.then(function(apiResults){
                    var resultArray = [];

                    // Delete all old lookup values, by getting them all and then marking them as _deleted: true.                                        
                    db.allDocs({
                        include_docs: true,
                        startkey: 'EventType',
                        endkey: 'EventType\uffff'
                    }).then(function (results) {
                         
                        if (results.rows.length > 1) {
                            // Add the _deleted flag to all returned items.    
                            angular.forEach(results.rows, function(resultItem){
                                resultItem._deleted = true;
                            });
                            
                            // Bulk update all the items marked as deleted by calling bulkDocs and passing in the updated documents.
                            db.bulkDocs(results.rows).then(function (result) {
                                
                                // Re-populate the EventTypes documents from the results from the API.
                                angular.forEach(apiResults, function(resultItem){
                                    
                                    var updatedDocs = [];
                                    var item = { _id: 'EventType' + resultItem.etype1, table: 'EventTypes', key: resultItem.etype1, text: resultItem.name};
                                    updatedDocs.push(item);
                                    db.bulkDocs(updatedDocs);
    
                                    var arrayItem = { id: resultItem.etype1, text: resultItem.name};
                                    resultArray.push(arrayItem);
                                });
                                
                                lookupData.eventTypes = resultArray;
                            }).catch(function (err) {
                                console.log('general-lookup.service: failed to delete event types');
                            });
                        } else {
                            // Re-populate the EventTypes documents from the results from the API.
                            angular.forEach(apiResults, function(resultItem){
                                
                                var updatedDocs = [];
                                var item = { _id: 'EventType' + resultItem.etype1, table: 'EventTypes', key: resultItem.etype1, text: resultItem.name};
                                updatedDocs.push(item);
                                db.bulkDocs(updatedDocs);

                                var arrayItem = { id: resultItem.etype1, text: resultItem.name};
                                resultArray.push(arrayItem);
                            });
                            
                            lookupData.eventTypes = resultArray;
                        } 
                         
                    }).catch(function (err) {
                        console.log('general-lookup.service: failed to query event types');
                    });
                    
                }, function(){

                    // Get all values from local storeage as querying the API has failed.
                    db.allDocs({
                        include_docs: true,
                        startkey: 'EventType',
                        endkey: 'EventType\uffff'
                    }).then(function (results) {
                         
                        var resultArray = [];
                            
                        // Re-populate the EventTypes documents from the results from the local store.
                        angular.forEach(results.rows, function(resultItem){
                            
                            var arrayItem = { id: resultItem.key, text: resultItem.doc.text};
                            resultArray.push(arrayItem);
                        });
                        
                        lookupData.eventTypes = resultArray.sort(function(a, b) {
                            var textA = a.text.toUpperCase();
                            var textB = b.text.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        });
                    });
                });


                // Load any $resource services and query their data to load a static list into an array attached to the lookupData object.
                var eventStatusService = $resource( apiLocation + '/EventStatus', {},{query: { method: 'GET', params: {}, isArray: true }});

                eventStatusService.query().$promise.then(function(apiResults){
                    var resultArray = [];

                    // Delete all old lookup values, by getting them all and then marking them as _deleted: true.                                        
                    db.allDocs({
                        include_docs: true,
                        startkey: 'EventStatus',
                        endkey: 'EventStatus\uffff'
                    }).then(function (results) {
                         
                        if (results.rows.length > 1) {
                            // Add the _deleted flag to all returned items.    
                            angular.forEach(results.rows, function(resultItem){
                                resultItem._deleted = true;
                            });
                            
                            // Bulk update all the items marked as deleted by calling bulkDocs and passing in the updated documents.
                            db.bulkDocs(results.rows).then(function (result) {
                                
                                // Re-populate the EventTypes documents from the results from the API.
                                angular.forEach(apiResults, function(resultItem){
                                    
                                    var updatedDocs = [];
                                    var item = { _id: 'EventStatus' + resultItem.estatus1, table: 'EventStatus', key: resultItem.estatus1, text: resultItem.name};
                                    updatedDocs.push(item);
                                    db.bulkDocs(updatedDocs);
    
                                    var arrayItem = { id: resultItem.estatus1, text: resultItem.name};
                                    resultArray.push(arrayItem);
                                });
                                
                                lookupData.eventStatus = resultArray;
                            }).catch(function (err) {
                                console.log('general-lookup.service: failed to delete event status');
                            });
                        } else {
                            // Re-populate the lokkup documents from the results from the API.
                            angular.forEach(apiResults, function(resultItem){
                                
                                var updatedDocs = [];
                                var item = { _id: 'EventStatus' + resultItem.estatus1, table: 'EventStatus', key: resultItem.estatus1, text: resultItem.name};
                                updatedDocs.push(item);
                                db.bulkDocs(updatedDocs);

                                var arrayItem = { id: resultItem.estatus1, text: resultItem.name};
                                resultArray.push(arrayItem);

                            });
                            lookupData.eventStatus = resultArray;
                        } 
                         
                    }).catch(function (err) {
                        console.log('general-lookup.service: failed to query event status');
                    });
                    
                }, function(){
                    // Get all values from local storeage as querying the API has failed.
                    db.allDocs({
                        include_docs: true,
                        startkey: 'EventStatus',
                        endkey: 'EventStatus\uffff'
                    }).then(function (results) {
                         
                        var resultArray = [];
                            
                        // Re-populate the EventTypes documents from the results from the local store.
                        angular.forEach(results.rows, function(resultItem){
                            var arrayItem = { id: resultItem.key, text: resultItem.doc.text};
                            resultArray.push(arrayItem);
                        });
                        
                        lookupData.eventStatus = resultArray.sort(function(a, b) {
                            var textA = a.text.toUpperCase();
                            var textB = b.text.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        });
                    });
                });

                // Load any $resource services and query their data to load a static list into an array attached to the lookupData object.
                var locationsService = $resource( apiLocation + '/EventLocations', {},{query: { method: 'GET', params: {}, isArray: true }});

                locationsService.query().$promise.then(function(apiResults){
                    var resultArray = [];

                    // Delete all old lookup values, by getting them all and then marking them as _deleted: true.                                        
                    db.allDocs({
                        include_docs: true,
                        startkey: 'EventLocation',
                        endkey: 'EventLocation\uffff'
                    }).then(function (results) {
                         
                        if (results.rows.length > 1) {
                            // Add the _deleted flag to all returned items.    
                            angular.forEach(results.rows, function(resultItem){
                                resultItem._deleted = true;
                            });
                            
                            // Bulk update all the items marked as deleted by calling bulkDocs and passing in the updated documents.
                            db.bulkDocs(results.rows).then(function (result) {
                                
                                // Re-populate the EventTypes documents from the results from the API.
                                angular.forEach(apiResults, function(resultItem){
                                    
                                    var updatedDocs = [];
                                    var item = { _id: 'EventLocation' + resultItem.evloc1, table: 'EventLocations', key: resultItem.evloc1, text: resultItem.name};
                                    updatedDocs.push(item);
                                    db.bulkDocs(updatedDocs);
    
                                    var arrayItem = { id: resultItem.evloc1, text: resultItem.name};
                                    resultArray.push(arrayItem);
                                });
                                
                                lookupData.locations = resultArray;
                        }).catch(function (err) {
                                console.log('general-lookup.service: failed to delete event location');
                            });
                        } else {
                            // Re-populate the lokkup documents from the results from the API.
                            angular.forEach(apiResults, function(resultItem){
                                
                                var updatedDocs = [];
                                var item = { _id: 'EventLocation' + resultItem.evloc1, table: 'EventLocations', key: resultItem.evloc1, text: resultItem.name};
                                updatedDocs.push(item);
                                db.bulkDocs(updatedDocs);

                                var arrayItem = { id: resultItem.evloc1, text: resultItem.name};
                                resultArray.push(arrayItem);
                            });

                            lookupData.locations = resultArray;
                        } 
                         
                    }).catch(function (err) {
                        console.log('general-lookup.service: failed to query event location');
                    });
                    
                }, function(){
                    // Get all values from local storeage as querying the API has failed.
                    db.allDocs({
                        include_docs: true,
                        startkey: 'EventLocation',
                        endkey: 'EventLocation\uffff'
                    }).then(function (results) {

                        var resultArray = [];
                            
                        // Re-populate the EventTypes documents from the results from the local store.
                        angular.forEach(results.rows, function(resultItem){
                            
                            var arrayItem = { id: resultItem.key, text: resultItem.doc.text};
                            resultArray.push(arrayItem);
                        });
                        
                        lookupData.locations = resultArray.sort(function(a, b) {
                            var textA = a.text.toUpperCase();
                            var textB = b.text.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        });
                    });
                });

                // Load any $resource services and query their data to load a static list into an array attached to the lookupData object.
                var keyworkersService = $resource( apiLocation + '/Keyworkers', {},{query: { method: 'GET', params: {}, isArray: true }});

                keyworkersService.query().$promise.then(function(apiResults){
                    var resultArray = [];

                    // Delete all old lookup values, by getting them all and then marking them as _deleted: true.                                        
                    db.allDocs({
                        include_docs: true,
                        startkey: 'Keyworker',
                        endkey: 'Keyworker\uffff'
                    }).then(function (results) {
                         
                        if (results.rows.length > 1) {
                            // Add the _deleted flag to all returned items.    
                            angular.forEach(results.rows, function(resultItem){
                                resultItem._deleted = true;
                            });
                            
                            // Bulk update all the items marked as deleted by calling bulkDocs and passing in the updated documents.
                            db.bulkDocs(results.rows).then(function (result) {
                                
                                // Re-populate the EventTypes documents from the results from the API.
                                angular.forEach(apiResults, function(resultItem){
                                    
                                    var updatedDocs = [];
                                    var item = { _id: 'Keyworker' + resultItem.keyw1, table: 'Keyworkers', key: resultItem.keyw1, text: resultItem.name};
                                    updatedDocs.push(item);
                                    db.bulkDocs(updatedDocs);
    
                                    var arrayItem = { id: resultItem.keyw1, text: resultItem.name};
                                    resultArray.push(arrayItem);
                                });
                                
                                lookupData.keyworkers = resultArray;
                            }).catch(function (err) {
                                console.log('general-lookup.service: failed to delete keyworkers');
                            });
                        } else {
                            // Re-populate the lokkup documents from the results from the API.
                            angular.forEach(apiResults, function(resultItem){
                                
                                var updatedDocs = [];
                                var item = { _id: 'Keyworker' + resultItem.keyw1, table: 'Keyworkers', key: resultItem.keyw1, text: resultItem.name};
                                updatedDocs.push(item);
                                db.bulkDocs(updatedDocs);

                                var arrayItem = { id: resultItem.keyw1, text: resultItem.name};
                                resultArray.push(arrayItem);
                            });
                            
                            lookupData.keyworkers = resultArray;
                        } 
                         
                    }).catch(function (err) {
                        console.log('general-lookup.service: failed to query keyworkers');
                    });
                    
                }, function(){

                    // Get all values from local storage as querying the API has failed.
                    db.allDocs({
                        include_docs: true,
                        startkey: 'Keyworker',
                        endkey: 'Keyworker\uffff'
                    }).then(function (results) {

                        var resultArray = [];
                            
                        // Re-populate the keyworkers array from the results from the local store.
                        angular.forEach(results.rows, function(resultItem){
                            
                            var arrayItem = { id: resultItem.key, text: resultItem.doc.text};
                            resultArray.push(arrayItem);
                        });
                        
                        lookupData.keyworkers = resultArray.sort(function(a, b) {
                            var textA = a.text.toUpperCase();
                            var textB = b.text.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        });
                    });
                });
            });
        }

        function getQueryData (arrayName) {
            return lookupData[arrayName];
        }

        // Internal function to get an item from an array by
        function getItemFromArrayById (arrayToSearch, id) {
            var returnVal = null;

            // Try to find a match by id.
            angular.forEach(lookupData[arrayToSearch], function (item) {
                if (item['id'] == id) returnVal = item;
            });

            // Find by id failed so try to find a match by text.
            if (returnVal === null){
                // Try to find a match by text.
                angular.forEach(lookupData[arrayToSearch], function (item) {
                    if (item['text'] == id) returnVal = item;
                });
            }

            return returnVal;
        }

        loadLookupArrays();

        return {
            query : function(arrayToQuery) {
                var deferred = $q.defer();
                deferred.resolve(getQueryData(arrayToQuery));
                return {$promise: deferred.promise};
            },
            get: function(arrayToQuery, id) {
                var deferred = $q.defer();
                var returnVal = getItemFromArrayById(arrayToQuery, id);

                if (returnVal === null) {
                    deferred.reject();
                } else {
                    deferred.resolve(returnVal);
                }

                return {$promise: deferred.promise};
            },
            loadArrays: loadLookupArrays
        };
    }
]);


