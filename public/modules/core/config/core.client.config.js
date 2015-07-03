'use strict';

// Config HTTP Error Handling
angular.module('core').config(['$httpProvider','$mdThemingProvider',
    function($httpProvider, $mdThemingProvider) {

        $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');

        // Delete this from header requests to enable CORS to work.
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

    }
]).run(['$rootScope', 'Login', '$location', '$window', '$timeout', '$http', 'settings',
    function($rootScope, Login, $location, $window, $timeout, $http, settings){
        $rootScope.ApiLocation = '';
        settings.$get('ApiLocation').$promise.then(function(value){
            $rootScope.ApiLocation = value;
        });

        $rootScope.$on('$stateChangeStart',function(e, toState){
            if (toState.url != '/login-offline' && !Login.loggedIn){
                $location.path('login-offline');
            }
        });

        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function () {
            $rootScope.$apply(function() {
                $rootScope.online = false;
            });
        }, false);
        $window.addEventListener("online", function () {
            $rootScope.$apply(function() {
                $rootScope.online = true;
            });
        }, false);

        function loop(){
            // When the timeout is defined, it returns a
            // promise object.
            var timer = $timeout(
                function() {
                },
                10000
            );

            timer.then(
                function() {
                    settings.$get('ApiLocation').$promise.then(function(apiLocation){
                        $http({
                            method: 'GET',
                            url: apiLocation + '/ApiStatus'
                        })
                            .success(function() {
                                $rootScope.connected = true;
                                loop();
                            })
                            .error(function() {
                                $rootScope.connected = false;
                                loop();
                            });
                    });
                }
            );
        }

        loop();
}]);