//Contracts service used to communicate Contracts REST endpoints
angular.module('security').factory('Auth', ['$resource','settings',
    function($resource, settings) {

        var apiLocation = '';
        settings.$get('ApiLocation').$promise.then(function(value){
            apiLocation = value;
        });

        return $resource(apiLocation + '/Authentication', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

