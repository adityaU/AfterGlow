/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    sourcemaps: {
      enabled: false
    },

    // Add options here
    ace: {
      themes: ['chrome', 'dracula'],
      modes: ['pgsql', 'mysql', 'sql', 'JSON'],
      workers: ['pgsql', 'mysql', 'sql', 'JSON'],
      exts: ['language_tools', 'beautify', 'text', 'sql', 'JSON'],
      basePath: '/ace/'

    },

    'ember-bootstrap': {
      'bootstrapVersion': 4,
      'importBootstrapFont': false,
      'importBootstrapCSS': false
    },

  });
  app.import('./bower_components/lodash/dist/lodash.min.js');
  app.import('./bower_components/ace-builds/src-noconflict/theme-dracula.js');
  app.import('./bower_components/ace-builds/src-noconflict/mode-sql.js');
  app.import('./bower_components/ace-builds/src-noconflict/snippets/sql.js', {
    type: 'vendor'
  });
  app.import('./bower_components/lodash/dist/lodash.js', {
    type: 'vendor',
    prepend: true,

  });
  app.import('./bower_components/jquery-ui/themes/smoothness/jquery-ui.min.css', {
    type: 'vendor',
    prepend: true,

  });
  app.import('./bower_components/jquery-ui/jquery-ui.min.js');
  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
