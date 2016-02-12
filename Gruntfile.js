module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    babel:{
      options: {
        "presets": ["es2015"],
        "plugins": ["syntax-async-functions","transform-regenerator"]
      },
      dist: {
        files: [{
          expand: true,
          cwd: "src/",
          src: ["**/*.js", "!**/libraries/**"],
          dest: "www/"
        }]
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: "src/",
          src: ["**", "!**/*.js", "**/libraries/**"],
          dest: 'www/'
        }],
      },
    },
    watch: {
      scripts: {
        files:["src/**"],
        tasks:["babel", "copy"]
      }
    }
  });
  grunt.registerTask("transpile", "babel");
  grunt.registerTask("default", ["babel", "copy", "watch"]);
}
