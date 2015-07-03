// Static Look ups services used to retrieve static lookup data.
angular.module('core').service('settings', ['$q', 'pouchDB',
    function($q, pouchDB) {

        var db = pouchDB('WBCollect', {adapter : 'websql'});
        var service = {};

        service.apiLocation = false;

        service.$query = function() {
            var deferred = $q.defer();

            db.get('settings').then(function (doc) {
                service.apiLocation = doc.apiLocation;
                deferred.resolve(service.apiLocation);
            }).catch(function (err) {

                var newSetting = {_id: 'settings', table: 'settings', apiLocation: ''};

                db.put(newSetting).then(function(response){
                    service.apiLocation = response.apiLocation;
                    deferred.resolve(service.apiLocation);
                });
            });
            
            return {$promise: deferred.promise};
        };

        service.$get = function(id) {
            var deferred = $q.defer();

            db.get('settings').then(function (doc) {
                service.apiLocation = doc.apiLocation;
                deferred.resolve(service.apiLocation);
            }).catch(function (err) {

                var newSetting = {_id: 'settings', table: 'settings', apiLocation: ''};

                db.put(newSetting).then(function(response){
                    service.apiLocation = response.apiLocation;
                    deferred.resolve(service.apiLocation);
                });
            });

            return {$promise: deferred.promise};
        };

        service.$save = function(setting){
            var deferred = $q.defer();

            db.get('settings').then(function (doc) {
                
                return db.put({
                   _id: 'settings',
                   table: 'settings',
                   _rev: doc._rev,
                   apiLocation: setting.Value 
                });
                
            }).then(function (response) {
                deferred.resolve();
            }).catch(function(err){
                console.log(err);
            });

            return {$promise: deferred.promise};
        };

        return service;
    }
]);

