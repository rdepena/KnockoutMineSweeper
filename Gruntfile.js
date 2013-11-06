module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat : {
			options : {
				separator : ";"
			},
			dist : {
				src : ['public/js/src/*.js'],
				dest: 'public/js/dist/komines.js'
			}
		},
		watch: {
			files: ['gruntfile.js', 'public/js/src/*.js', 'server.js'],
			tasks:  ['jshint', 'concat', 'uglify']
		},
		jshint: {
			// define the files to lint
			files: ['gruntfile.js', 'test/unit/*.js', 'public/js/src/*.js', 'server.js', 'src/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// more options here if you want to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		},
		uglify: {
			options: {
				mangle: {
					except: []
				}
			},
			my_target: {
				files: {
					'public/js/dist/komines.min.js': ['public/js/dist/komines.js']
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};