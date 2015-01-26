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
			all: ['dist']
		},

		assemble: {
			options: {
				engine: 'swig',
				swig: {
			        varControls: ["{%=", "%}"]
		      	},
				layout: false,
				partials: ['src/layouts/**/*.swig'],
				flatten: true
			},
			dist: {
				files: {
					'dist/': ["src/pages/**/*.swig" ]
				}
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/assets/js/**/*.js'],
				dest: 'dist/js/all.min.js'
			}
		},

		copy: {
			dist: {
				files: [
					{ expand: true, flatten: true, src: 'src/assets/static/js/**', dest: 'dist/js/', filter: 'isFile' },
					{ expand: true, flatten: true, src: 'src/assets/static/*.*', dest: 'dist/' }

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

		uglify: {
			dist: {
				files: {
					'dist/js/all.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},

		watch: {
			assets: {
				files: ['src/assets/**/*'],
				tasks: ['concat', 'uglify', 'less']
			},
			src: {
				files: ['src/layouts/**/*', 'src/pages/**/*'],
				tasks: ['assemble']
			},
			dev_assets: {
				files: ['src/assets/**/*'],
				tasks: ['concat', 'less']
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			prod: {
				tasks: ['watch:src', 'watch:assets']
			},
			dev: {
				tasks: ['watch:dev_assets', 'watch:src']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-newer');

	/* grunt tasks */
	grunt.registerTask('development', ['clean', 'copy', 'concat', 'less', 'assemble', 'connect', 'concurrent:dev'])
	grunt.registerTask('default', ['clean', 'copy', 'concat', 'uglify', 'less', 'assemble', 'connect', 'concurrent:prod']);
};