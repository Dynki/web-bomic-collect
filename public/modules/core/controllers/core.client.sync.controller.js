'use strict';

angular.module('core').controller('SyncController', ['$scope','StaticLookup','$mdDialog', 'Events', '$timeout', '$mdToast', '$rootScope',
    function($scope, StaticLookup, $mdDialog, Events, $timeout, $mdToast, $rootScope) {

        $scope.loadArrays = function(){
            StaticLookup.loadArrays();
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.$on('sync-start', function(event, args) {
            $rootScope.toSync = args;
            $rootScope.syncSuccess = 0;
            $rootScope.syncFail = 0;
        });

        $scope.$on('sync-event-success', function(event, args) {
            $rootScope.syncSuccess = $rootScope.syncSuccess + 1;

            if ($rootScope.toSync === $rootScope.syncSuccess + $rootScope.syncFail){
                $rootScope.$broadcast('sync-complete');
            }
        });

        $scope.$on('sync-event-fail', function(event, args) {
            $rootScope.syncFail = $rootScope.syncFail + 1;

            if ($rootScope.toSync === $rootScope.syncSuccess + $rootScope.syncFail){
                $rootScope.$broadcast('sync-complete');
            }
        });


        $scope.$on('sync-nothing', function(event, args) {
            $timeout(function(){
                $scope.hide();

                $mdToast.show(
                    $mdToast.simple()
                        .content('No Events to Sync')
                        .position('bottom')
                        .hideDelay(3000)
                );

            },3000);

        });


        $scope.$on('sync-complete', function(event, args) {
            $timeout(function(){
                $scope.hide();

                $mdToast.show(
                    $mdToast.simple()
                        .content('Synchronisation Complete ('+ $rootScope.syncSuccess + ')')
                        .position('bottom')
                        .hideDelay(3000)
                );

            },3000);
        });

        $scope.syncEvents = function(){
            $scope.loadArrays();
            Events.$sync();
        };

        $scope.syncEvents();
    }
]);
