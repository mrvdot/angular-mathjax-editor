'use strict'

//var semver = require('semver');

module.exports = function (grunt) {

  //mountFolder = (connect, dir) - >
  //connect.static require('path').resolve(dir)

  require('load-grunt-tasks')(grunt);

  var yeomanConfig = {
    app: 'examples',
    src: 'src',
    dist: 'dist',
    test: 'test',
    extension: 'js',
  };

  grunt.initConfig({
    yeoman: yeomanConfig,

    // Watches files for changes and runs tasks based on the changed files
    // Add it to coffee if needed;
    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.src %>/{,*/}*.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.src %>/{,**/}*.js',
          '<%= yeoman.app %>/{,**/}*.html',
          '<%= yeoman.app %>/{,**/}*.css'
        ]
      },
      component: {
        files: ['{<%= yeoman.src %>,<%= yeoman.test %>}/*.js', 'bower_components/{,*/}*'],
        tasks: ['build']
      }
    },

    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    connect: {
      options: {
        port: 9000,
        hostname: "localhost",
        livereload: 35729
      },
      livereload: {
        options: {
          open: 'http://localhost:<%= connect.options.port %>',
          middleware: function (connect) {
            return [
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/' + yeomanConfig.src,
                connect.static('./' + yeomanConfig.src)
              ),
              connect.static('' + yeomanConfig.app)
            ];
          }
        }
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.src %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '{,**/}*.<%= yeoman.extension %>'
          ]
        }]
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/angular-mathjax-editor.min.js': ['<%= yeoman.dist %>/*.js']
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: [{
          expand: true,
          src: ['<%= yeoman.dist %>/*.js']
        }]
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      dist: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    clean: {
      dist: ['<%= yeoman.dist %>']
    }

  });

  grunt.registerTask('default', [
    'build',
    'watch:component'
  ]);

  grunt.registerTask('build', [
    // 'karma:dist',
    'clean:dist',
    'copy:dist',
    'ngAnnotate:dist',
    'uglify'
  ]);

  grunt.registerTask('test', [
    'karma:unit'
  ]);

  grunt.registerTask('serve', [
    'connect:livereload',
    'watch'
  ]);

};