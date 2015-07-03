'use strict';

module.exports = {
	app: {
		title: 'WB Collect',
		description: 'Web Bomic Events Collection',
		keywords: 'Web Bomic Events'
	},
	assets: {
		lib: {
			css: [
				'public/lib/**/*.css'
			],
			js: [
				'public/phantomjs-shim.js',
    			'public/lib/jquery/dist/jquery.min.js',
    			'public/lib/fastclick/lib/fastclick.js',
			    'public/lib/crypto-js/aes.js',
			    'public/lib/crypto-js/sha256.js',
			    'public/lib/crypto-js/enc-base64-min.js',
			    'public/lib/moment/moment.js',
			    'public/lib/angular/angular.js',
 			    'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-animate.min.js',
			    'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-aria.min.js',
			    'https://ajax.googleapis.com/ajax/libs/angular_material/0.10.0/angular-material.min.js',
			    'public/lib/angular-resource/angular-resource.min.js',
			    'public/lib/angular-mocks/angular-mocks.js',
			    'public/lib/angular-ui-router/release/angular-ui-router.min.js',
			    'public/lib/angular-ui-utils/ui-utils.js',
			    'public/lib/ng-idle/angular-idle.min.js',
				'public/lib/ng-mfb/src/mfb-directive.js',
			    'public/lib/velocity/velocity.min.js',
			    'public/lib/angular-material-components/dist/angular-material-components.js',
			    'public/lib/lumx/dist/lumx.js',
			    'public/lib/pouchdb/dist/pouchdb.min.js',
			    'public/lib/angular-pouchdb/angular-pouchdb.min.js',
            ]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
