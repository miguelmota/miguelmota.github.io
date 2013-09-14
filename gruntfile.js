module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        seperator: ';'
      },
      dist: {
        src: ['vendor/modernizr/modernizr.js', 'vendor/jquery/jquery.js', 'vendor/foundation/js/foundation/foundation.js', 'vendor/foundation/js/foundation/foundation.topbar.js', 'vendor/foundation/js/foundation/foundation.alerts.js', 'vendor/foundation/js/foundation/foundation.tooltips.js', 'vendor/picturefill/external/matchmedia.js', 'vendor/picturefill/picturefill.js', 'vendor/iosSlider/_src/jquery.iosslider.js', 'vendor/jquery.transit/jquery.transit.js', 'vendor/swiper/idangerous.swiper-1.9.js', 'js/main.js'],
        dest: 'js/main.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'js/main.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['gruntfile.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    watch: {
      html: {
        files: ['*.html', '**/*.html'],
        tasks: ['watch_html']
      },
      scripts: {
        files: ['js/*'],
        tasks: ['watch_scripts']
      },
      css: {
        files: ['sass/*'],
        tasks: ['watch_css']
      }
    },
    shell: {
      jekyll: {
        command: 'jekyll build',
        options: {
          stdout: true
        }
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-shell');
  grunt.registerTask*('test', ['jshint']);
  grunt.registerTask('watch_scripts', ['concat', 'uglify', 'shell']);
  grunt.registerTask('watch_css', ['compass', 'shell']);
  grunt.registerTask('watch_html', ['shell']);
  grunt.registerTask('default', ['watch']);
};
