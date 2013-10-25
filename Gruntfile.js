module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat : {
			options : {
				separator : ";"
			},
			dist : {
				src : ['app/public/js/src/*.js'],
				dest: 'app/public/js/dist/komines.js'
			}
		},
		watch: {
			files: ['gruntfile.js', 'app/public/js/src/*.js', 'app/server.js'],
			tasks: ['jshint', 'concat']
		},
		jshint: {
			// define the files to lint
			files: ['gruntfile.js', 'test/unit/*.js', 'app/public/js/src/*.js', 'app/server.js', 'app/src/*.js'],
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

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['jshint', 'concat']);
};