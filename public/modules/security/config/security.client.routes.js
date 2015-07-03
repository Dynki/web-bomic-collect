'use strict';

//Setting up route
angular.module('security').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
            state('login', {
                url: '/login-offline',
                templateUrl: 'modules/security/views/security.login.client.view.html'
            });
    }
]);
