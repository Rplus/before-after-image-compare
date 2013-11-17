module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    './assets/style/test.css': './assets/style/test.scss'
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
            sass: {
                files: ['./assets/style/*.scss'],
                tasks: ['sass'],
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
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['connect', 'sass']);
};