'use strict';

// Configuring the Articles module
angular.module('events').run(['Menus','Idle',
	function(Menus, Idle) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Events', 'events', 'normal', '/events',false,['*'],0,'fa-bookmark');

		Idle.watch();
	}
]).config(function(IdleProvider){

	// ng-idle - configure Idle settings.
	IdleProvider.idle(300); // in seconds
	IdleProvider.timeout(30); // in seconds
});