module.exports = function(grunt) {
	// Internal strict mode
	'use strict';

	// Load all grunt tasks
	require('load-grunt-tasks')(grunt);

	var configs = {
		// Metadata
		pkg: grunt.file.readJSON("package.json"),

		// Configurable projects dirs
		dirs: {
			dev: {
				base: '../dev',
				sass: '../dev/assets/scss',
				css: '../dev/assets/css',
				img: '../dev/assets/img',
				js: '../dev/assets/js',
				fonts: '../dev/assets/fonts'
			},
			dist: {
				base: '../dist',
				sass: '../dist/assets/scss',
				css: '../dist/assets/css',
				img: '../dist/assets/img',
				js: '../dist/assets/js',
				fonts: '../dist/assets/fonts'
			}
		},

		// Dynamic Banner
		banner:
		"/** \n" +
		"* Theme Name: <%= pkg.title %> \n" +
		"* Theme URI: <%= pkg.homepage %> \n" +
		"* Description: <%= pkg.description %> \n" +
		"* Version: <%= pkg.version %> \n" +
		"* Author: <%= pkg.author.name %> \n" +
		"* Author URI: <%= pkg.author.url %> \n" +
		"**/" +
		"\n",

		// Run and open a local server
		connect: {
			dev: {
				options: {
					port: 9000,
					hostname: 'localhost',
					base: '<%= dirs.dev.base %>/',
					livereload: true,
					open: true
				}
			}
		},

		// Watch for file changes
		watch: {
			options: {
				livereload: true
			},
			sass: {
				files: ['<%= dirs.dev.sass %>/**/*.{scss,sass}'],
				tasks: ['compass:dev']
			},
			reload: {
				files: [
					'<%= dirs.dev.js %>/*.js',
					'<%= dirs.dev.base %>/*.html',
					'<%= dirs.dev.img %>/**/*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// Compile sass/scss to css
		compass: {
			dev: {
				options: {
					force: true,
					relativeAssets: true,
					noLineComments: true,
					assetCacheBuster: false,
					outputStyle: 'expanded',
					sassDir: '<%= dirs.dev.sass %>',
					cssDir: '<%= dirs.dev.css %>',
					imagesDir: '<%= dirs.dev.img %>',
					javascriptsDir: '<%= dirs.dev.js %>',
					fontsDir: '<%= dirs.dev.fonts %>'
				}                
			}
		},

		// Add a banner into dist CSS file
		cssmin: {
			dist: {
				options: {
					banner: '<%= banner %>'
				},

				files: {
					'<%= dirs.dist.css %>/style.min.css': [
						'<%= dirs.dev.css %>/style.css'
					],

					'<%= dirs.dist.base %>/assets/vendor/owl-carousel/owl.min.css': [
						'<%= dirs.dev.base %>/assets/vendor/owl-carousel/owl.carousel.css',
						'<%= dirs.dev.base %>/assets/vendor/owl-carousel/owl.theme.css'
					]
				}
			}
		},

		// Uglify: concat and minify
		uglify: {
			options: {
				mangle: false,
				banner: '<%= banner %> \n'
			},
			dist: {
				files: {
					'<%= dirs.dist.js %>/application.min.js': [
						'<%= dirs.dev.js %>/application.js'
					]
				}
			}
		},

		// Copy files from dev to dist
		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= dirs.dev.fonts %>/',
					src: ['**/*.{ttf,woff,svg,eot}'],
					dest: '<%= dirs.dist.fonts %>/'					
				}, {
					expand: true,
					cwd: '<%= dirs.dev.img %>/',
					src: ['**/*.{png,jpg}'],
					dest: '<%= dirs.dist.img %>/'					
				}, {
					expand: true,
					cwd: '<%= dirs.dev.js %>/libs/',
					src: ['*.js'],
					dest: '<%= dirs.dist.js %>/libs/'
				}, {
					expand: true,
					cwd: '<%= dirs.dev.base %>/assets/vendor/',
					src: ['**'],
					dest: '<%= dirs.dist.base %>/assets/vendor/'
				}]
			}
		},

		// Process html files
		processhtml: {
			dist: {
				files: {
					'<%= dirs.dist.base %>/index.html': [
						'<%= dirs.dev.base %>/index.html'
					]
				}
			}
		},

		// Ready? Deploy!
		'ftp-deploy': {
			build: {
				auth: {
					host: 'ftp.host.com',
					port: 21,
					authKey: 'key1'
				},
				src: '<%= dirs.dist.base %>',
				dest: 'www/online-shop',
				exclusions: [
					'<%= dirs.dist.base %>/tmp',
					'<%= dirs.dist.base %>/assets/vendor/owl-carousel/owl.carousel.css',
					'<%= dirs.dist.base %>/assets/vendor/owl-carousel/owl.theme.css',
					'../**/.DS_Store', 
					'../**/Thumbs.db', 
				]
			}
		}
	};


	// ------------------------------
	// Init Configurations

	grunt.initConfig(configs);
	

	// ------------------------------
	// Register Grunt Tasks

	// Watch & Live Reload
	grunt.registerTask('default', ['connect:dev', 'watch']);

	// Build a ready to deploy
	grunt.registerTask('build', ['compass:dev', 'cssmin', 'copy', 'uglify', 'processhtml']);

	// FTP Deploy
	grunt.registerTask('deploy', ['ftp-deploy']);
};
