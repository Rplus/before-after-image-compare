module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    './assets/test.css': './assets/test.scss'
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
                files: ['./assets/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: 8000
                }
            },
            livereload: {
                files: ['./assets/**.*'],
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