module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        compass: {
            dist: {
                options: {
                    sassDir: './assets/style/',
                    cssDir: './assets/style/'
                }
            }
        },

        connect: {
            server: {
                options: {
                    // hostname: '*'
                }
            }
        },

        watch: {
            compass: {
                files: ['./assets/style/*.scss'],
                tasks: ['compass'],
                options: {
                    livereload: 8000
                }
            },
            livereload: {
                files: ['./assets/**.*', './assets/script/*.js'],
                options: {
                    livereload: 8000
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['connect', 'compass']);
};