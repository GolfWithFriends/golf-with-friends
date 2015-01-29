module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			dev: {
				options: {
					port: 8000,
					base: 'dist/'
				}
			}
		},

		clean: {
			dist: ['dist']
		},

		assemble: {
			options: {
				engine: 'swig',
				swig: {
			        varControls: ["{%=", "%}"],
			        cache: false
		      	},
				layout: false,
				partials: ['src/layouts/**/*.swig']
			},
			dist: {
				files: [
	      			{ expand: true, cwd: 'src/pages/', src: '**/*.swig', dest: 'dist/' }
	      		]
			}
		},

		copy: {
			static: {
				files: [
					{ expand: true, flatten: true, src: 'src/assets/static/js/**', dest: 'dist/js/', filter: 'isFile' },
					{ expand: true, flatten: true, src: 'src/assets/static/css/**', dest: 'dist/css/', filter: 'isFile' },
					{ expand: true, flatten: true, src: 'src/assets/static/*.*', dest: 'dist/' }

				]
			},
			dev: {
				files: [
					{ expand: true, cwd: 'src/assets/js', src:'**', dest: 'dist/js/' }
				]
			}
		},

		less: {
			development: {
				options: {
					paths: ['assets/css'],
					cleancss: true
				},
				files: {
					'dist/css/all.min.css': ['src/assets/css/**/*.less']
				}
			}
		},

		watch: {
			assets: {
				files: ['src/assets/**/*'],
				tasks: ['copy', 'less' ]
			},
			src: {
				files: ['src/layouts/**/*', 'src/pages/**/*'],
				tasks: ['assemble']
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			dev: {
				tasks: ['watch:assets', 'watch:src']
			}
		},

		useminPrepare: {
			html: 'dist/**/*.html',
			options: {
				dest: 'dist',
				root: 'src/assets'
			}
		},

		usemin: {
			html: ['dist/{,*/}*.html'],
			// css: ['dist/css/{,*/}*.css'],
			options: {
				dirs: ['dist']
			}
		},
	});

	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('assemble');

	/* grunt tasks */
	grunt.registerTask('default', [
		'clean:dist', 
	 	'assemble',
	 	'copy', 
	 	'less', 
	 	'connect', 
	 	'concurrent:dev'
 	]);

	grunt.registerTask('production', [
		'clean:dist', 
		'assemble', 
		'useminPrepare', 
		'copy:static', 
		'concat:generated', 
		'uglify:generated', 
		'less', 
		'usemin', 
		'connect::keepalive'
	]);
};