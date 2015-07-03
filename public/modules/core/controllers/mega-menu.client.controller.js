'use strict';

angular.module('core').controller('MegaMenuController', ['$scope', 'Menus',
    function($scope, Menus) {
        
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');
        $scope.expandedMenu = true;

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.expandMenu = function(){
           $scope.expandedMenu = !$scope.expandedMenu;
        };

        $scope.expandSubmenu = function(item){
            angular.forEach($scope.menu.items, function(menuitem){

                if (item !== menuitem){
                    menuitem.expanded = false;
                }
            });

            item.expanded = !item.expanded;
        };
    }
]);
