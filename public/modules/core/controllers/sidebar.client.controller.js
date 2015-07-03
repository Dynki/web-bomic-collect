'use strict';

angular.module('core').controller('SidebarController', ['$scope', 'Menus', 'Login',
    function($scope, Menus, Login) {
        $scope.loggedIn = Login.loggedIn;
    }
]);
