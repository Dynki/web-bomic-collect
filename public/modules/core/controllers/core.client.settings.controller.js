'use strict';

angular.module('core').controller('SettingsController', ['$scope','$mdDialog', 'settings','$rootScope',
    function($scope, $mdDialog, settings, $rootScope) {

        $scope.ApiLocation = ''; 
        
        settings.$get().$promise.then(function(response){
            $scope.ApiLocation = response;
        });

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.save = function(){

            var newSetting = {Id: 'ApiLocation', Value: $scope.ApiLocation};

            settings.$save(newSetting).$promise.then(function(){
                $scope.hide();
            });
        };
    }
]);
