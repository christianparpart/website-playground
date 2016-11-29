'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var serveStatic = require('serve-static');

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        watch: {
            options: {
                nospawn: true
            },
            less: {
                files: ['app/styles/*.less'],
                tasks: ['less:server']
            }
        },
        connect: {
          options: {
            protocol: 'http', // 'https'
            hostname: 'localhost',
            keepalive: true,
            port: 9000,
            livereload: true,
            base: 'app'
          },
          server: {
            options: {
              middleware: function (connect) {
                return [
                  require('connect-livereload')(),
                  serveStatic('./app')
                ];
              }
            }
          }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        less: {
            server: {
                options: {
                    paths: ['app/components/bootstrap/less', 'app/styles']
                },
                files: {
                    'app/styles/main.css': 'app/styles/main.less'
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        grunt.task.run([
            'less:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });
};
