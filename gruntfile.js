'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/modules/**/*.js'],
		clientCSS: ['public/modules/**/*.css']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/public/application.min.js': 'public/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: [
					{'public/dist/public/application.min.css': '<%= applicationCSSFiles %>'},
				]
			}
		},
        ngmin: {
            production: {
                files: [
					{'public/dist/public/application.js': '<%= applicationJavaScriptFiles %>'},
				]
            }
        },
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		copy: {
			main: {
				files: [
					// includes files within path
					// {expand: true, src: ['public/modules/**/views/*.html'], dest: 'public/dist/', filter: 'isFile'},
					{expand: true, src: ['public/lib/**/*.*'], dest: 'public/dist/', filter: 'isFile'},
					{expand: true, src: ['public/index.html'], dest: 'public/dist', filter: 'isFile'},
					{expand: true, src: ['public/config.js'], dest: 'public/dist', filter: 'isFile'}
				]
			}
		},
		bower_concat: {
			all: {
				dest: 'public/dist/public/vendor.js',
				cssDest: 'public/dist/public/vendor.css',
				bowerOptions: {
					relative: false
				}
			}
		},
		html2js: {
		  options: {
			base: 'public',
		    htmlmin: {
		      collapseBooleanAttributes: true,
		      collapseWhitespace: true,
		      removeAttributeQuotes: true,
		      removeComments: true,
		      removeEmptyAttributes: true,
		      removeRedundantAttributes: true,
		      removeScriptTypeAttributes: true,
		      removeStyleLinkTypeAttributes: true
		    }
		  },
		  main: {
		    src: ['public/modules/**/*.html'],
		    dest: 'public/dist/public/template_cache.js'
		  }
		}
	});
	
	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-bower-concat');

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var config = require('./config/env/all');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['loadConfig', 'ngmin', 'uglify', 'less', 'cssmin', 'copy', 'html2js']);
	// grunt.registerTask('build', ['loadConfig', 'ngmin', 'uglify', 'less', 'cssmin', 'copy']);

	// Compile LESS task.
	grunt.registerTask('compile-less', ['less']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'karma:unit']);
};
