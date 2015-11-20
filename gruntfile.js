var deploy = require('./config/deploy');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        seperator: ';'
      },
      dist: {
        src: [
         'vendor/jquery/dist/jquery.js',
         'vendor/fastclick/lib/fastclick.js',
         'assets/scripts/main.js',
        ],
        dest: 'assets/scripts/build/site.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'assets/scripts/build/site.js': ['<%= concat.dist.dest %>']
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
        files: ['*.html', '**/*.html', '**/**/*.html'],
        tasks: ['watch-html']
      },
      scripts: {
        files: ['assets/scripts/*.js'],
        tasks: ['watch-scripts']
      },
      css: {
        files: [
          'assets/sass/*',
        ],
        tasks: ['watch-css']
      }
    },
    shell: {
      options: {
        stderr: true
      },
      jekyll_build: {
        command: 'jekyll build',
        options: {
          stdout: true
        }
      },
      compass_compile: {
        command: 'compass compile',
        options: {
          stdout: true
        }
      },
      deploy: {
        command: deploy
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },
    jekyll: {
      serve: {
        options: {
          src : '<%= app %>',
          serve: true,
          watch: true,
          config: '_config.yml'
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
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('watch-scripts', ['concat', 'uglify', 'shell:jekyll_build']);
  grunt.registerTask('watch-styles', ['shell:compass_compile', 'shell:jekyll_build']);
  grunt.registerTask('watch-html', ['shell:jekyll_build']);
  grunt.registerTask('compile-styles', ['compass']);
  grunt.registerTask('compile-scripts', ['concat', 'uglify']);
  grunt.registerTask('jekyll-build', ['shell:jekyll_build']);
  grunt.registerTask('jekyll-serve', ['jekyll:serve']);
  grunt.registerTask('default', ['watch:css', 'watch:scripts']);
  grunt.registerTask('deploy', 'shell:deploy');
};
