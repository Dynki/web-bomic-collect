'use strict';

// Events service used to communicate Contracts REST endpoints.
// Used to post events to Web Bomic and to get lookup lists from Web Bomic.
angular.module('events').factory('WBEvent', ['$resource','settings',
    function($resource, settings) {
        var apiLocation = '';
        settings.$get('ApiLocation').$promise.then(function(value){
            apiLocation = value;
        });

        return $resource(apiLocation + '/Events', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

// Event services used to perform CRUD/Sync operations on device storage.
angular.module('events').service('Events', ['$q', 'Login', 'WBEvent', '$rootScope', '$http', 'settings','pouchDB',
    function($q, Login, WBEvent, $rootScope, $http, settings, pouchDB) {

        // Open the database.
        var db = pouchDB('WBCollect', {adapter : 'websql'});

        var wbEvents = [];

        // Internal function to update an item in local storage, get called from one place the $sync method below.
        var updateItem = function (wbEvent) {
            var deferred = $q.defer();

            // Convert the event object passed in into a string of JSON.            
            var eventStr = JSON.stringify(wbEvent);
            
            // Encrypt the data in the string.
            var encObj =  Login.encrypt(eventStr);
            
            // Encrypted object passed back needs to be converted to a string before it can be strored.
            var encStr = encObj.toString();

            // Construct the document item (unique key for this document) from the event Id passed in. 
            var docId = 'Item'+wbEvent.EventId; 

            // Get the record you wish to updated. Yuo have to do this in order to get the doc._rev property which is needed 
            // when updating the document via db.put.
            db.get(docId).then(function(doc) {
              return db.put({
                _id: docId,
                _rev: doc._rev,
                EventId: wbEvent.EventId,
                table: 'Events', 
                payload: encStr, 
                uploaded: wbEvent.uploaded
              });
            }).then(function(){
                // Tell the promise we are done.
                deferred.resolve();
            }).catch(function (err) {
                console.log(err);
            });
            
            return {$promise: deferred.promise};
        };

        // Return a list of all events that have not yet been uplaoded.
        this.$query = function() {
            var deferred = $q.defer();
            
            // Get a list of all events (all events have an id that starts with 'Item' e.g. Item1, Item2 etc...).
            // The endKey 'Item/uffff' is a wildcard search that will return all documents which have an id that starts with 'Item'.    
            db.allDocs({
                include_docs: true,
                startkey: 'Item',
                endkey: 'Item\uffff'
            }).then(function (results) {

                var eventsToReturn = [];
                
                // Loop through each event item returned and if it has not already been uploaded then add it to the array of events to return.
                angular.forEach(results.rows, function(event){
                    if (event.doc.uploaded === false){
                        
                        // Before we can add it to the list to return we need to decrypt the data.
                        var decryptedStr = Login.decrypt(event.doc.payload);
                        var decryptedObj = JSON.parse(decryptedStr);
                        decryptedObj.EventId = event.doc.EventId;
                        decryptedObj.uploaded = event.doc.uploaded;
    
                        // Only add the event to the list to return if the hash id stored on the event data matches the hash id of the currently logged in user.
                        // Unfortunately we need to decrypt first before we can check this.
                        if (decryptedObj.hash == Login.hash){
                            eventsToReturn.push(decryptedObj);
                        }
                    }
                });
                
                // Tell the promise we are done and pass in the list of events to return.    
                deferred.resolve(eventsToReturn);
            });

            return {$promise: deferred.promise};
        };

        this.$sync = function(){
            var deferred = $q.defer();

            // Get a list of all events (all events have an id that starts with 'Item' e.g. Item1, Item2 etc...).
            // The endKey 'Item/uffff' is a wildcard search that will return all documents which have an id that starts with 'Item'.    
            db.allDocs({
                include_docs: true,
                startkey: 'Item',
                endkey: 'Item\uffff'
            }).then(function (events) {

                // Reset the total number of events to sync to zero. 
                var toSync = 0;

                // Count how many events that have not yet been uploaded and have the same hash id as the logged in user. 
                angular.forEach(events.rows, function(row){
                    if (row.doc.uploaded == false){ 
                        var ev = row.doc;
                        var decryptedStr = Login.decrypt(ev.payload);
                        var item = JSON.parse(decryptedStr);

                        if (item.hash == Login.hash){
                            toSync = toSync + 1;
                        }
                    }
                });
                
                // If no events to sync then broadcast message that is picked up in the core.client.sync.controller    
                if (toSync === 0){
                    $rootScope.$broadcast('sync-nothing');
                } else{
                    // Notifies the sync controller to start counting how many events have been synchronised.
                    $rootScope.$broadcast('sync-start', toSync);
    
                    // For each event that needs uploading, decrypt the data, create an object which contains the data to be uploaded and 
                    // call the API to post it to Web Bomic.
                    angular.forEach(events.rows, function(evItem){
                        if (evItem.doc.uploaded == false){
                            
                            // Decrypt the event data.
                            var event = evItem.doc;
                            var decryptedStr = Login.decrypt(event.payload);
                            var item = JSON.parse(decryptedStr);
            
                            // Final check that the hash id of the event matches the hash id of the logged in user.
                            if (item.hash == Login.hash){
                                
                                // Create an object that stores the data we wish to send to Web Bomic.
                                var eventItem = {
                                    EventId : evItem.doc.EventId,
                                    WBNumber : item.WBNumber,
                                    EventDate : item.EventDate,
                                    Start : item.Start.text,
                                    End : item.End.text,
                                    EventType : item.EventType.id,
                                    Status : item.Status.id,
                                    Keyworker : item.Keyworker.id,
                                    Location : item.Location.id,
                                    Notes : item.Notes,
                                    Duration : item.Duration,
                                    hash : Login.key,
                                    uploaded : true,
                                    User: item.User
                                };
        
                                // Get the API location from the stored settings on the device.
                                settings.$get('ApiLocation').$promise.then(function(returnedUrl){
                                    
                                    // Post the event to Web Bomic via the API.
                                    $http.post(returnedUrl + '/Events', eventItem)
                                    .success(function(data, status, headers, config) {
                                            
                                        // Event was uploaded successfully so update the 'uploaded' flag to true.
                                        eventItem.uploaded =  true;
                                        updateItem(eventItem).$promise.then(function(){
                                            // Broadcast an event that is picked up the the sync controller. This tell the controller to 
                                            // add 1 to the total of events successfully synchronised. 
                                            $rootScope.$broadcast('sync-event-success');
                                        });
                                    })
                                    .error(function(data, status, headers, config) {
                                            
                                        // Event failed to post to Web Bomic. Update the event with the details of the error.
                                        item.Error = true;
                                        item.ErrorText = data.Message;
                                        item.uploaded =  false;
                                        updateItem(item).$promise.then(function(){
                                            $rootScope.$broadcast('sync-event-fail');
                                        });
                                    });
    
                                });
                            }
                        }
                    });
                }
            });

            return deferred.promise;
        };

        // Get an event based on the id passed in.
        this.$get = function(idObj) {
            var deferred = $q.defer();

            var id = parseInt(idObj.EventId);
            
            // The id passed in is just a number so add the 'Item' prefix to it, otherwise nothing will be returned.
            db.get('Item'+id, {
                include_docs: true,
            }).then(function(result) {

                // Decrypt the event data.    
                var decryptedStr = Login.decrypt(result.payload);
                var decryptedObj = JSON.parse(decryptedStr);

                var event = decryptedObj;
                event.EventDate = moment(event.EventDate).toDate();
                event.EventId = result.EventId;
                event.uploaded = result.uploaded;

                // Tell the promise we are done and pass in the event to return.
                deferred.resolve(event);
            });

            return {$promise: deferred.promise};
        };

        // Save a NEW event.
        this.$save = function(wbEvent){
           var deferred = $q.defer();

           // Set some properties on the event that the user could not enter.
           // Store the users hash id on the event. This is important as we will only retreive events where the event hash id matches the hash id of the logged in user.
           wbEvent.hash = Login.hash;
           wbEvent.EventDate = moment(wbEvent.EventDate).format('LL');
           wbEvent.Error = false;
           wbEvent.ErrorText = '';
           
           // Convert the event object to a string of JSON. 
           var eventStr = JSON.stringify(wbEvent);
           // Encrypt the event string. 
           var encObj =  Login.encrypt(eventStr);
           var encStr = encObj.toString();
            
            // Get a list of all events (all events have an id that starts with 'Item' e.g. Item1, Item2 etc...).
            // The endKey 'Item/uffff' is a wildcard search that will return all documents which have an id that starts with 'Item'.
            // We are doing this so we can get the next event id to use as the document id.    
            db.allDocs({
                include_docs: false,
                startkey: 'Item',
                endkey: 'Item\uffff'
            }).then(function (results) {
                
               // Save the event to the device storage. 
               var eventId = results.rows.length + 1;
               db.put({_id: 'Item' + eventId , EventId: eventId, table: 'Events', payload: encStr, uploaded: false}).then(function(){
                   deferred.resolve(wbEvent);
               }).catch(function (err) {
                    console.log(err);
               });
            });
        
           return {$promise: deferred.promise};
        };
        
        // Update an EXISTING event.
        this.$update = function(wbEvent){
            var deferred = $q.defer();

            // Format the date for storeage.
            wbEvent.EventDate = moment(wbEvent.EventDate).format('LL');
            // Reset hte error text.
            wbEvent.Error = false;
            wbEvent.ErrorText = '';

           // Convert the event object to a string of JSON. 
           var eventStr = JSON.stringify(wbEvent);
           // Encrypt the event string. 
            var encObj =  Login.encrypt(eventStr);
            var encStr = encObj.toString();
            
            // Get the event from the document store. We need to do this in order to get the doc._rev property 
            // otherwise the db.put operation will think it is a new document and give us a key conflict.    
            var itemId = 'Item'+wbEvent.EventId; 
            db.get(itemId).then(function(doc) {
              return db.put({
                _id: itemId,
                _rev: doc._rev,
                EventId: wbEvent.EventId,
                table: 'Events', 
                payload: encStr, 
                uploaded: false
              });
            }).then(function(response) {
                // Tell the promise we are done.
                deferred.resolve();
            }).catch(function (err) {
                console.log(err);
            });

            return {$promise: deferred.promise};
        };
    }
]);

