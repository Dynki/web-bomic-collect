'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Menus', 'Login', '$mdSidenav', '$location','StaticLookup', '$mdDialog', '$state', '$rootScope','settings','pouchDB',
	function($scope, Menus, Login, $mdSidenav, $location, StaticLookup, $mdDialog, $state, $rootScope, settings, pouchDB) {

		settings.$get('ApiLocation').$promise.then(function(value){
			$rootScope.ApiLocation = value;
		});

		$scope.Login = Login;

		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.openMenu = function() {
			$mdSidenav('left').toggle()
			.then(function(){
			});
		};

		$scope.loadEvents = function(){
			$location.path('/events');
		};

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		StaticLookup.loadArrays();

		$scope.logout = function(){
			$state.go('login');
		};

		$scope.showSyncDialog = function(ev) {
			$mdDialog.show({
				controller: 'SyncController',
				templateUrl: 'modules/core/views/core.client.sync.html',
				targetEvent: ev
			})
				.then(function(answer) {
					//$scope.alert = 'You said the information was "' + answer + '".';
				}, function() {
					//$scope.alert = 'You cancelled the dialog.';
				});
		};

		$scope.showSettings = function(ev) {
			$mdDialog.show({
				controller: 'SettingsController',
				templateUrl: 'modules/core/views/core.client.settings.html',
				targetEvent: ev
			})
				.then(function(answer) {
					//$scope.alert = 'You said the information was "' + answer + '".';
				}, function() {
					//$scope.alert = 'You cancelled the dialog.';
				});
		};

		$scope.showVersion = function(ev) {
			$mdDialog.show({
				controller: 'SettingsController',
				templateUrl: 'modules/core/views/core.client.version.view.html',
				targetEvent: ev
			})
				.then(function(answer) {
					//$scope.alert = 'You said the information was "' + answer + '".';
				}, function() {
					//$scope.alert = 'You cancelled the dialog.';
				});
		};

		$scope.clearData = function(ev) {

			$mdDialog.show({
				controller: 'SecurityLoginController',
				templateUrl: 'modules/core/views/core.client.clear-data.view.html',
				targetEvent: ev
			})
				.then(function(answer) {
					// Do Nothing.
				}, function() {
				});

		};
	}
]);
