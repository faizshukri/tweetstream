module.exports = function (grunt) {

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        build: {
          expand: true,
          cwd: 'app',
          src: '<%= source_script %>',
          dest: '<%= source_tmp %>'
        }
      },
      concat: {
        static_map: {
            src: ['<%= asset_script %>'],
            dest: '<%= source_tmp %>/assets/asset.js'
        },
        dist: {
            src: [ '<%=source_tmp%>/assets/**/*.js', '<%=source_tmp%>/js/**/*.js' ],
            dest: '<%=source_tmp%>/../js/app.js'
        },
        css: {
            files: {
                '<%= source_tmp %>/../css/style.css': ['app/assets/bootstrap/dist/css/bootstrap.min.css', 'app/css/style.css']
            }
        }
      },
      cssmin: {
        minify: {
            files: {
                'build/css/style.css': ['build/css/style.css']
            }
        }
      },
      clean: ['<%=source_tmp%>'],
      copy: {
        files: {
            expand: true,
            cwd: 'app/',
            src: ['css/{,*/}*.{png,jpg,jpeg,gif,webp}', '!css/**/*.css', 'templates/**/*'],
            dest: 'build/'
        }
      },
      htmlmin: {
          options: {                                 // Target options
            removeComments: true,
            collapseWhitespace: true
          },
          files: {                                   // Dictionary of files
            expand: true,
            cwd: 'build/',
            src: ['index.html', 'templates/**/*'],
            dest: 'build/'
          }
      },
      source_script: [
        'assets/underscore/underscore.js',
        'js/**/*.js',
      ],
      source_tmp: 'build/tmp',
      asset_script: [
        'app/assets/jquery/dist/jquery.min.js',
        'app/assets/angular/angular.min.js',
        'app/assets/angular-animate/angular-animate.min.js',
        'app/assets/bootstrap/dist/js/bootstrap.min.js'
      ],
      processhtml: {
        dist: {
            files: {
                'build/index.html': ['app/index.html']
            }
        }
      }

    });


    grunt.registerTask('build', [
        'uglify:build', 
        'concat:static_map', 
        'concat:dist',
        'concat:css',
        'cssmin',
        'copy',
        'processhtml',
        'htmlmin',
        'clean'
    ]);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
};