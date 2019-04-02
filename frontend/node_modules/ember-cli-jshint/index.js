'use strict';

module.exports = {
  name: 'ember-cli-jshint',

  /**
   * instructs older versions of `ember-cli-qunit` and ember-cli-mocha to
   * disable their lintTree implementations
   */
  isDefaultJSLinter: true,

  buildConsole: function() {
    var ui = this.ui;

    if (!ui) {
      this.console = console;
      return;
    }

    this.console = {
      log: function(data) {
        ui.writeLine(data);
      },

      error: function(data) {
        ui.writeLine(data, 'ERROR');
      }
    };
  },

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    this.buildConsole();
  },

  included: function included(app, parentAddon) {
    this._super.included.call(this, app, parentAddon);
    this.jshintrc = app.options.jshintrc;
  },

  lintTree: function(type, tree) {
    var project = this.project;

    return require('broccoli-jshint')(tree, {
      jshintrcPath: this.jshintrc[type],
      targetExtension: 'jshint.lint-test.js',
      description: 'JSHint ' +  type,
      console: this.console,
      testGenerator: function(relativePath, passed, errors) {
        if (errors) {
          errors = "\\n" + this.escapeErrorString(errors);
        } else {
          errors = "";
        }

        return project.generateTestFile('JSHint | ' + relativePath, [{
          name: 'should pass jshint',
          passed: !!passed,
          errorMessage: relativePath + ' should pass jshint.' + errors
        }]);
      }
    });
  }
};
