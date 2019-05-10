'use strict';

define('frontend/tests/abilities/dashboard.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | abilities/dashboard.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'abilities/dashboard.js should pass jshint.\nabilities/dashboard.js: line 4, col 21, \'Ember\' is not defined.\nabilities/dashboard.js: line 5, col 16, \'Ember\' is not defined.\nabilities/dashboard.js: line 8, col 14, \'Ember\' is not defined.\nabilities/dashboard.js: line 11, col 14, \'Ember\' is not defined.\nabilities/dashboard.js: line 14, col 16, \'Ember\' is not defined.\n\n5 errors');
  });
});
define('frontend/tests/abilities/question.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | abilities/question.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'abilities/question.js should pass jshint.');
  });
});
define('frontend/tests/abilities/settings.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | abilities/settings.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'abilities/settings.js should pass jshint.');
  });
});
define('frontend/tests/app.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('frontend/tests/breakpoints.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | breakpoints.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'breakpoints.js should pass jshint.');
  });
});
define('frontend/tests/components/ember-ace', ['exports', 'ember-cli-page-object', 'frontend/tests/components/ember-ace/line', 'frontend/tests/components/ember-ace/marker', 'frontend/tests/components/ember-ace/annotation'], function (exports, _emberCliPageObject, _frontendTestsComponentsEmberAceLine, _frontendTestsComponentsEmberAceMarker, _frontendTestsComponentsEmberAceAnnotation) {
  exports['default'] = {
    /**
     * The current text value of the entire contents of the editor, with any
     * leading or trailing whitespace removed.
     */
    value: {
      isDescriptor: true,
      get: function get() {
        // Can't use ECPO's text() macro because it squashes newlines, even with normalize: false
        var contentElement = (0, _emberCliPageObject.findElementWithAssert)(this, '.ace_text-layer')[0];
        return contentElement.innerText.trim();
      }
    },

    /**
     * Update the current value of this editor.
     */
    setValue: function setValue(value) {
      var textarea = (0, _emberCliPageObject.findElementWithAssert)(this, 'pre')[0];
      textarea.env.editor.setValue(value);
      textarea.env.editor.renderer.updateFull(true);
    },

    /**
     * A collection of lines making up the editor contents.
     */
    lines: (0, _emberCliPageObject.collection)({
      itemScope: '.ace_line',
      item: _frontendTestsComponentsEmberAceLine['default']
    }),

    /**
     * A collection of line gutter annotations.
     */
    annotations: (0, _emberCliPageObject.collection)({
      itemScope: '.ace_gutter-cell:not([class$=" "])',
      item: _frontendTestsComponentsEmberAceAnnotation['default']
    }),

    /**
     * A collection of markers overlaying text.
     */
    frontMarkers: (0, _emberCliPageObject.collection)({
      scope: '.ace_layer:nth-child(4)',
      itemScope: '.ace_start',
      item: _frontendTestsComponentsEmberAceMarker['default']
    }),

    /**
     * A collection of markers underlaying text.
     */
    backMarkers: (0, _emberCliPageObject.collection)({
      scope: '.ace_layer:nth-child(2)',
      itemScope: '.ace_start:not(.ace_selection)',
      item: _frontendTestsComponentsEmberAceMarker['default']
    })
  };
});
define('frontend/tests/components/ember-ace/annotation', ['exports', 'ember', 'ember-cli-page-object'], function (exports, _ember, _emberCliPageObject) {
  exports['default'] = {
    /**
     * The type of annotation this is, typically one of 'info', 'warning', or 'error'.
     */
    type: {
      isDescriptor: true,
      get: function get() {
        var classes = (0, _emberCliPageObject.findElementWithAssert)(this).attr('class').split(/\s+/);
        return classes[classes.length - 1].replace(/^ace_/, '');
      }
    },

    /**
     * The 0-indexed row number of this annotation.
     */
    row: {
      isDescriptor: true,
      get: function get() {
        var el = (0, _emberCliPageObject.findElementWithAssert)(this)[0];
        return [].slice.call(el.parentElement.children).indexOf(el);
      }
    }
  };
});
define('frontend/tests/components/ember-ace/line', ['exports', 'ember-cli-page-object', 'frontend/tests/components/ember-ace/token'], function (exports, _emberCliPageObject, _frontendTestsComponentsEmberAceToken) {
  exports['default'] = {
    /**
     * The text value of this entire line.
     */
    text: (0, _emberCliPageObject.text)(null, { normalize: false }),

    /**
     * A collection of tokens from which this line is composed.
     */
    tokens: (0, _emberCliPageObject.collection)({
      itemScope: '>',
      item: _frontendTestsComponentsEmberAceToken['default']
    })
  };
});
define('frontend/tests/components/ember-ace/marker', ['exports', 'ember-cli-page-object'], function (exports, _emberCliPageObject) {
  exports['default'] = {
    /**
     * The type of marker this is, as designated by the specified `class` for the marker.
     */
    type: {
      isDescriptor: true,
      get: function get() {
        return (0, _emberCliPageObject.findElementWithAssert)(this).attr('class').split(/\s+/)[0];
      }
    },

    /**
     * The number of segments this marker is composed from. Typically a marker will have
     * one segment per document line that it spans.
     */
    segmentCount: {
      isDescriptor: true,
      get: function get() {
        var type = this.type;
        var sibling = (0, _emberCliPageObject.findElementWithAssert)(this)[0];
        var count = 1;

        while (sibling = sibling.nextElementSibling) {
          if (!sibling.classList.contains(type) || sibling.classList.contains('ace_start')) {
            break;
          }
          count++;
        }

        return count;
      }
    }
  };
});
define('frontend/tests/components/ember-ace/token', ['exports', 'ember-cli-page-object'], function (exports, _emberCliPageObject) {
  exports['default'] = {
    /**
     * The text value of this token
     */
    text: (0, _emberCliPageObject.text)(null, { normalize: false }),

    /**
     * The type of this token, as specified by the Ace tokenizer,
     * e.g. `variable` or `punctuation.operator`.
     *
     * See https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#common-tokens
     */
    type: {
      isDescriptor: true,
      get: function get() {
        var $el = (0, _emberCliPageObject.findElementWithAssert)(this);
        var classes = $el.attr('class').split(/\s+/);
        return classes.map(function (cls) {
          return cls.replace(/^ace_/, '');
        }).join('.');
      }
    }
  };
});
define('frontend/tests/helpers/capitalize.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/capitalize.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/capitalize.js should pass jshint.');
  });
});
define('frontend/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('frontend/tests/helpers/destroy-app.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/destroy-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('frontend/tests/helpers/ember-cli-clipboard', ['exports', '@ember/runloop', 'ember-test'], function (exports, _emberRunloop, _emberTest) {
  exports.triggerSuccess = triggerSuccess;
  exports.triggerError = triggerError;

  /* === Integration Test Helpers === */

  /**
   * Fires `success` action for an instance of a copy-button component
   * @function triggerSuccess
   * @param {Object} context - integration test’s this context
   * @param {String|Element} selector - selector of the copy-button instance
   * @returns {Void}
   */

  function triggerSuccess(context, selector) {
    fireComponentAction(context, selector, 'success');
  }

  /**
   * Fires `error` action for an instance of a copy-button component
   * @function triggerError
   * @param {Object} context - integration test’s this context
   * @param {String|Element} selector - selector of the copy-button instance
   * @returns {Void}
   */

  function triggerError(context, selector) {
    fireComponentAction(context, selector, 'error');
  }

  /* === Acceptance Test Helpers === */

  /**
   * Default export is a function that registers acceptance test helpers
   */

  exports['default'] = function () {
    _emberTest['default'].registerAsyncHelper('triggerCopySuccess', function (app) {
      var selector = arguments.length <= 1 || arguments[1] === undefined ? '.copy-btn' : arguments[1];

      fireComponentActionFromApp(app, selector, 'success');
    });

    _emberTest['default'].registerAsyncHelper('triggerCopyError', function (app) {
      var selector = arguments.length <= 1 || arguments[1] === undefined ? '.copy-btn' : arguments[1];

      fireComponentActionFromApp(app, selector, 'error');
    });
  };

  /* === Private Functions === */

  /**
   * Fires named action for an instance of a copy-button component in an app
   * @function fireComponentActionFromApp
   * @param {Object} app - Ember application
   * @param {String|Element} selector - selector of the copy-button instance
   * @param {String} actionName - name of action
   * @returns {Void}
   */
  function fireComponentActionFromApp(app, selector, actionName) {
    fireComponentAction({
      container: app.__container__,
      $: app.$
    }, selector, actionName);
  }

  /**
   * Fires named action for an instance of a copy-button component
   * @function fireComponentAction
   * @param {Object} context - test context
   * @param {String|Element} selector - selector of the copy-button instance
   * @param {String} actionName - name of action
   * @returns {Void}
   */
  function fireComponentAction(context, selector, actionName) {
    var component = getComponentBySelector(context, selector);
    fireActionByName(component, actionName);
  }

  /**
   * Fetches component reference for a given context and selector
   * @function getComponentBySelector
   * @param {Object} context - test context
   * @param {String|Element} selector - selector of the copy-button instance
   * @returns {Object} component object
   */
  function getComponentBySelector(context) {
    var selector = arguments.length <= 1 || arguments[1] === undefined ? '.copy-btn' : arguments[1];

    var emberId = context.$(selector).attr('id');
    return context.container.lookup('-view-registry:main')[emberId];
  }

  /**
   * Fires a component's action given an action name
   * @function fireActionByName
   * @param {Ember.Component} component - component to fire action from
   * @param {String} actionName - name of action
   * @returns {Void}
   */
  function fireActionByName(component, actionName) {
    var action = component[actionName];

    (0, _emberRunloop.run)(function () {
      if (typeof action === 'string') {
        component.sendAction(action);
      } else {
        action();
      }
    });
  }
});
define('frontend/tests/helpers/exists-in.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/exists-in.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/exists-in.js should pass jshint.');
  });
});
define('frontend/tests/helpers/format-object.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/format-object.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/format-object.js should pass jshint.\nhelpers/format-object.js: line 11, col 46, Expected \'===\' and instead saw \'==\'.\nhelpers/format-object.js: line 11, col 66, Expected \'===\' and instead saw \'==\'.\nhelpers/format-object.js: line 15, col 23, Expected \'===\' and instead saw \'==\'.\nhelpers/format-object.js: line 17, col 30, Expected \'===\' and instead saw \'==\'.\nhelpers/format-object.js: line 19, col 37, Expected \'===\' and instead saw \'==\'.\nhelpers/format-object.js: line 28, col 31, Expected \'!==\' and instead saw \'!=\'.\nhelpers/format-object.js: line 29, col 20, \'moment\' is not defined.\nhelpers/format-object.js: line 30, col 20, \'moment\' is not defined.\nhelpers/format-object.js: line 30, col 36, \'moment\' is not defined.\n\n9 errors');
  });
});
define('frontend/tests/helpers/get-chart-icon.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/get-chart-icon.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/get-chart-icon.js should pass jshint.');
  });
});
define('frontend/tests/helpers/get-column-id.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/get-column-id.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/get-column-id.js should pass jshint.\nhelpers/get-column-id.js: line 3, col 45, Expected \'===\' and instead saw \'==\'.\n\n1 error');
  });
});
define('frontend/tests/helpers/group-by.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/group-by.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/group-by.js should pass jshint.\nhelpers/group-by.js: line 7, col 40, \'property\' is defined but never used.\nhelpers/group-by.js: line 7, col 26, \'dependentKey\' is defined but never used.\nhelpers/group-by.js: line 10, col 36, \'groupBy\' is not defined.\nhelpers/group-by.js: line 3, col 5, \'get\' is defined but never used.\nhelpers/group-by.js: line 4, col 5, \'arrayComputed\' is defined but never used.\n\n5 errors');
  });
});
define('frontend/tests/helpers/localize.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/localize.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/localize.js should pass jshint.\nhelpers/localize.js: line 5, col 45, Missing semicolon.\n\n1 error');
  });
});
define('frontend/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'frontend/tests/helpers/start-app', 'frontend/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _frontendTestsHelpersStartApp, _frontendTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _frontendTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _frontendTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('frontend/tests/helpers/module-for-acceptance.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/module-for-acceptance.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('frontend/tests/helpers/momentize.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/momentize.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/momentize.js should pass jshint.\nhelpers/momentize.js: line 5, col 43, Missing semicolon.\nhelpers/momentize.js: line 5, col 16, \'moment\' is not defined.\n\n2 errors');
  });
});
define('frontend/tests/helpers/question-dashboard-settings.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/question-dashboard-settings.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'helpers/question-dashboard-settings.js should pass jshint.\nhelpers/question-dashboard-settings.js: line 4, col 30, Missing semicolon.\nhelpers/question-dashboard-settings.js: line 5, col 29, Missing semicolon.\nhelpers/question-dashboard-settings.js: line 6, col 32, Missing semicolon.\nhelpers/question-dashboard-settings.js: line 7, col 83, Missing semicolon.\nhelpers/question-dashboard-settings.js: line 8, col 137, Missing semicolon.\n\n5 errors');
  });
});
define('frontend/tests/helpers/resolver', ['exports', 'frontend/resolver', 'frontend/config/environment'], function (exports, _frontendResolver, _frontendConfigEnvironment) {

  var resolver = _frontendResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _frontendConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _frontendConfigEnvironment['default'].podModulePrefix
  };

  resolver.pluralizedTypes.ability = 'abilities';

  exports['default'] = resolver;
});
define('frontend/tests/helpers/resolver.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('frontend/tests/helpers/responsive', ['exports', 'ember', 'ember-responsive/media'], function (exports, _ember, _emberResponsiveMedia) {
  exports.setBreakpointForIntegrationTest = setBreakpointForIntegrationTest;
  var getOwner = _ember['default'].getOwner;
  var classify = _ember['default'].String.classify;

  _emberResponsiveMedia['default'].reopen({
    // Change this if you want a different default breakpoint in tests.
    _defaultBreakpoint: 'desktop',

    _breakpointArr: _ember['default'].computed('breakpoints', function () {
      return Object.keys(this.get('breakpoints')) || _ember['default'].A([]);
    }),

    _forceSetBreakpoint: function _forceSetBreakpoint(breakpoint) {
      var found = false;

      var props = {};
      this.get('_breakpointArr').forEach(function (bp) {
        var val = bp === breakpoint;
        if (val) {
          found = true;
        }

        props['is' + classify(bp)] = val;
      });

      if (found) {
        this.setProperties(props);
      } else {
        throw new Error('You tried to set the breakpoint to ' + breakpoint + ', which is not in your app/breakpoint.js file.');
      }
    },

    match: function match() {}, // do not set up listeners in test

    init: function init() {
      this._super.apply(this, arguments);

      this._forceSetBreakpoint(this.get('_defaultBreakpoint'));
    }
  });

  exports['default'] = _ember['default'].Test.registerAsyncHelper('setBreakpoint', function (app, breakpoint) {
    // this should use getOwner once that's supported
    var mediaService = app.__deprecatedInstance__.lookup('service:media');
    mediaService._forceSetBreakpoint(breakpoint);
  });

  function setBreakpointForIntegrationTest(container, breakpoint) {
    var mediaService = getOwner(container).lookup('service:media');
    mediaService._forceSetBreakpoint(breakpoint);
    container.set('media', mediaService);

    return mediaService;
  }
});
define('frontend/tests/helpers/responsive.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/responsive.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/responsive.js should pass jshint.');
  });
});
define('frontend/tests/helpers/snapshot-time.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/snapshot-time.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/snapshot-time.js should pass jshint.');
  });
});
define('frontend/tests/helpers/start-app', ['exports', 'ember', 'frontend/app', 'frontend/config/environment'], function (exports, _ember, _frontendApp, _frontendConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _frontendConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _frontendApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('frontend/tests/helpers/start-app.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | helpers/start-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('frontend/tests/initializers/inject-store.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | initializers/inject-store.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/inject-store.js should pass jshint.');
  });
});
define('frontend/tests/initializers/responsive.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | initializers/responsive.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/responsive.js should pass jshint.');
  });
});
define('frontend/tests/integration/helpers/exists-in-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('exists-in', 'helper:exists-in', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      'id': 'MsM8QLBG',
      'block': '{"symbols":[],"statements":[[1,[25,"exists-in",[[20,["inputValue"]]],null],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('frontend/tests/integration/helpers/exists-in-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/helpers/exists-in-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/exists-in-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/helpers/get-column-id-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('get-column-id', 'helper:get-column-id', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      'id': 'LhqNBxR2',
      'block': '{"symbols":[],"statements":[[1,[25,"get-column-id",[[20,["inputValue"]]],null],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('frontend/tests/integration/helpers/get-column-id-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/helpers/get-column-id-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/get-column-id-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/accordion-multiselect/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('accordion-multiselect', 'Integration | Component | accordion multiselect', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'wIdXSYKe',
      'block': '{"symbols":[],"statements":[[1,[18,"accordion-multiselect"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '7XFCcFgI',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"accordion-multiselect",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/accordion-multiselect/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/accordion-multiselect/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/accordion-multiselect/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/add-tag/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('add-tag', 'Integration | Component | add tag', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'HOfhQCo6',
      'block': '{"symbols":[],"statements":[[1,[18,"add-tag"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'HCd2WEmp',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"add-tag",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/add-tag/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/add-tag/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/add-tag/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/add-to-dashboard/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('add-to-dashboard', 'Integration | Component | add to dashboard', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'qAgT4uzC',
      'block': '{"symbols":[],"statements":[[1,[18,"add-to-dashboard"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'dkS/ly/l',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"add-to-dashboard",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/add-to-dashboard/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/add-to-dashboard/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/add-to-dashboard/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/additional-filters/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('additional-filters', 'Integration | Component | additional filters', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'EUne33EN',
      'block': '{"symbols":[],"statements":[[1,[18,"additional-filters"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'O1xh/SU1',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"additional-filters",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/additional-filters/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/additional-filters/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/additional-filters/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/alert-expression/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('alert-expression', 'Integration | Component | alert expression', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'VGKxLmip',
      'block': '{"symbols":[],"statements":[[1,[18,"alert-expression"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'muif8nMT',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"alert-expression",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/alert-expression/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/alert-expression/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/alert-expression/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/api-action-modal/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('api-action-modal', 'Integration | Component | api action modal', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '9G6Ze/5+',
      'block': '{"symbols":[],"statements":[[1,[18,"api-action-modal"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'zxi1DpFV',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"api-action-modal",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/api-action-modal/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/api-action-modal/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/api-action-modal/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/api-action-result/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('api-action-result', 'Integration | Component | api action result', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'iQHDejZM',
      'block': '{"symbols":[],"statements":[[1,[18,"api-action-result"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'x17APenB',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"api-action-result",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/api-action-result/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/api-action-result/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/api-action-result/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/app-logo/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('app-logo', 'Integration | Component | app logo', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'tKHZ03DA',
      'block': '{"symbols":[],"statements":[[1,[18,"app-logo"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'LM+NFOfT',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"app-logo",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/app-logo/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/app-logo/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/app-logo/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/bar-chart-settings/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('bar-chart-settings', 'Integration | Component | bar chart settings', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'hWmyQNUQ',
      'block': '{"symbols":[],"statements":[[1,[18,"bar-chart-settings"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'bh3lBuKP',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"bar-chart-settings",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/bar-chart-settings/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/bar-chart-settings/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/bar-chart-settings/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/bar-chart/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('bar-chart', 'Integration | Component | bar chart', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'i32eDGFh',
      'block': '{"symbols":[],"statements":[[1,[18,"bar-chart"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'YG7q+mJX',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"bar-chart",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/bar-chart/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/bar-chart/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/bar-chart/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/base-chart-settings/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('base-chart-settings', 'Integration | Component | base chart settings', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'UImQT8O5',
      'block': '{"symbols":[],"statements":[[1,[18,"base-chart-settings"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'IObzHE4f',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"base-chart-settings",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/base-chart-settings/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/base-chart-settings/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/base-chart-settings/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/base-header/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('base-header', 'Integration | Component | base header', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'dKSOTxjY',
      'block': '{"symbols":[],"statements":[[1,[18,"base-header"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'HDNCTAqG',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"base-header",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/base-header/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/base-header/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/base-header/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/calendar-chart-settings/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('calendar-chart-settings', 'Integration | Component | calendar chart settings', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '8/29CGwd',
      'block': '{"symbols":[],"statements":[[1,[18,"calendar-chart-settings"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '4k2tkAcy',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"calendar-chart-settings",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/calendar-chart-settings/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/calendar-chart-settings/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/calendar-chart-settings/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/calendar-chart/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('calendar-chart', 'Integration | Component | calendar chart', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'PbsYuQ6X',
      'block': '{"symbols":[],"statements":[[1,[18,"calendar-chart"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'IAlLpZcR',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"calendar-chart",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/calendar-chart/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/calendar-chart/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/calendar-chart/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/change-user-permissions-dialogue/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('change-user-permissions-dialogue', 'Integration | Component | change user permissions dialogue', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'Q7r/muaO',
      'block': '{"symbols":[],"statements":[[1,[18,"change-user-permissions-dialogue"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '3IZPKGsS',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"change-user-permissions-dialogue",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/change-user-permissions-dialogue/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/change-user-permissions-dialogue/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/change-user-permissions-dialogue/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/circular-checkbox/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('circular-checkbox', 'Integration | Component | circular checkbox', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'UUxKe1im',
      'block': '{"symbols":[],"statements":[[1,[18,"circular-checkbox"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'D+K9cViJ',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"circular-checkbox",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/circular-checkbox/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/circular-checkbox/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/circular-checkbox/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/create-dashboard-variable/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('create-dashboard-variable', 'Integration | Component | create dashboard variable', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'S9JRm+OT',
      'block': '{"symbols":[],"statements":[[1,[18,"create-dashboard-variable"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'fHCizi4h',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"create-dashboard-variable",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/create-dashboard-variable/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/create-dashboard-variable/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/create-dashboard-variable/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/create-dashboard/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('create-dashboard', 'Integration | Component | create dashboard', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '/KhCt/ch',
      'block': '{"symbols":[],"statements":[[1,[18,"create-dashboard"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '77JTuzjA',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"create-dashboard",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/create-dashboard/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/create-dashboard/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/create-dashboard/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/create-tag/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('create-tag', 'Integration | Component | create tag', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '0EJcyXKe',
      'block': '{"symbols":[],"statements":[[1,[18,"create-tag"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'uvt6qRYa',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"create-tag",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/create-tag/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/create-tag/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/create-tag/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/create-variable/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('create-variable', 'Integration | Component | create variable', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'pcq2uyKR',
      'block': '{"symbols":[],"statements":[[1,[18,"create-variable"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'JTS6+BcG',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"create-variable",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/create-variable/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/create-variable/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/create-variable/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/dashboard-grid/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('dashboard-grid', 'Integration | Component | dashboard grid', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'ggakChM+',
      'block': '{"symbols":[],"statements":[[1,[18,"dashboard-grid"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'zOAiPRAC',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"dashboard-grid",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/dashboard-grid/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/dashboard-grid/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/dashboard-grid/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/dashboard-note-card/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('dashboard-note-card', 'Integration | Component | dashboard note card', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'ws8MVMzB',
      'block': '{"symbols":[],"statements":[[1,[18,"dashboard-note-card"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'fwxsu0q6',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"dashboard-note-card",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/dashboard-note-card/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/dashboard-note-card/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/dashboard-note-card/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/dashboard-select-variables/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('dashboard-select-variables', 'Integration | Component | dashboard select variables', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'WwcS6RTe',
      'block': '{"symbols":[],"statements":[[1,[18,"dashboard-select-variables"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'ZbwRPook',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"dashboard-select-variables",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/dashboard-select-variables/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/dashboard-select-variables/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/dashboard-select-variables/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/dashboard-selector/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('dashboard-selector', 'Integration | Component | dashboard selector', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'BTttTuHP',
      'block': '{"symbols":[],"statements":[[1,[18,"dashboard-selector"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'yC3Avkn+',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"dashboard-selector",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/dashboard-selector/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/dashboard-selector/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/dashboard-selector/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/data-charts/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('data-charts', 'Integration | Component | data charts', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'h6/UsU29',
      'block': '{"symbols":[],"statements":[[1,[18,"data-charts"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'kGujpRxz',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"data-charts",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/data-charts/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/data-charts/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/data-charts/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/database-selector/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('database-selector', 'Integration | Component | database selector', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'IRIFEOZF',
      'block': '{"symbols":[],"statements":[[1,[18,"database-selector"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'cEM+NUpr',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"database-selector",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/database-selector/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/database-selector/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/database-selector/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/db-tree/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('db-tree', 'Integration | Component | db tree', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'S9VbXEsr',
      'block': '{"symbols":[],"statements":[[1,[18,"db-tree"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'uG35qdmH',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"db-tree",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/db-tree/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/db-tree/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/db-tree/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/delete-dialogue/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('delete-dialogue', 'Integration | Component | delete dialogue', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '4BXT5Vg4',
      'block': '{"symbols":[],"statements":[[1,[18,"delete-dialogue"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'd40G242P',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"delete-dialogue",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/delete-dialogue/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/delete-dialogue/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/delete-dialogue/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/dropdown-default/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('dropdown-default', 'Integration | Component | dropdown default', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '41cI9jPT',
      'block': '{"symbols":[],"statements":[[1,[18,"dropdown-default"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '8/HZaAgr',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"dropdown-default",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/dropdown-default/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/dropdown-default/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/dropdown-default/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/filter-maker/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('filter-maker', 'Integration | Component | filter maker', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'tRGd29JQ',
      'block': '{"symbols":[],"statements":[[1,[18,"filter-maker"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'y02P1WtE',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"filter-maker",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/filter-maker/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/filter-maker/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/filter-maker/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/filter-value-selector/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('filter-value-selector', 'Integration | Component | filter value selector', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '/pnnSCro',
      'block': '{"symbols":[],"statements":[[1,[18,"filter-value-selector"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'cGHBdIad',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"filter-value-selector",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/filter-value-selector/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/filter-value-selector/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/filter-value-selector/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/group-by-maker/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('group-by-maker', 'Integration | Component | group by maker', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '2YNN56eu',
      'block': '{"symbols":[],"statements":[[1,[18,"group-by-maker"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'itk1MbiD',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"group-by-maker",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/group-by-maker/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/group-by-maker/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/group-by-maker/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/key-value-maker/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('key-value-maker', 'Integration | Component | key value maker', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'VXaL9hkw',
      'block': '{"symbols":[],"statements":[[1,[18,"key-value-maker"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'YfPciUww',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"key-value-maker",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/key-value-maker/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/key-value-maker/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/key-value-maker/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/keyboard-shortcuts-help/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('keyboard-shortcuts-help', 'Integration | Component | keyboard shortcuts help', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'KzfUo+cD',
      'block': '{"symbols":[],"statements":[[1,[18,"keyboard-shortcuts-help"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'ZqEAMWwe',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"keyboard-shortcuts-help",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/keyboard-shortcuts-help/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/keyboard-shortcuts-help/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/keyboard-shortcuts-help/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/limited-query-accordian/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('limited-query-accordian', 'Integration | Component | limited query accordian', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '3tkHCiJP',
      'block': '{"symbols":[],"statements":[[1,[18,"limited-query-accordian"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '3WTe0roC',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"limited-query-accordian",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/limited-query-accordian/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/limited-query-accordian/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/limited-query-accordian/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/line-chart-settings/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('line-chart-settings', 'Integration | Component | line chart settings', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'LetAtYnJ',
      'block': '{"symbols":[],"statements":[[1,[18,"line-chart-settings"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'mlCRDZaU',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"line-chart-settings",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/line-chart-settings/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/line-chart-settings/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/line-chart-settings/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/line-chart/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('line-chart', 'Integration | Component | line chart', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'hFNPrxtw',
      'block': '{"symbols":[],"statements":[[1,[18,"line-chart"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'KraVeYdN',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"line-chart",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/line-chart/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/line-chart/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/line-chart/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/next-transition-warning/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('next-transition-warning', 'Integration | Component | next transition warning', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'ovhgUtHQ',
      'block': '{"symbols":[],"statements":[[1,[18,"next-transition-warning"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'J0kwW8ak',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"next-transition-warning",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/next-transition-warning/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/next-transition-warning/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/next-transition-warning/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/number-chart-settings/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('number-chart-settings', 'Integration | Component | number chart settings', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '9iLCWIeY',
      'block': '{"symbols":[],"statements":[[1,[18,"number-chart-settings"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'cXROgBqp',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"number-chart-settings",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/number-chart-settings/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/number-chart-settings/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/number-chart-settings/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/number-chart/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('number-chart', 'Integration | Component | number chart', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'UClrT51t',
      'block': '{"symbols":[],"statements":[[1,[18,"number-chart"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '55dx4kzd',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"number-chart",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/number-chart/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/number-chart/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/number-chart/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/order-by-maker/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('order-by-maker', 'Integration | Component | order by maker', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'ox0qa5fX',
      'block': '{"symbols":[],"statements":[[1,[18,"order-by-maker"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'bhxgcNo5',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"order-by-maker",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/order-by-maker/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/order-by-maker/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/order-by-maker/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/pivot-table/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('pivot-table', 'Integration | Component | pivot table', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'GeRLaC3r',
      'block': '{"symbols":[],"statements":[[1,[18,"pivot-table"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'm4SeBfXW',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"pivot-table",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/pivot-table/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/pivot-table/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/pivot-table/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/query-builder/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('query-builder', 'Integration | Component | query builder', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'PsesoZST',
      'block': '{"symbols":[],"statements":[[1,[18,"query-builder"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'CbQI1l5R',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"query-builder",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/query-builder/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/query-builder/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/query-builder/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/question-options/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('question-options', 'Integration | Component | question options', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '31QWt0ac',
      'block': '{"symbols":[],"statements":[[1,[18,"question-options"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'P3S5+uV0',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"question-options",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/question-options/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/question-options/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/question-options/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/question-selector/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('question-selector', 'Integration | Component | question selector', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '3Q/I8TcG',
      'block': '{"symbols":[],"statements":[[1,[18,"question-selector"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'hSQCFeVk',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"question-selector",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/question-selector/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/question-selector/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/question-selector/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/question-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('question-widget', 'Integration | Component | question widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'rtfQJFpM',
      'block': '{"symbols":[],"statements":[[1,[18,"question-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '2JhlymhO',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"question-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/question-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/question-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/question-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/questions-list/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('questions-list', 'Integration | Component | questions list', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'BuzqJtmG',
      'block': '{"symbols":[],"statements":[[1,[18,"questions-list"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'xm0NWIwQ',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"questions-list",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/questions-list/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/questions-list/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/questions-list/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/results-table-settings/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('results-table-settings', 'Integration | Component | results table settings', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '9KaEls2A',
      'block': '{"symbols":[],"statements":[[1,[18,"results-table-settings"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'S9/PZIfg',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"results-table-settings",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/results-table-settings/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/results-table-settings/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/results-table-settings/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/results-table/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('results-table', 'Integration | Component | results table', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'kDwdyP5g',
      'block': '{"symbols":[],"statements":[[1,[18,"results-table"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'Wd1oVm2U',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"results-table",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/results-table/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/results-table/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/results-table/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/share-entity/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('share-entity', 'Integration | Component | share entity', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '/Zr9Q0yw',
      'block': '{"symbols":[],"statements":[[1,[18,"share-entity"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'B6O0WeqL',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"share-entity",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/share-entity/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/share-entity/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/share-entity/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/snapshot-creator/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('snapshot-creator', 'Integration | Component | snapshot creator', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'vQQXby7i',
      'block': '{"symbols":[],"statements":[[1,[18,"snapshot-creator"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'AytaTUQs',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"snapshot-creator",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/snapshot-creator/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/snapshot-creator/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/snapshot-creator/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/snapshot-stop-confirmation/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('snapshot-stop-confirmation', 'Integration | Component | snapshot stop confirmation', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'saKd6flC',
      'block': '{"symbols":[],"statements":[[1,[18,"snapshot-stop-confirmation"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '9A5IQ16M',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"snapshot-stop-confirmation",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/snapshot-stop-confirmation/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/snapshot-stop-confirmation/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/snapshot-stop-confirmation/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/snapshots-list/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('snapshots-list', 'Integration | Component | snapshots list', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'kxtQTJzW',
      'block': '{"symbols":[],"statements":[[1,[18,"snapshots-list"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'g30zwGd4',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"snapshots-list",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/snapshots-list/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/snapshots-list/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/snapshots-list/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/subquery-builder/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('subquery-builder', 'Integration | Component | subquery builder', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'vDBjIJaN',
      'block': '{"symbols":[],"statements":[[1,[18,"subquery-builder"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'RTciX8Z2',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"subquery-builder",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/subquery-builder/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/subquery-builder/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/subquery-builder/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/variable-value-selector/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('variable-value-selector', 'Integration | Component | variable value selector', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'mKHR7XWx',
      'block': '{"symbols":[],"statements":[[1,[18,"variable-value-selector"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'NP4FQYHR',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"variable-value-selector",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/variable-value-selector/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/variable-value-selector/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/variable-value-selector/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/variables-layer/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('variables-layer', 'Integration | Component | variables layer', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'hhXkzMg6',
      'block': '{"symbols":[],"statements":[[1,[18,"variables-layer"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'K8Ly7AZ6',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"variables-layer",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/variables-layer/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/variables-layer/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/variables-layer/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/variables-replaced-query-accordian/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('variables-replaced-query-accordian', 'Integration | Component | variables replaced query accordian', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'h4OFJ9z8',
      'block': '{"symbols":[],"statements":[[1,[18,"variables-replaced-query-accordian"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'Qq49d932',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"variables-replaced-query-accordian",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/variables-replaced-query-accordian/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/variables-replaced-query-accordian/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/variables-replaced-query-accordian/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/view-maker/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('view-maker', 'Integration | Component | view maker', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'Wi90Kpga',
      'block': '{"symbols":[],"statements":[[1,[18,"view-maker"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'K4D4rEWH',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"view-maker",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/view-maker/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/view-maker/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/view-maker/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widget-creator/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widget-creator', 'Integration | Component | widget creator', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'rJQliaaa',
      'block': '{"symbols":[],"statements":[[1,[18,"widget-creator"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '30OjPYU0',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widget-creator",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widget-creator/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widget-creator/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widget-creator/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/circular-progress-bar/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/circular-progress-bar', 'Integration | Component | widgets/demo/circular progress bar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'lu9pwil3',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/circular-progress-bar"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'ACySh490',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/circular-progress-bar",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/circular-progress-bar/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/circular-progress-bar/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/circular-progress-bar/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/direction-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/direction-widget', 'Integration | Component | widgets/demo/direction widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '9FHgYPyy',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/direction-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'vh5nrc9Q',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/direction-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/direction-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/direction-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/direction-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/icon-and-text/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/icon-and-text', 'Integration | Component | widgets/demo/icon and text', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'V2jPo+dl',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/icon-and-text"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'MSXoJAwj',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/icon-and-text",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/icon-and-text/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/icon-and-text/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/icon-and-text/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/prefix-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/prefix-widget', 'Integration | Component | widgets/demo/prefix widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'cKp9MCUj',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/prefix-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'Mi24V50c',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/prefix-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/prefix-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/prefix-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/prefix-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/progress-bar/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/progress-bar', 'Integration | Component | widgets/demo/progress bar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '9VcetaeL',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/progress-bar"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'KFolWco3',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/progress-bar",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/progress-bar/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/progress-bar/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/progress-bar/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/ratings-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/ratings-widget', 'Integration | Component | widgets/demo/ratings widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'bV2lBpSK',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/ratings-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'ZfIfuDiY',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/ratings-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/ratings-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/ratings-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/ratings-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/row-border/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/row-border', 'Integration | Component | widgets/demo/row border', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'QTgHnqgS',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/row-border"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'udZS4K+B',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/row-border",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/row-border/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/row-border/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/row-border/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/row-color/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/row-color', 'Integration | Component | widgets/demo/row color', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '1ALa5auI',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/row-color"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'UM/wos/I',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/row-color",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/row-color/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/row-color/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/row-color/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/suffix-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/suffix-widget', 'Integration | Component | widgets/demo/suffix widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'jwvYOA5a',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/suffix-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'HKr2VwIW',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/suffix-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/suffix-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/suffix-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/suffix-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/tag-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/demo/tag-widget', 'Integration | Component | widgets/demo/tag widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'Rovb5S2R',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/demo/tag-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'NvkBtuMy',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/demo/tag-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/demo/tag-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/demo/tag-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/demo/tag-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/circular-progress-bar/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/editable/circular-progress-bar', 'Integration | Component | widgets/editable/circular progress bar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'r9CLoGDt',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/editable/circular-progress-bar"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'KBsJ0n+R',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/editable/circular-progress-bar",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/circular-progress-bar/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/editable/circular-progress-bar/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/editable/circular-progress-bar/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/direction-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/editable/direction-widget', 'Integration | Component | widgets/editable/direction widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'UMnuMmgh',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/editable/direction-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '1aJCMvSD',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/editable/direction-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/direction-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/editable/direction-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/editable/direction-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/prefix-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/editable/prefix-widget', 'Integration | Component | widgets/editable/prefix widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '5QihMuOz',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/editable/prefix-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'vsaOxzQP',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/editable/prefix-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/prefix-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/editable/prefix-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/editable/prefix-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/progress-bar/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/editable/progress-bar', 'Integration | Component | widgets/editable/progress bar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'NOqpGtn3',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/editable/progress-bar"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'q9/gCcCC',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/editable/progress-bar",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/progress-bar/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/editable/progress-bar/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/editable/progress-bar/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/ratings-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/editable/ratings-widget', 'Integration | Component | widgets/editable/ratings widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'uOtGZ4GP',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/editable/ratings-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'hxNV19S4',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/editable/ratings-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/ratings-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/editable/ratings-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/editable/ratings-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/row-border/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/editable/row-border', 'Integration | Component | widgets/editable/row border', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'Dw1FEZfF',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/editable/row-border"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'tLKZ4oQu',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/editable/row-border",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/row-border/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/editable/row-border/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/editable/row-border/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/row-color/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/editable/row-color', 'Integration | Component | widgets/editable/row color', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'hYnTCXql',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/editable/row-color"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'xW8yR20G',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/editable/row-color",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/row-color/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/editable/row-color/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/editable/row-color/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/suffix-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/editable/suffix-widget', 'Integration | Component | widgets/editable/suffix widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'UDjDtO5x',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/editable/suffix-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'dCbBHuOd',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/editable/suffix-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/suffix-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/editable/suffix-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/editable/suffix-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/tag-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/editable/tag-widget', 'Integration | Component | widgets/editable/tag widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'dyj3EikQ',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/editable/tag-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'D5bJpQql',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/editable/tag-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/editable/tag-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/editable/tag-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/editable/tag-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/icon-and-text/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/icon-and-text', 'Integration | Component | widgets/icon and text', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'SewudpnB',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/icon-and-text"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '/TL4aBfm',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/icon-and-text",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/icon-and-text/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/icon-and-text/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/icon-and-text/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/render-widgets/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/render-widgets', 'Integration | Component | widgets/render widgets', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '1h6yDM4Q',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/render-widgets"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'GkJZ701G',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/render-widgets",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/render-widgets/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/render-widgets/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/render-widgets/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/circular-progress-bar/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/circular-progress-bar', 'Integration | Component | widgets/renderer/circular progress bar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'tZii/+L4',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/circular-progress-bar"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '2j7I8AsN',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/circular-progress-bar",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/circular-progress-bar/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/circular-progress-bar/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/circular-progress-bar/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/direction-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/direction-widget', 'Integration | Component | widgets/renderer/direction widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'lnde1gTW',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/direction-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'MbyebIw8',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/direction-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/direction-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/direction-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/direction-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/icon-and-text/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/icon-and-text', 'Integration | Component | widgets/renderer/icon and text', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'ZECeVdHJ',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/icon-and-text"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'ufn5+tHC',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/icon-and-text",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/icon-and-text/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/icon-and-text/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/icon-and-text/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/prefix-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/prefix-widget', 'Integration | Component | widgets/renderer/prefix widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'vG0y9VBC',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/prefix-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'KIcW71jt',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/prefix-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/prefix-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/prefix-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/prefix-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/progress-bar/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/progress-bar', 'Integration | Component | widgets/renderer/progress bar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'iN9jFJx8',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/progress-bar"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '0r62msMP',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/progress-bar",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/progress-bar/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/progress-bar/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/progress-bar/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/ratings-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/ratings-widget', 'Integration | Component | widgets/renderer/ratings widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'm50SKDhm',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/ratings-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'UhQzD/v/',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/ratings-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/ratings-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/ratings-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/ratings-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/row-border/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/row-border', 'Integration | Component | widgets/renderer/row border', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'P7SimYcl',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/row-border"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'D6iV+rTH',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/row-border",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/row-border/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/row-border/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/row-border/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/row-color/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/row-color', 'Integration | Component | widgets/renderer/row color', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'V6ehqiwY',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/row-color"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'uojLbuWq',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/row-color",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/row-color/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/row-color/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/row-color/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/suffix-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/suffix-widget', 'Integration | Component | widgets/renderer/suffix widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'EhTA0T05',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/suffix-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'vOxtwqFN',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/suffix-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/suffix-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/suffix-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/suffix-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/tag-widget/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('widgets/renderer/tag-widget', 'Integration | Component | widgets/renderer/tag widget', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'cSc3Oe7e',
      'block': '{"symbols":[],"statements":[[1,[18,"widgets/renderer/tag-widget"],false]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'fjkDo8wf',
      'block': '{"symbols":[],"statements":[[0,"\\n"],[4,"widgets/renderer/tag-widget",null,null,{"statements":[[0,"      template block text\\n"]],"parameters":[]},null],[0,"  "]],"hasEval":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/pods/components/widgets/renderer/tag-widget/component-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | integration/pods/components/widgets/renderer/tag-widget/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/widgets/renderer/tag-widget/component-test.js should pass jshint.');
  });
});
define('frontend/tests/mixins/ace-tools.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/ace-tools.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/ace-tools.js should pass jshint.\nmixins/ace-tools.js: line 11, col 41, Missing semicolon.\nmixins/ace-tools.js: line 10, col 26, \'status\' is defined but never used.\nmixins/ace-tools.js: line 13, col 35, Missing semicolon.\nmixins/ace-tools.js: line 12, col 23, \'status\' is defined but never used.\nmixins/ace-tools.js: line 12, col 16, \'error\' is defined but never used.\nmixins/ace-tools.js: line 14, col 15, Missing semicolon.\nmixins/ace-tools.js: line 16, col 31, Missing semicolon.\n\n7 errors');
  });
});
define('frontend/tests/mixins/authentication-mixin.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/authentication-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/authentication-mixin.js should pass jshint.\nmixins/authentication-mixin.js: line 12, col 67, \'status\' is defined but never used.\nmixins/authentication-mixin.js: line 15, col 28, \'status\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/mixins/chart-settings.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/chart-settings.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/chart-settings.js should pass jshint.');
  });
});
define('frontend/tests/mixins/colors-mixin.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/colors-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/colors-mixin.js should pass jshint.');
  });
});
define('frontend/tests/mixins/custom-events.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/custom-events.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/custom-events.js should pass jshint.');
  });
});
define('frontend/tests/mixins/dynamic-query-params-controller-mixin.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/dynamic-query-params-controller-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/dynamic-query-params-controller-mixin.js should pass jshint.\nmixins/dynamic-query-params-controller-mixin.js: line 21, col 10, Expected an assignment or function call and instead saw an expression.\nmixins/dynamic-query-params-controller-mixin.js: line 26, col 10, Expected an assignment or function call and instead saw an expression.\nmixins/dynamic-query-params-controller-mixin.js: line 30, col 10, Expected an assignment or function call and instead saw an expression.\n\n3 errors');
  });
});
define('frontend/tests/mixins/dynamic-query-params-routes-mixin.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/dynamic-query-params-routes-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/dynamic-query-params-routes-mixin.js should pass jshint.\nmixins/dynamic-query-params-routes-mixin.js: line 10, col 33, \'model\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/mixins/helper-mixin.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/helper-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/helper-mixin.js should pass jshint.\nmixins/helper-mixin.js: line 22, col 28, Expected \'===\' and instead saw \'==\'.\n\n1 error');
  });
});
define('frontend/tests/mixins/loading-messages.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/loading-messages.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/loading-messages.js should pass jshint.\nmixins/loading-messages.js: line 8, col 10, Missing semicolon.\nmixins/loading-messages.js: line 9, col 59, Missing semicolon.\n\n2 errors');
  });
});
define('frontend/tests/mixins/result-view-mixin.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/result-view-mixin.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/result-view-mixin.js should pass jshint.\nmixins/result-view-mixin.js: line 63, col 35, Expected \'!==\' and instead saw \'!=\'.\nmixins/result-view-mixin.js: line 66, col 45, Expected \'!==\' and instead saw \'!=\'.\nmixins/result-view-mixin.js: line 88, col 27, Expected \'===\' and instead saw \'==\'.\nmixins/result-view-mixin.js: line 91, col 27, Expected \'===\' and instead saw \'==\'.\nmixins/result-view-mixin.js: line 94, col 44, Expected \'===\' and instead saw \'==\'.\nmixins/result-view-mixin.js: line 94, col 101, Expected \'===\' and instead saw \'==\'.\n\n6 errors');
  });
});
define('frontend/tests/mixins/utils-functions.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/utils-functions.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/utils-functions.js should pass jshint.\nmixins/utils-functions.js: line 10, col 23, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 12, col 29, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 12, col 47, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 14, col 30, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 16, col 37, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 28, col 31, Expected \'!==\' and instead saw \'!=\'.\nmixins/utils-functions.js: line 50, col 27, \'url\' is defined but never used.\nmixins/utils-functions.js: line 129, col 31, Expected \'!==\' and instead saw \'!=\'.\nmixins/utils-functions.js: line 164, col 37, You might be leaking a variable (itemStyle) here.\nmixins/utils-functions.js: line 164, col 37, \'itemStyle\' was used before it was declared, which is illegal for \'let\' variables.\nmixins/utils-functions.js: line 172, col 59, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 230, col 33, Expected \'!==\' and instead saw \'!=\'.\nmixins/utils-functions.js: line 230, col 64, Expected \'!==\' and instead saw \'!=\'.\nmixins/utils-functions.js: line 253, col 48, Expected \'!==\' and instead saw \'!=\'.\nmixins/utils-functions.js: line 253, col 89, Expected \'!==\' and instead saw \'!=\'.\nmixins/utils-functions.js: line 275, col 32, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 282, col 55, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 329, col 21, \'x2\' is already defined.\nmixins/utils-functions.js: line 330, col 21, \'x1\' is already defined.\nmixins/utils-functions.js: line 331, col 21, \'multipleYs\' is already defined.\nmixins/utils-functions.js: line 347, col 48, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 421, col 29, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 424, col 26, \'i\' is already defined.\nmixins/utils-functions.js: line 430, col 29, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 482, col 47, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 502, col 44, Expected an assignment or function call and instead saw an expression.\nmixins/utils-functions.js: line 498, col 53, \'i\' is defined but never used.\nmixins/utils-functions.js: line 509, col 41, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 478, col 13, \'found\' is defined but never used.\nmixins/utils-functions.js: line 530, col 17, Expected \'{\' and instead saw \'multipleYs\'.\nmixins/utils-functions.js: line 551, col 13, \'mode\' is defined but never used.\nmixins/utils-functions.js: line 828, col 70, Expected \'!==\' and instead saw \'!=\'.\nmixins/utils-functions.js: line 834, col 52, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 834, col 93, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 972, col 31, Expected \'!==\' and instead saw \'!=\'.\nmixins/utils-functions.js: line 968, col 18, \'index\' is defined but never used.\nmixins/utils-functions.js: line 988, col 22, \'index\' is defined but never used.\nmixins/utils-functions.js: line 1017, col 26, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 1017, col 36, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 1020, col 39, Expected \'!==\' and instead saw \'!=\'.\nmixins/utils-functions.js: line 1024, col 34, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 1033, col 10, Expected an assignment or function call and instead saw an expression.\nmixins/utils-functions.js: line 1066, col 46, Expected \'===\' and instead saw \'==\'.\nmixins/utils-functions.js: line 29, col 31, \'moment\' is not defined.\nmixins/utils-functions.js: line 130, col 20, \'moment\' is not defined.\nmixins/utils-functions.js: line 244, col 20, \'moment\' is not defined.\nmixins/utils-functions.js: line 244, col 32, \'moment\' is not defined.\nmixins/utils-functions.js: line 973, col 20, \'moment\' is not defined.\nmixins/utils-functions.js: line 974, col 20, \'moment\' is not defined.\nmixins/utils-functions.js: line 974, col 36, \'moment\' is not defined.\nmixins/utils-functions.js: line 974, col 36, Too many errors. (90% scanned).\n\n51 errors');
  });
});
define('frontend/tests/mixins/widget-components.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | mixins/widget-components.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/widget-components.js should pass jshint.\nmixins/widget-components.js: line 10, col 10, Expected an assignment or function call and instead saw an expression.\n\n1 error');
  });
});
define('frontend/tests/models/alert-event.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/alert-event.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/alert-event.js should pass jshint.');
  });
});
define('frontend/tests/models/alert-level-setting.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/alert-level-setting.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/alert-level-setting.js should pass jshint.');
  });
});
define('frontend/tests/models/alert-notification-setting.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/alert-notification-setting.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/alert-notification-setting.js should pass jshint.');
  });
});
define('frontend/tests/models/alert-setting.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/alert-setting.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/alert-setting.js should pass jshint.');
  });
});
define('frontend/tests/models/alert.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/alert.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/alert.js should pass jshint.\nmodels/alert.js: line 10, col 15, Duplicate key \'updated_at\'.\n\n1 error');
  });
});
define('frontend/tests/models/api-action.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/api-action.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/api-action.js should pass jshint.');
  });
});
define('frontend/tests/models/column-value.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/column-value.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/column-value.js should pass jshint.\nmodels/column-value.js: line 11, col 55, Missing semicolon.\nmodels/column-value.js: line 10, col 18, \'Ember\' is not defined.\n\n2 errors');
  });
});
define('frontend/tests/models/column.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/column.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/column.js should pass jshint.\nmodels/column.js: line 17, col 45, Missing semicolon.\nmodels/column.js: line 18, col 25, Expected \'===\' and instead saw \'==\'.\nmodels/column.js: line 18, col 49, Expected \'===\' and instead saw \'==\'.\nmodels/column.js: line 18, col 77, Expected \'===\' and instead saw \'==\'.\nmodels/column.js: line 19, col 24, Missing semicolon.\nmodels/column.js: line 21, col 25, Missing semicolon.\nmodels/column.js: line 16, col 17, \'Ember\' is not defined.\n\n7 errors');
  });
});
define('frontend/tests/models/dashboard.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/dashboard.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/dashboard.js should pass jshint.\nmodels/dashboard.js: line 27, col 37, Expected an assignment or function call and instead saw an expression.\nmodels/dashboard.js: line 29, col 38, Expected an assignment or function call and instead saw an expression.\n\n2 errors');
  });
});
define('frontend/tests/models/database.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/database.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/database.js should pass jshint.\nmodels/database.js: line 2, col 24, \'collectionAction\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/models/generated-alert.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/generated-alert.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/generated-alert.js should pass jshint.');
  });
});
define('frontend/tests/models/note.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/note.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/note.js should pass jshint.\nmodels/note.js: line 5, col 13, \'Ember\' is not defined.\n\n1 error');
  });
});
define('frontend/tests/models/permission-set.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/permission-set.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/permission-set.js should pass jshint.\nmodels/permission-set.js: line 12, col 36, Missing semicolon.\nmodels/permission-set.js: line 13, col 22, Missing semicolon.\nmodels/permission-set.js: line 10, col 25, \'Ember\' is not defined.\n\n3 errors');
  });
});
define('frontend/tests/models/permission.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/permission.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/permission.js should pass jshint.');
  });
});
define('frontend/tests/models/question.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/question.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/question.js should pass jshint.\nmodels/question.js: line 93, col 76, Expected an assignment or function call and instead saw an expression.\nmodels/question.js: line 94, col 69, Expected an assignment or function call and instead saw an expression.\nmodels/question.js: line 95, col 10, Expected an assignment or function call and instead saw an expression.\nmodels/question.js: line 112, col 81, Expected an assignment or function call and instead saw an expression.\nmodels/question.js: line 117, col 68, Expected an assignment or function call and instead saw an expression.\nmodels/question.js: line 122, col 78, Expected an assignment or function call and instead saw an expression.\nmodels/question.js: line 126, col 68, Expected \'!==\' and instead saw \'!=\'.\nmodels/question.js: line 10, col 13, \'Ember\' is not defined.\nmodels/question.js: line 36, col 20, \'Ember\' is not defined.\nmodels/question.js: line 52, col 20, \'Ember\' is not defined.\nmodels/question.js: line 52, col 40, \'Ember\' is not defined.\nmodels/question.js: line 90, col 22, \'Ember\' is not defined.\nmodels/question.js: line 100, col 22, \'Ember\' is not defined.\nmodels/question.js: line 111, col 17, \'Ember\' is not defined.\nmodels/question.js: line 115, col 16, \'Ember\' is not defined.\nmodels/question.js: line 124, col 22, \'Ember\' is not defined.\nmodels/question.js: line 125, col 21, \'Ember\' is not defined.\nmodels/question.js: line 128, col 11, \'Ember\' is not defined.\nmodels/question.js: line 103, col 17, \'moment\' is not defined.\nmodels/question.js: line 103, col 57, \'moment\' is not defined.\nmodels/question.js: line 4, col 5, \'collectionAction\' is defined but never used.\n\n21 errors');
  });
});
define('frontend/tests/models/send-alert-config.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/send-alert-config.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/send-alert-config.js should pass jshint.');
  });
});
define('frontend/tests/models/snapshot-datum.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/snapshot-datum.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/snapshot-datum.js should pass jshint.');
  });
});
define('frontend/tests/models/snapshot.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/snapshot.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/snapshot.js should pass jshint.');
  });
});
define('frontend/tests/models/table.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/table.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/table.js should pass jshint.\nmodels/table.js: line 2, col 10, \'memberAction\' is defined but never used.\nmodels/table.js: line 2, col 24, \'collectionAction\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/models/tag.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/tag.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/tag.js should pass jshint.');
  });
});
define('frontend/tests/models/team.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/team.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/team.js should pass jshint.\nmodels/team.js: line 18, col 24, Missing semicolon.\nmodels/team.js: line 19, col 17, Missing semicolon.\nmodels/team.js: line 24, col 28, Missing semicolon.\n\n3 errors');
  });
});
define('frontend/tests/models/user.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/user.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/user.js should pass jshint.\nmodels/user.js: line 5, col 5, \'collectionAction\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/models/variable.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/variable.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/variable.js should pass jshint.\nmodels/variable.js: line 39, col 110, Expected an assignment or function call and instead saw an expression.\nmodels/variable.js: line 63, col 68, Expected an assignment or function call and instead saw an expression.\nmodels/variable.js: line 64, col 88, Expected an assignment or function call and instead saw an expression.\nmodels/variable.js: line 65, col 14, Expected an assignment or function call and instead saw an expression.\nmodels/variable.js: line 21, col 29, \'moment\' is not defined.\nmodels/variable.js: line 24, col 27, \'moment\' is not defined.\n\n6 errors');
  });
});
define('frontend/tests/models/widget-item.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/widget-item.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/widget-item.js should pass jshint.\nmodels/widget-item.js: line 1, col 8, \'Ember\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/models/widget.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | models/widget.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/widget.js should pass jshint.');
  });
});
define('frontend/tests/pods/alerts/edit/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/alerts/edit/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/alerts/edit/controller.js should pass jshint.\npods/alerts/edit/controller.js: line 15, col 34, Expected \'===\' and instead saw \'==\'.\npods/alerts/edit/controller.js: line 15, col 45, Missing semicolon.\npods/alerts/edit/controller.js: line 17, col 6, Missing semicolon.\npods/alerts/edit/controller.js: line 21, col 34, Expected \'===\' and instead saw \'==\'.\npods/alerts/edit/controller.js: line 21, col 44, Missing semicolon.\npods/alerts/edit/controller.js: line 23, col 6, Missing semicolon.\npods/alerts/edit/controller.js: line 27, col 159, Missing semicolon.\npods/alerts/edit/controller.js: line 32, col 6, Missing semicolon.\npods/alerts/edit/controller.js: line 37, col 6, Missing semicolon.\npods/alerts/edit/controller.js: line 42, col 6, Missing semicolon.\npods/alerts/edit/controller.js: line 48, col 6, Missing semicolon.\npods/alerts/edit/controller.js: line 52, col 67, Missing semicolon.\npods/alerts/edit/controller.js: line 53, col 73, Missing semicolon.\npods/alerts/edit/controller.js: line 56, col 37, Expected \'===\' and instead saw \'==\'.\npods/alerts/edit/controller.js: line 56, col 39, Missing semicolon.\npods/alerts/edit/controller.js: line 57, col 10, Missing semicolon.\npods/alerts/edit/controller.js: line 59, col 147, Missing semicolon.\npods/alerts/edit/controller.js: line 60, col 61, Missing semicolon.\n\n18 errors');
  });
});
define('frontend/tests/pods/alerts/edit/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/alerts/edit/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/alerts/edit/route.js should pass jshint.\npods/alerts/edit/route.js: line 2, col 71, Missing semicolon.\npods/alerts/edit/route.js: line 6, col 65, Missing semicolon.\n\n2 errors');
  });
});
define('frontend/tests/pods/alerts/new/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/alerts/new/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/alerts/new/controller.js should pass jshint.\npods/alerts/new/controller.js: line 16, col 7, Missing semicolon.\npods/alerts/new/controller.js: line 23, col 7, Missing semicolon.\npods/alerts/new/controller.js: line 30, col 7, Missing semicolon.\npods/alerts/new/controller.js: line 37, col 7, Missing semicolon.\npods/alerts/new/controller.js: line 49, col 148, Missing semicolon.\npods/alerts/new/controller.js: line 85, col 61, Missing semicolon.\npods/alerts/new/controller.js: line 89, col 18, Missing semicolon.\npods/alerts/new/controller.js: line 91, col 42, Missing semicolon.\npods/alerts/new/controller.js: line 92, col 7, Missing semicolon.\npods/alerts/new/controller.js: line 95, col 23, Expected \'===\' and instead saw \'==\'.\npods/alerts/new/controller.js: line 97, col 39, Missing semicolon.\npods/alerts/new/controller.js: line 98, col 20, Missing semicolon.\npods/alerts/new/controller.js: line 100, col 38, Missing semicolon.\npods/alerts/new/controller.js: line 101, col 21, Missing semicolon.\npods/alerts/new/controller.js: line 103, col 30, Expected \'===\' and instead saw \'==\'.\npods/alerts/new/controller.js: line 105, col 43, Missing semicolon.\npods/alerts/new/controller.js: line 106, col 20, Missing semicolon.\npods/alerts/new/controller.js: line 108, col 42, Missing semicolon.\npods/alerts/new/controller.js: line 109, col 21, Missing semicolon.\npods/alerts/new/controller.js: line 112, col 30, Expected \'===\' and instead saw \'==\'.\npods/alerts/new/controller.js: line 114, col 45, Missing semicolon.\npods/alerts/new/controller.js: line 116, col 46, Missing semicolon.\npods/alerts/new/controller.js: line 119, col 40, Missing semicolon.\npods/alerts/new/controller.js: line 121, col 41, Missing semicolon.\npods/alerts/new/controller.js: line 125, col 43, Missing semicolon.\npods/alerts/new/controller.js: line 127, col 44, Missing semicolon.\npods/alerts/new/controller.js: line 131, col 48, Missing semicolon.\npods/alerts/new/controller.js: line 133, col 49, Missing semicolon.\npods/alerts/new/controller.js: line 137, col 43, Missing semicolon.\npods/alerts/new/controller.js: line 139, col 44, Missing semicolon.\npods/alerts/new/controller.js: line 143, col 51, Missing semicolon.\npods/alerts/new/controller.js: line 145, col 52, Missing semicolon.\npods/alerts/new/controller.js: line 149, col 52, Missing semicolon.\npods/alerts/new/controller.js: line 151, col 53, Missing semicolon.\npods/alerts/new/controller.js: line 162, col 21, Missing semicolon.\npods/alerts/new/controller.js: line 164, col 20, Missing semicolon.\npods/alerts/new/controller.js: line 167, col 30, Expected \'===\' and instead saw \'==\'.\npods/alerts/new/controller.js: line 169, col 56, Missing semicolon.\npods/alerts/new/controller.js: line 170, col 21, Missing semicolon.\npods/alerts/new/controller.js: line 171, col 68, Expected \'===\' and instead saw \'==\'.\npods/alerts/new/controller.js: line 172, col 56, Missing semicolon.\npods/alerts/new/controller.js: line 173, col 21, Missing semicolon.\npods/alerts/new/controller.js: line 176, col 57, Missing semicolon.\npods/alerts/new/controller.js: line 177, col 57, Missing semicolon.\npods/alerts/new/controller.js: line 178, col 20, Missing semicolon.\npods/alerts/new/controller.js: line 180, col 30, Expected \'===\' and instead saw \'==\'.\npods/alerts/new/controller.js: line 182, col 60, Missing semicolon.\npods/alerts/new/controller.js: line 184, col 61, Missing semicolon.\npods/alerts/new/controller.js: line 187, col 44, Missing semicolon.\npods/alerts/new/controller.js: line 189, col 45, Missing semicolon.\npods/alerts/new/controller.js: line 189, col 45, Too many errors. (69% scanned).\n\n51 errors');
  });
});
define('frontend/tests/pods/alerts/new/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/alerts/new/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/alerts/new/route.js should pass jshint.\npods/alerts/new/route.js: line 2, col 71, Missing semicolon.\n\n1 error');
  });
});
define('frontend/tests/pods/alerts/show/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/alerts/show/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/alerts/show/controller.js should pass jshint.');
  });
});
define('frontend/tests/pods/alerts/show/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/alerts/show/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/alerts/show/route.js should pass jshint.');
  });
});
define('frontend/tests/pods/api/google/callback/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/api/google/callback/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/api/google/callback/controller.js should pass jshint.\npods/api/google/callback/controller.js: line 17, col 23, \'status\' is defined but never used.\npods/api/google/callback/controller.js: line 29, col 20, \'status\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/api/google/callback/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/api/google/callback/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/api/google/callback/route.js should pass jshint.');
  });
});
define('frontend/tests/pods/application/adapter.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/application/adapter.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/application/adapter.js should pass jshint.\npods/application/adapter.js: line 15, col 10, Missing semicolon.\npods/application/adapter.js: line 23, col 18, Expected \'===\' and instead saw \'==\'.\npods/application/adapter.js: line 23, col 167, Expected an assignment or function call and instead saw an expression.\npods/application/adapter.js: line 2, col 47, \'Ember\' is not defined.\npods/application/adapter.js: line 8, col 12, \'Ember\' is not defined.\npods/application/adapter.js: line 9, col 21, \'Ember\' is not defined.\npods/application/adapter.js: line 10, col 14, \'Ember\' is not defined.\npods/application/adapter.js: line 18, col 16, \'Ember\' is not defined.\npods/application/adapter.js: line 18, col 39, \'Ember\' is not defined.\npods/application/adapter.js: line 2, col 19, \'pluralize\' is defined but never used.\npods/application/adapter.js: line 2, col 30, \'underscore\' is defined but never used.\n\n11 errors');
  });
});
define('frontend/tests/pods/application/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/application/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/application/controller.js should pass jshint.\npods/application/controller.js: line 8, col 44, Missing semicolon.\npods/application/controller.js: line 11, col 73, Missing semicolon.\npods/application/controller.js: line 12, col 49, Missing semicolon.\npods/application/controller.js: line 16, col 71, Missing semicolon.\npods/application/controller.js: line 17, col 48, Missing semicolon.\n\n5 errors');
  });
});
define('frontend/tests/pods/application/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/application/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/application/route.js should pass jshint.\npods/application/route.js: line 13, col 43, Missing semicolon.\npods/application/route.js: line 11, col 33, \'model\' is defined but never used.\npods/application/route.js: line 18, col 60, Missing semicolon.\npods/application/route.js: line 21, col 45, Missing semicolon.\npods/application/route.js: line 24, col 45, Missing semicolon.\npods/application/route.js: line 27, col 61, Missing semicolon.\npods/application/route.js: line 30, col 59, Missing semicolon.\npods/application/route.js: line 31, col 59, Missing semicolon.\npods/application/route.js: line 34, col 62, Missing semicolon.\npods/application/route.js: line 35, col 60, Missing semicolon.\npods/application/route.js: line 38, col 59, Missing semicolon.\npods/application/route.js: line 39, col 60, Missing semicolon.\npods/application/route.js: line 8, col 40, \'moment\' is not defined.\n\n13 errors');
  });
});
define('frontend/tests/pods/application/serializer.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/application/serializer.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/application/serializer.js should pass jshint.\npods/application/serializer.js: line 3, col 18, \'Ember\' is not defined.\n\n1 error');
  });
});
define('frontend/tests/pods/components/accordion-multiselect/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/accordion-multiselect/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/accordion-multiselect/component.js should pass jshint.\npods/components/accordion-multiselect/component.js: line 2, col 55, Missing semicolon.\npods/components/accordion-multiselect/component.js: line 7, col 145, Missing semicolon.\npods/components/accordion-multiselect/component.js: line 12, col 53, Missing semicolon.\n\n3 errors');
  });
});
define('frontend/tests/pods/components/add-tag/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/add-tag/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/add-tag/component.js should pass jshint.\npods/components/add-tag/component.js: line 2, col 54, Missing semicolon.\npods/components/add-tag/component.js: line 6, col 48, Missing semicolon.\npods/components/add-tag/component.js: line 10, col 71, Missing semicolon.\npods/components/add-tag/component.js: line 12, col 27, Expected \'!==\' and instead saw \'!=\'.\npods/components/add-tag/component.js: line 13, col 11, Missing semicolon.\npods/components/add-tag/component.js: line 17, col 36, Missing semicolon.\npods/components/add-tag/component.js: line 23, col 15, Missing semicolon.\npods/components/add-tag/component.js: line 25, col 56, Missing semicolon.\npods/components/add-tag/component.js: line 24, col 30, \'response\' is defined but never used.\npods/components/add-tag/component.js: line 26, col 15, Missing semicolon.\npods/components/add-tag/component.js: line 34, col 46, Missing semicolon.\n\n11 errors');
  });
});
define('frontend/tests/pods/components/add-to-dashboard/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/add-to-dashboard/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/add-to-dashboard/component.js should pass jshint.\npods/components/add-to-dashboard/component.js: line 14, col 28, Missing semicolon.\npods/components/add-to-dashboard/component.js: line 15, col 67, Missing semicolon.\npods/components/add-to-dashboard/component.js: line 20, col 15, Missing semicolon.\npods/components/add-to-dashboard/component.js: line 21, col 36, \'response\' is defined but never used.\npods/components/add-to-dashboard/component.js: line 23, col 15, Missing semicolon.\n\n5 errors');
  });
});
define('frontend/tests/pods/components/additional-filters/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/additional-filters/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/additional-filters/component.js should pass jshint.\npods/components/additional-filters/component.js: line 63, col 48, Expected \'===\' and instead saw \'==\'.\npods/components/additional-filters/component.js: line 118, col 17, \'items\' is defined but never used.\npods/components/additional-filters/component.js: line 127, col 17, \'items\' is defined but never used.\npods/components/additional-filters/component.js: line 50, col 17, \'moment\' is not defined.\npods/components/additional-filters/component.js: line 50, col 36, \'moment\' is not defined.\n\n5 errors');
  });
});
define('frontend/tests/pods/components/alert-expression/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/alert-expression/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/alert-expression/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/api-action-modal/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/api-action-modal/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/api-action-modal/component.js should pass jshint.\npods/components/api-action-modal/component.js: line 14, col 22, Expected \'===\' and instead saw \'==\'.\npods/components/api-action-modal/component.js: line 14, col 49, Expected \'===\' and instead saw \'==\'.\npods/components/api-action-modal/component.js: line 34, col 48, \'response\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/components/api-action-result/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/api-action-result/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/api-action-result/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/app-logo/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/app-logo/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/app-logo/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/area-chart-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/area-chart-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/area-chart-settings/component.js should pass jshint.\npods/components/area-chart-settings/component.js: line 2, col 65, Missing semicolon.\npods/components/area-chart-settings/component.js: line 1, col 8, \'Ember\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/components/area-chart/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/area-chart/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/area-chart/component.js should pass jshint.\npods/components/area-chart/component.js: line 30, col 13, \'_this\' is defined but never used.\npods/components/area-chart/component.js: line 4, col 5, \'get\' is defined but never used.\npods/components/area-chart/component.js: line 5, col 5, \'arrayComputed\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/components/bar-chart-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/bar-chart-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/bar-chart-settings/component.js should pass jshint.\npods/components/bar-chart-settings/component.js: line 2, col 65, Missing semicolon.\npods/components/bar-chart-settings/component.js: line 1, col 8, \'Ember\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/components/bar-chart/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/bar-chart/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/bar-chart/component.js should pass jshint.\npods/components/bar-chart/component.js: line 17, col 13, \'_this\' is defined but never used.\npods/components/bar-chart/component.js: line 4, col 5, \'get\' is defined but never used.\npods/components/bar-chart/component.js: line 5, col 5, \'arrayComputed\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/components/base-chart-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/base-chart-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/base-chart-settings/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/base-header/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/base-header/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/base-header/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/bubble-chart-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/bubble-chart-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/bubble-chart-settings/component.js should pass jshint.\npods/components/bubble-chart-settings/component.js: line 2, col 65, Missing semicolon.\npods/components/bubble-chart-settings/component.js: line 1, col 8, \'Ember\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/components/bubble-chart/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/bubble-chart/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/bubble-chart/component.js should pass jshint.\npods/components/bubble-chart/component.js: line 18, col 13, \'_this\' is defined but never used.\npods/components/bubble-chart/component.js: line 4, col 5, \'get\' is defined but never used.\npods/components/bubble-chart/component.js: line 5, col 5, \'arrayComputed\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/components/calendar-chart-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/calendar-chart-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/calendar-chart-settings/component.js should pass jshint.\npods/components/calendar-chart-settings/component.js: line 3, col 65, Missing semicolon.\npods/components/calendar-chart-settings/component.js: line 1, col 8, \'Ember\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/components/calendar-chart/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/calendar-chart/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/calendar-chart/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/change-user-permissions-dialogue/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/change-user-permissions-dialogue/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/change-user-permissions-dialogue/component.js should pass jshint.\npods/components/change-user-permissions-dialogue/component.js: line 15, col 62, Missing semicolon.\n\n1 error');
  });
});
define('frontend/tests/pods/components/circular-checkbox/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/circular-checkbox/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/circular-checkbox/component.js should pass jshint.\npods/components/circular-checkbox/component.js: line 6, col 39, Missing semicolon.\n\n1 error');
  });
});
define('frontend/tests/pods/components/create-dashboard-variable/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/create-dashboard-variable/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/create-dashboard-variable/component.js should pass jshint.\npods/components/create-dashboard-variable/component.js: line 5, col 45, Expected \'===\' and instead saw \'==\'.\npods/components/create-dashboard-variable/component.js: line 6, col 24, Missing semicolon.\npods/components/create-dashboard-variable/component.js: line 8, col 25, Missing semicolon.\n\n3 errors');
  });
});
define('frontend/tests/pods/components/create-dashboard/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/create-dashboard/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/create-dashboard/component.js should pass jshint.\npods/components/create-dashboard/component.js: line 10, col 15, Missing semicolon.\npods/components/create-dashboard/component.js: line 11, col 36, \'response\' is defined but never used.\npods/components/create-dashboard/component.js: line 13, col 15, Missing semicolon.\npods/components/create-dashboard/component.js: line 16, col 71, Missing semicolon.\npods/components/create-dashboard/component.js: line 18, col 70, Missing semicolon.\npods/components/create-dashboard/component.js: line 19, col 15, Missing semicolon.\npods/components/create-dashboard/component.js: line 16, col 13, \'dashboard\' is not defined.\npods/components/create-dashboard/component.js: line 17, col 13, \'dashboard\' is not defined.\n\n8 errors');
  });
});
define('frontend/tests/pods/components/create-tag/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/create-tag/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/create-tag/component.js should pass jshint.\npods/components/create-tag/component.js: line 2, col 54, Missing semicolon.\npods/components/create-tag/component.js: line 12, col 15, Missing semicolon.\npods/components/create-tag/component.js: line 13, col 62, Missing semicolon.\npods/components/create-tag/component.js: line 15, col 56, Missing semicolon.\npods/components/create-tag/component.js: line 16, col 53, Missing semicolon.\npods/components/create-tag/component.js: line 17, col 15, Missing semicolon.\n\n6 errors');
  });
});
define('frontend/tests/pods/components/create-variable/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/create-variable/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/create-variable/component.js should pass jshint.\npods/components/create-variable/component.js: line 5, col 50, Missing semicolon.\npods/components/create-variable/component.js: line 8, col 45, Expected \'===\' and instead saw \'==\'.\npods/components/create-variable/component.js: line 9, col 24, Missing semicolon.\npods/components/create-variable/component.js: line 11, col 25, Missing semicolon.\npods/components/create-variable/component.js: line 15, col 75, Missing semicolon.\npods/components/create-variable/component.js: line 17, col 16, Duplicate key \'varTypeHash\'.\npods/components/create-variable/component.js: line 18, col 75, Missing semicolon.\npods/components/create-variable/component.js: line 21, col 45, Expected \'===\' and instead saw \'==\'.\npods/components/create-variable/component.js: line 22, col 49, Missing semicolon.\npods/components/create-variable/component.js: line 23, col 57, Missing semicolon.\npods/components/create-variable/component.js: line 28, col 48, Expected \'===\' and instead saw \'==\'.\npods/components/create-variable/component.js: line 28, col 58, Missing semicolon.\npods/components/create-variable/component.js: line 32, col 108, Missing semicolon.\npods/components/create-variable/component.js: line 37, col 64, Missing semicolon.\npods/components/create-variable/component.js: line 38, col 47, Missing semicolon.\npods/components/create-variable/component.js: line 39, col 53, Missing semicolon.\npods/components/create-variable/component.js: line 40, col 55, Missing semicolon.\npods/components/create-variable/component.js: line 44, col 43, Missing semicolon.\n\n18 errors');
  });
});
define('frontend/tests/pods/components/dashboard-grid/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/dashboard-grid/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/dashboard-grid/component.js should pass jshint.\npods/components/dashboard-grid/component.js: line 13, col 37, Expected an assignment or function call and instead saw an expression.\npods/components/dashboard-grid/component.js: line 15, col 38, Expected an assignment or function call and instead saw an expression.\npods/components/dashboard-grid/component.js: line 21, col 16, \'args\' is defined but never used.\npods/components/dashboard-grid/component.js: line 7, col 15, \'moment\' is not defined.\n\n4 errors');
  });
});
define('frontend/tests/pods/components/dashboard-note-card/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/dashboard-note-card/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/dashboard-note-card/component.js should pass jshint.\npods/components/dashboard-note-card/component.js: line 48, col 39, \'src\' is defined but never used.\npods/components/dashboard-note-card/component.js: line 48, col 36, \'e\' is defined but never used.\npods/components/dashboard-note-card/component.js: line 47, col 13, \'_this\' is defined but never used.\npods/components/dashboard-note-card/component.js: line 55, col 76, Expected an assignment or function call and instead saw an expression.\npods/components/dashboard-note-card/component.js: line 7, col 9, \'Simditor\' is not defined.\npods/components/dashboard-note-card/component.js: line 11, col 26, \'Simditor\' is not defined.\npods/components/dashboard-note-card/component.js: line 93, col 30, \'$\' is not defined.\n\n7 errors');
  });
});
define('frontend/tests/pods/components/dashboard-select-variables/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/dashboard-select-variables/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/dashboard-select-variables/component.js should pass jshint.\npods/components/dashboard-select-variables/component.js: line 3, col 55, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 7, col 62, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 9, col 82, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 9, col 114, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 10, col 12, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 13, col 65, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 15, col 51, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 16, col 12, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 20, col 40, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 28, col 15, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 32, col 40, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 35, col 37, Missing semicolon.\npods/components/dashboard-select-variables/component.js: line 38, col 69, Missing semicolon.\n\n13 errors');
  });
});
define('frontend/tests/pods/components/dashboard-selector/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/dashboard-selector/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/dashboard-selector/component.js should pass jshint.\npods/components/dashboard-selector/component.js: line 6, col 50, Missing semicolon.\npods/components/dashboard-selector/component.js: line 10, col 33, Missing semicolon.\npods/components/dashboard-selector/component.js: line 11, col 44, Missing semicolon.\npods/components/dashboard-selector/component.js: line 12, col 34, Missing semicolon.\npods/components/dashboard-selector/component.js: line 13, col 26, Expected \'!==\' and instead saw \'!=\'.\npods/components/dashboard-selector/component.js: line 15, col 95, Missing semicolon.\npods/components/dashboard-selector/component.js: line 16, col 9, Missing semicolon.\npods/components/dashboard-selector/component.js: line 18, col 24, Missing semicolon.\npods/components/dashboard-selector/component.js: line 24, col 37, Missing semicolon.\npods/components/dashboard-selector/component.js: line 26, col 48, Missing semicolon.\npods/components/dashboard-selector/component.js: line 32, col 76, Missing semicolon.\npods/components/dashboard-selector/component.js: line 34, col 48, Missing semicolon.\npods/components/dashboard-selector/component.js: line 38, col 50, Missing semicolon.\npods/components/dashboard-selector/component.js: line 41, col 107, Missing semicolon.\n\n14 errors');
  });
});
define('frontend/tests/pods/components/data-charts/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/data-charts/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/data-charts/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/database-selector/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/database-selector/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/database-selector/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/db-tree/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/db-tree/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/db-tree/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/delete-dialogue/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/delete-dialogue/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/delete-dialogue/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/dropdown-default/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/dropdown-default/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/dropdown-default/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/filter-maker/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/filter-maker/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/filter-maker/component.js should pass jshint.\npods/components/filter-maker/component.js: line 5, col 40, Missing semicolon.\npods/components/filter-maker/component.js: line 6, col 48, Missing semicolon.\npods/components/filter-maker/component.js: line 9, col 113, Missing semicolon.\npods/components/filter-maker/component.js: line 10, col 11, Missing semicolon.\npods/components/filter-maker/component.js: line 12, col 23, Missing semicolon.\npods/components/filter-maker/component.js: line 18, col 44, Missing semicolon.\npods/components/filter-maker/component.js: line 19, col 46, Missing semicolon.\npods/components/filter-maker/component.js: line 20, col 63, Missing semicolon.\npods/components/filter-maker/component.js: line 22, col 201, Missing semicolon.\npods/components/filter-maker/component.js: line 23, col 140, Missing semicolon.\npods/components/filter-maker/component.js: line 25, col 149, Missing semicolon.\npods/components/filter-maker/component.js: line 27, col 43, Missing semicolon.\npods/components/filter-maker/component.js: line 43, col 61, Missing semicolon.\npods/components/filter-maker/component.js: line 47, col 57, Missing semicolon.\n\n14 errors');
  });
});
define('frontend/tests/pods/components/filter-value-selector/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/filter-value-selector/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/filter-value-selector/component.js should pass jshint.\npods/components/filter-value-selector/component.js: line 5, col 36, Missing semicolon.\npods/components/filter-value-selector/component.js: line 6, col 90, Missing semicolon.\npods/components/filter-value-selector/component.js: line 7, col 38, Expected an assignment or function call and instead saw an expression.\npods/components/filter-value-selector/component.js: line 24, col 67, Missing semicolon.\npods/components/filter-value-selector/component.js: line 29, col 59, Missing semicolon.\npods/components/filter-value-selector/component.js: line 30, col 25, Expected \'===\' and instead saw \'==\'.\npods/components/filter-value-selector/component.js: line 30, col 49, Expected \'===\' and instead saw \'==\'.\npods/components/filter-value-selector/component.js: line 30, col 77, Expected \'===\' and instead saw \'==\'.\npods/components/filter-value-selector/component.js: line 30, col 123, Expected \'===\' and instead saw \'==\'.\npods/components/filter-value-selector/component.js: line 31, col 24, Missing semicolon.\npods/components/filter-value-selector/component.js: line 33, col 25, Missing semicolon.\npods/components/filter-value-selector/component.js: line 55, col 11, Missing semicolon.\npods/components/filter-value-selector/component.js: line 60, col 40, Missing semicolon.\npods/components/filter-value-selector/component.js: line 61, col 54, Missing semicolon.\npods/components/filter-value-selector/component.js: line 65, col 3, Missing semicolon.\n\n15 errors');
  });
});
define('frontend/tests/pods/components/final-query-accordian/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/final-query-accordian/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/final-query-accordian/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/funnel-chart-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/funnel-chart-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/funnel-chart-settings/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/group-by-maker/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/group-by-maker/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/group-by-maker/component.js should pass jshint.\npods/components/group-by-maker/component.js: line 30, col 47, Expected \'===\' and instead saw \'==\'.\npods/components/group-by-maker/component.js: line 46, col 25, Expected \'===\' and instead saw \'==\'.\npods/components/group-by-maker/component.js: line 46, col 49, Expected \'===\' and instead saw \'==\'.\npods/components/group-by-maker/component.js: line 46, col 77, Expected \'===\' and instead saw \'==\'.\npods/components/group-by-maker/component.js: line 46, col 123, Expected \'===\' and instead saw \'==\'.\n\n5 errors');
  });
});
define('frontend/tests/pods/components/key-value-maker/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/key-value-maker/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/key-value-maker/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/keyboard-shortcuts-help/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/keyboard-shortcuts-help/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/keyboard-shortcuts-help/component.js should pass jshint.\npods/components/keyboard-shortcuts-help/component.js: line 7, col 30, Missing semicolon.\npods/components/keyboard-shortcuts-help/component.js: line 8, col 169, Expected \'===\' and instead saw \'==\'.\npods/components/keyboard-shortcuts-help/component.js: line 8, col 177, Missing semicolon.\npods/components/keyboard-shortcuts-help/component.js: line 9, col 74, Missing semicolon.\npods/components/keyboard-shortcuts-help/component.js: line 16, col 51, Missing semicolon.\npods/components/keyboard-shortcuts-help/component.js: line 20, col 57, Missing semicolon.\npods/components/keyboard-shortcuts-help/component.js: line 21, col 102, Missing semicolon.\n\n7 errors');
  });
});
define('frontend/tests/pods/components/limited-query-accordian/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/limited-query-accordian/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/limited-query-accordian/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/line-chart-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/line-chart-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/line-chart-settings/component.js should pass jshint.\npods/components/line-chart-settings/component.js: line 2, col 65, Missing semicolon.\npods/components/line-chart-settings/component.js: line 1, col 8, \'Ember\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/components/line-chart/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/line-chart/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/line-chart/component.js should pass jshint.\npods/components/line-chart/component.js: line 17, col 13, \'_this\' is defined but never used.\npods/components/line-chart/component.js: line 4, col 5, \'get\' is defined but never used.\npods/components/line-chart/component.js: line 5, col 5, \'arrayComputed\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/components/next-transition-warning/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/next-transition-warning/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/next-transition-warning/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/number-chart-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/number-chart-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/number-chart-settings/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/number-chart/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/number-chart/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/number-chart/component.js should pass jshint.\npods/components/number-chart/component.js: line 5, col 47, Missing semicolon.\npods/components/number-chart/component.js: line 10, col 15, Missing semicolon.\npods/components/number-chart/component.js: line 11, col 23, Missing semicolon.\npods/components/number-chart/component.js: line 12, col 11, Missing semicolon.\npods/components/number-chart/component.js: line 20, col 42, Missing semicolon.\npods/components/number-chart/component.js: line 21, col 30, Expected \'===\' and instead saw \'==\'.\npods/components/number-chart/component.js: line 22, col 70, Missing semicolon.\npods/components/number-chart/component.js: line 23, col 24, Missing semicolon.\npods/components/number-chart/component.js: line 25, col 25, Missing semicolon.\n\n9 errors');
  });
});
define('frontend/tests/pods/components/order-by-maker/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/order-by-maker/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/order-by-maker/component.js should pass jshint.\npods/components/order-by-maker/component.js: line 21, col 91, Expected an assignment or function call and instead saw an expression.\n\n1 error');
  });
});
define('frontend/tests/pods/components/pie-chart-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/pie-chart-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/pie-chart-settings/component.js should pass jshint.\npods/components/pie-chart-settings/component.js: line 1, col 8, \'Ember\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/pods/components/pie-chart/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/pie-chart/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/pie-chart/component.js should pass jshint.\npods/components/pie-chart/component.js: line 25, col 13, \'_this\' is defined but never used.\npods/components/pie-chart/component.js: line 3, col 5, \'get\' is defined but never used.\npods/components/pie-chart/component.js: line 4, col 5, \'arrayComputed\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/components/query-builder/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/query-builder/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/query-builder/component.js should pass jshint.\npods/components/query-builder/component.js: line 7, col 18, Missing semicolon.\npods/components/query-builder/component.js: line 12, col 89, Missing semicolon.\npods/components/query-builder/component.js: line 23, col 32, Missing semicolon.\npods/components/query-builder/component.js: line 24, col 38, Missing semicolon.\npods/components/query-builder/component.js: line 27, col 29, Missing semicolon.\npods/components/query-builder/component.js: line 28, col 35, Missing semicolon.\npods/components/query-builder/component.js: line 29, col 36, Missing semicolon.\npods/components/query-builder/component.js: line 32, col 33, Missing semicolon.\npods/components/query-builder/component.js: line 35, col 33, Missing semicolon.\npods/components/query-builder/component.js: line 38, col 28, Missing semicolon.\npods/components/query-builder/component.js: line 41, col 31, Missing semicolon.\npods/components/query-builder/component.js: line 23, col 7, \'$\' is not defined.\npods/components/query-builder/component.js: line 24, col 7, \'$\' is not defined.\npods/components/query-builder/component.js: line 27, col 7, \'$\' is not defined.\npods/components/query-builder/component.js: line 28, col 7, \'$\' is not defined.\npods/components/query-builder/component.js: line 29, col 7, \'$\' is not defined.\npods/components/query-builder/component.js: line 32, col 7, \'$\' is not defined.\npods/components/query-builder/component.js: line 35, col 7, \'$\' is not defined.\npods/components/query-builder/component.js: line 38, col 7, \'$\' is not defined.\npods/components/query-builder/component.js: line 41, col 7, \'$\' is not defined.\n\n20 errors');
  });
});
define('frontend/tests/pods/components/question-options/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/question-options/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/question-options/component.js should pass jshint.\npods/components/question-options/component.js: line 54, col 44, \'response\' is defined but never used.\npods/components/question-options/component.js: line 61, col 86, Expected an assignment or function call and instead saw an expression.\n\n2 errors');
  });
});
define('frontend/tests/pods/components/question-selector/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/question-selector/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/question-selector/component.js should pass jshint.\npods/components/question-selector/component.js: line 6, col 49, Missing semicolon.\npods/components/question-selector/component.js: line 11, col 61, Missing semicolon.\npods/components/question-selector/component.js: line 14, col 33, Missing semicolon.\npods/components/question-selector/component.js: line 15, col 42, Missing semicolon.\npods/components/question-selector/component.js: line 16, col 34, Missing semicolon.\npods/components/question-selector/component.js: line 17, col 26, Expected \'!==\' and instead saw \'!=\'.\npods/components/question-selector/component.js: line 18, col 97, Missing semicolon.\npods/components/question-selector/component.js: line 20, col 71, Missing semicolon.\npods/components/question-selector/component.js: line 26, col 37, Missing semicolon.\npods/components/question-selector/component.js: line 28, col 48, Missing semicolon.\npods/components/question-selector/component.js: line 34, col 75, Missing semicolon.\npods/components/question-selector/component.js: line 36, col 48, Missing semicolon.\npods/components/question-selector/component.js: line 40, col 48, Missing semicolon.\npods/components/question-selector/component.js: line 43, col 105, Missing semicolon.\n\n14 errors');
  });
});
define('frontend/tests/pods/components/question-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/question-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/question-widget/component.js should pass jshint.\npods/components/question-widget/component.js: line 2, col 59, Missing semicolon.\npods/components/question-widget/component.js: line 3, col 54, Missing semicolon.\npods/components/question-widget/component.js: line 7, col 39, Missing semicolon.\npods/components/question-widget/component.js: line 27, col 6, Missing semicolon.\npods/components/question-widget/component.js: line 28, col 60, Missing semicolon.\npods/components/question-widget/component.js: line 37, col 54, Missing semicolon.\npods/components/question-widget/component.js: line 41, col 55, Missing semicolon.\n\n7 errors');
  });
});
define('frontend/tests/pods/components/questions-list/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/questions-list/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/questions-list/component.js should pass jshint.\npods/components/questions-list/component.js: line 29, col 44, \'response\' is defined but never used.\npods/components/questions-list/component.js: line 45, col 61, Expected an assignment or function call and instead saw an expression.\npods/components/questions-list/component.js: line 49, col 81, Expected an assignment or function call and instead saw an expression.\npods/components/questions-list/component.js: line 50, col 80, Expected an assignment or function call and instead saw an expression.\npods/components/questions-list/component.js: line 15, col 15, \'moment\' is not defined.\n\n5 errors');
  });
});
define('frontend/tests/pods/components/results-table-settings/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/results-table-settings/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/results-table-settings/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/results-table/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/results-table/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/results-table/component.js should pass jshint.\npods/components/results-table/component.js: line 23, col 9, Duplicate key \'page\'.\npods/components/results-table/component.js: line 24, col 12, Duplicate key \'perPage\'.\npods/components/results-table/component.js: line 58, col 23, \'error\' is defined but never used.\npods/components/results-table/component.js: line 2, col 8, \'Table\' is defined but never used.\n\n4 errors');
  });
});
define('frontend/tests/pods/components/share-entity/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/share-entity/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/share-entity/component.js should pass jshint.\npods/components/share-entity/component.js: line 42, col 9, Missing semicolon.\n\n1 error');
  });
});
define('frontend/tests/pods/components/snapshot-creator/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/snapshot-creator/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/snapshot-creator/component.js should pass jshint.\npods/components/snapshot-creator/component.js: line 138, col 77, \'response\' is defined but never used.\npods/components/snapshot-creator/component.js: line 151, col 39, \'response\' is defined but never used.\npods/components/snapshot-creator/component.js: line 9, col 52, \'moment\' is not defined.\npods/components/snapshot-creator/component.js: line 10, col 74, \'moment\' is not defined.\n\n4 errors');
  });
});
define('frontend/tests/pods/components/snapshot-stop-confirmation/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/snapshot-stop-confirmation/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/snapshot-stop-confirmation/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/snapshots-list/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/snapshots-list/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/snapshots-list/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/subquery-builder/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/subquery-builder/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/subquery-builder/component.js should pass jshint.\npods/components/subquery-builder/component.js: line 79, col 17, \'store\' is defined but never used.\npods/components/subquery-builder/component.js: line 109, col 14, Expected an assignment or function call and instead saw an expression.\npods/components/subquery-builder/component.js: line 118, col 48, Expected \'===\' and instead saw \'==\'.\npods/components/subquery-builder/component.js: line 170, col 17, \'items\' is defined but never used.\npods/components/subquery-builder/component.js: line 179, col 17, \'items\' is defined but never used.\npods/components/subquery-builder/component.js: line 104, col 21, \'moment\' is not defined.\npods/components/subquery-builder/component.js: line 104, col 40, \'moment\' is not defined.\n\n7 errors');
  });
});
define('frontend/tests/pods/components/variable-value-selector/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/variable-value-selector/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/variable-value-selector/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/variables-layer/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/variables-layer/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/variables-layer/component.js should pass jshint.\npods/components/variables-layer/component.js: line 6, col 49, Expected \'===\' and instead saw \'==\'.\npods/components/variables-layer/component.js: line 7, col 49, Missing semicolon.\npods/components/variables-layer/component.js: line 8, col 51, Missing semicolon.\npods/components/variables-layer/component.js: line 9, col 53, Expected \'===\' and instead saw \'==\'.\npods/components/variables-layer/component.js: line 10, col 50, Missing semicolon.\npods/components/variables-layer/component.js: line 11, col 50, Missing semicolon.\npods/components/variables-layer/component.js: line 13, col 51, Missing semicolon.\npods/components/variables-layer/component.js: line 14, col 50, Missing semicolon.\npods/components/variables-layer/component.js: line 16, col 10, Expected an assignment or function call and instead saw an expression.\npods/components/variables-layer/component.js: line 16, col 11, Missing semicolon.\n\n10 errors');
  });
});
define('frontend/tests/pods/components/view-maker/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/view-maker/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/view-maker/component.js should pass jshint.\npods/components/view-maker/component.js: line 5, col 48, Missing semicolon.\npods/components/view-maker/component.js: line 7, col 57, Missing semicolon.\npods/components/view-maker/component.js: line 8, col 50, Expected \'===\' and instead saw \'==\'.\npods/components/view-maker/component.js: line 9, col 60, Missing semicolon.\npods/components/view-maker/component.js: line 10, col 54, Missing semicolon.\npods/components/view-maker/component.js: line 12, col 135, Missing semicolon.\npods/components/view-maker/component.js: line 13, col 43, Missing semicolon.\n\n7 errors');
  });
});
define('frontend/tests/pods/components/widget-creator/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widget-creator/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/components/widget-creator/component.js should pass jshint.\npods/components/widget-creator/component.js: line 34, col 71, \'index\' is defined but never used.\npods/components/widget-creator/component.js: line 123, col 45, \'resp\' is defined but never used.\npods/components/widget-creator/component.js: line 143, col 25, \'items\' used out of scope.\n\n3 errors');
  });
});
define('frontend/tests/pods/components/widgets/demo/circular-progress-bar/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/demo/circular-progress-bar/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/demo/circular-progress-bar/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/demo/icon-and-text/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/demo/icon-and-text/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/demo/icon-and-text/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/demo/prefix-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/demo/prefix-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/demo/prefix-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/demo/progress-bar/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/demo/progress-bar/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/demo/progress-bar/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/demo/ratings-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/demo/ratings-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/demo/ratings-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/demo/row-border/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/demo/row-border/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/demo/row-border/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/demo/row-color/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/demo/row-color/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/demo/row-color/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/demo/suffix-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/demo/suffix-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/demo/suffix-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/demo/tag-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/demo/tag-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/demo/tag-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/editable/circular-progress-bar/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/editable/circular-progress-bar/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/editable/circular-progress-bar/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/editable/icon-and-text/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/editable/icon-and-text/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/editable/icon-and-text/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/editable/prefix-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/editable/prefix-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/editable/prefix-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/editable/progress-bar/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/editable/progress-bar/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/editable/progress-bar/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/editable/ratings-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/editable/ratings-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/editable/ratings-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/editable/row-border/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/editable/row-border/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/editable/row-border/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/editable/row-color/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/editable/row-color/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/editable/row-color/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/editable/suffix-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/editable/suffix-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/editable/suffix-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/editable/tag-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/editable/tag-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/editable/tag-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/render-widgets/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/render-widgets/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/render-widgets/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/renderer/circular-progress-bar/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/renderer/circular-progress-bar/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/renderer/circular-progress-bar/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/renderer/icon-and-text/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/renderer/icon-and-text/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/renderer/icon-and-text/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/renderer/prefix-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/renderer/prefix-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/renderer/prefix-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/renderer/progress-bar/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/renderer/progress-bar/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/renderer/progress-bar/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/renderer/ratings-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/renderer/ratings-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/renderer/ratings-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/renderer/row-border/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/renderer/row-border/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/renderer/row-border/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/renderer/row-color/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/renderer/row-color/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/renderer/row-color/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/renderer/suffix-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/renderer/suffix-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/renderer/suffix-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/components/widgets/renderer/tag-widget/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/components/widgets/renderer/tag-widget/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/widgets/renderer/tag-widget/component.js should pass jshint.');
  });
});
define('frontend/tests/pods/dashboards/index/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/dashboards/index/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dashboards/index/controller.js should pass jshint.');
  });
});
define('frontend/tests/pods/dashboards/index/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/dashboards/index/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/dashboards/index/route.js should pass jshint.\npods/dashboards/index/route.js: line 12, col 11, \'params\' is defined but never used.\npods/dashboards/index/route.js: line 16, col 33, \'model\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/dashboards/show/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/dashboards/show/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/dashboards/show/controller.js should pass jshint.\npods/dashboards/show/controller.js: line 125, col 10, Expected an assignment or function call and instead saw an expression.\npods/dashboards/show/controller.js: line 178, col 36, \'response\' is defined but never used.\npods/dashboards/show/controller.js: line 180, col 22, \'variables\' is defined but never used.\npods/dashboards/show/controller.js: line 197, col 45, \'response\' is defined but never used.\npods/dashboards/show/controller.js: line 153, col 26, \'$\' is not defined.\npods/dashboards/show/controller.js: line 166, col 26, \'$\' is not defined.\npods/dashboards/show/controller.js: line 194, col 13, \'$\' is not defined.\npods/dashboards/show/controller.js: line 208, col 13, \'$\' is not defined.\n\n8 errors');
  });
});
define('frontend/tests/pods/dashboards/show/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/dashboards/show/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/dashboards/show/route.js should pass jshint.\npods/dashboards/show/route.js: line 24, col 33, \'model\' is defined but never used.\npods/dashboards/show/route.js: line 28, col 23, \'transition\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/data-references/databases/all/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/all/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/data-references/databases/all/controller.js should pass jshint.\npods/data-references/databases/all/controller.js: line 7, col 41, Missing semicolon.\npods/data-references/databases/all/controller.js: line 12, col 35, \'response\' is defined but never used.\npods/data-references/databases/all/controller.js: line 18, col 15, Missing semicolon.\n\n3 errors');
  });
});
define('frontend/tests/pods/data-references/databases/all/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/all/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/data-references/databases/all/route.js should pass jshint.\npods/data-references/databases/all/route.js: line 2, col 71, Missing semicolon.\npods/data-references/databases/all/route.js: line 6, col 46, Missing semicolon.\n\n2 errors');
  });
});
define('frontend/tests/pods/data-references/databases/show/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/show/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/data-references/databases/show/controller.js should pass jshint.');
  });
});
define('frontend/tests/pods/data-references/databases/show/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/show/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/data-references/databases/show/route.js should pass jshint.\npods/data-references/databases/show/route.js: line 2, col 71, Missing semicolon.\npods/data-references/databases/show/route.js: line 7, col 126, Missing semicolon.\n\n2 errors');
  });
});
define('frontend/tests/pods/data-references/databases/show/tables/all/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/show/tables/all/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/data-references/databases/show/tables/all/controller.js should pass jshint.\npods/data-references/databases/show/tables/all/controller.js: line 7, col 41, Missing semicolon.\npods/data-references/databases/show/tables/all/controller.js: line 10, col 38, Missing semicolon.\npods/data-references/databases/show/tables/all/controller.js: line 13, col 113, Missing semicolon.\npods/data-references/databases/show/tables/all/controller.js: line 14, col 36, Missing semicolon.\npods/data-references/databases/show/tables/all/controller.js: line 24, col 32, \'response\' is defined but never used.\npods/data-references/databases/show/tables/all/controller.js: line 26, col 15, Missing semicolon.\n\n6 errors');
  });
});
define('frontend/tests/pods/data-references/databases/show/tables/all/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/show/tables/all/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/data-references/databases/show/tables/all/route.js should pass jshint.\npods/data-references/databases/show/tables/all/route.js: line 2, col 71, Missing semicolon.\npods/data-references/databases/show/tables/all/route.js: line 6, col 32, \'model\' is defined but never used.\npods/data-references/databases/show/tables/all/route.js: line 14, col 43, \'model\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/data-references/databases/show/tables/show/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/show/tables/show/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/data-references/databases/show/tables/show/controller.js should pass jshint.\npods/data-references/databases/show/tables/show/controller.js: line 8, col 41, Missing semicolon.\npods/data-references/databases/show/tables/show/controller.js: line 11, col 38, Missing semicolon.\npods/data-references/databases/show/tables/show/controller.js: line 14, col 113, Missing semicolon.\npods/data-references/databases/show/tables/show/controller.js: line 15, col 36, Missing semicolon.\npods/data-references/databases/show/tables/show/controller.js: line 25, col 33, \'response\' is defined but never used.\npods/data-references/databases/show/tables/show/controller.js: line 27, col 15, Missing semicolon.\n\n6 errors');
  });
});
define('frontend/tests/pods/data-references/databases/show/tables/show/explore/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/show/tables/show/explore/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/data-references/databases/show/tables/show/explore/controller.js should pass jshint.\npods/data-references/databases/show/tables/show/explore/controller.js: line 2, col 79, Missing semicolon.\npods/data-references/databases/show/tables/show/explore/controller.js: line 3, col 43, Missing semicolon.\npods/data-references/databases/show/tables/show/explore/controller.js: line 4, col 64, Missing semicolon.\npods/data-references/databases/show/tables/show/explore/controller.js: line 24, col 11, Missing semicolon.\npods/data-references/databases/show/tables/show/explore/controller.js: line 28, col 42, Missing semicolon.\npods/data-references/databases/show/tables/show/explore/controller.js: line 31, col 3, Missing semicolon.\npods/data-references/databases/show/tables/show/explore/controller.js: line 3, col 8, \'ShowController\' is defined but never used.\n\n7 errors');
  });
});
define('frontend/tests/pods/data-references/databases/show/tables/show/explore/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/show/tables/show/explore/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/data-references/databases/show/tables/show/explore/route.js should pass jshint.\npods/data-references/databases/show/tables/show/explore/route.js: line 2, col 69, Missing semicolon.\npods/data-references/databases/show/tables/show/explore/route.js: line 6, col 32, \'model\' is defined but never used.\npods/data-references/databases/show/tables/show/explore/route.js: line 13, col 43, \'model\' is defined but never used.\npods/data-references/databases/show/tables/show/explore/route.js: line 17, col 3, Missing semicolon.\npods/data-references/databases/show/tables/show/explore/route.js: line 1, col 8, \'Ember\' is defined but never used.\n\n5 errors');
  });
});
define('frontend/tests/pods/data-references/databases/show/tables/show/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/data-references/databases/show/tables/show/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/data-references/databases/show/tables/show/route.js should pass jshint.\npods/data-references/databases/show/tables/show/route.js: line 2, col 71, Missing semicolon.\npods/data-references/databases/show/tables/show/route.js: line 6, col 57, Missing semicolon.\n\n2 errors');
  });
});
define('frontend/tests/pods/explore/new/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/explore/new/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/explore/new/controller.js should pass jshint.\npods/explore/new/controller.js: line 20, col 23, \'status\' is defined but never used.\npods/explore/new/controller.js: line 25, col 20, \'status\' is defined but never used.\npods/explore/new/controller.js: line 25, col 13, \'error\' is defined but never used.\npods/explore/new/controller.js: line 34, col 87, Expected an assignment or function call and instead saw an expression.\npods/explore/new/controller.js: line 35, col 86, Expected an assignment or function call and instead saw an expression.\n\n5 errors');
  });
});
define('frontend/tests/pods/explore/new/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/explore/new/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/explore/new/route.js should pass jshint.\npods/explore/new/route.js: line 14, col 27, \'status\' is defined but never used.\npods/explore/new/route.js: line 16, col 24, \'status\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/funnel-chart/component.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/funnel-chart/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/funnel-chart/component.js should pass jshint.\npods/funnel-chart/component.js: line 25, col 13, \'_this\' is defined but never used.\npods/funnel-chart/component.js: line 3, col 5, \'get\' is defined but never used.\npods/funnel-chart/component.js: line 4, col 5, \'arrayComputed\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/index/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/index/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/index/route.js should pass jshint.\npods/index/route.js: line 2, col 71, Missing semicolon.\npods/index/route.js: line 6, col 43, Missing semicolon.\n\n2 errors');
  });
});
define('frontend/tests/pods/loading/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/loading/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/loading/controller.js should pass jshint.\npods/loading/controller.js: line 2, col 63, Missing semicolon.\n\n1 error');
  });
});
define('frontend/tests/pods/loading/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/loading/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/loading/route.js should pass jshint.');
  });
});
define('frontend/tests/pods/login/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/login/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/login/controller.js should pass jshint.\npods/login/controller.js: line 18, col 48, Missing semicolon.\npods/login/controller.js: line 17, col 26, \'status\' is defined but never used.\npods/login/controller.js: line 19, col 23, \'status\' is defined but never used.\npods/login/controller.js: line 19, col 16, \'error\' is defined but never used.\n\n4 errors');
  });
});
define('frontend/tests/pods/login/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/login/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/login/route.js should pass jshint.');
  });
});
define('frontend/tests/pods/questions/all/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/all/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/all/controller.js should pass jshint.\npods/questions/all/controller.js: line 13, col 30, Expected \'!==\' and instead saw \'!=\'.\npods/questions/all/controller.js: line 26, col 10, Expected an assignment or function call and instead saw an expression.\n\n2 errors');
  });
});
define('frontend/tests/pods/questions/all/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/all/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/all/route.js should pass jshint.\npods/questions/all/route.js: line 9, col 23, \'transition\' is defined but never used.\npods/questions/all/route.js: line 9, col 16, \'model\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/questions/new/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/new/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/new/controller.js should pass jshint.\npods/questions/new/controller.js: line 78, col 34, Expected \'!==\' and instead saw \'!=\'.\npods/questions/new/controller.js: line 87, col 36, Expected \'!==\' and instead saw \'!=\'.\npods/questions/new/controller.js: line 95, col 37, Expected \'!==\' and instead saw \'!=\'.\npods/questions/new/controller.js: line 106, col 25, Expected \'===\' and instead saw \'==\'.\npods/questions/new/controller.js: line 131, col 87, Expected \'===\' and instead saw \'==\'.\npods/questions/new/controller.js: line 163, col 27, Expected \'!==\' and instead saw \'!=\'.\npods/questions/new/controller.js: line 163, col 51, Expected \'!==\' and instead saw \'!=\'.\npods/questions/new/controller.js: line 192, col 23, \'status\' is defined but never used.\npods/questions/new/controller.js: line 212, col 14, Expected an assignment or function call and instead saw an expression.\npods/questions/new/controller.js: line 208, col 20, \'status\' is defined but never used.\npods/questions/new/controller.js: line 162, col 13, \'changedAttributes\' is defined but never used.\npods/questions/new/controller.js: line 235, col 29, Expected \'===\' and instead saw \'==\'.\npods/questions/new/controller.js: line 238, col 52, Expected an assignment or function call and instead saw an expression.\npods/questions/new/controller.js: line 243, col 86, Expected an assignment or function call and instead saw an expression.\npods/questions/new/controller.js: line 267, col 82, Expected \'===\' and instead saw \'==\'.\npods/questions/new/controller.js: line 273, col 26, \'variable\' is defined but never used.\npods/questions/new/controller.js: line 301, col 27, \'status\' is defined but never used.\npods/questions/new/controller.js: line 301, col 17, \'response\' is defined but never used.\npods/questions/new/controller.js: line 311, col 24, \'status\' is defined but never used.\npods/questions/new/controller.js: line 311, col 17, \'error\' is defined but never used.\npods/questions/new/controller.js: line 345, col 90, Expected an assignment or function call and instead saw an expression.\npods/questions/new/controller.js: line 348, col 90, Expected an assignment or function call and instead saw an expression.\npods/questions/new/controller.js: line 259, col 21, \'$\' is not defined.\npods/questions/new/controller.js: line 1, col 1, \'pushObject\' is defined but never used.\n\n24 errors');
  });
});
define('frontend/tests/pods/questions/new/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/new/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/questions/new/route.js should pass jshint.');
  });
});
define('frontend/tests/pods/questions/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/route.js should pass jshint.\npods/questions/route.js: line 2, col 71, Missing semicolon.\n\n1 error');
  });
});
define('frontend/tests/pods/questions/show/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/show/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/show/controller.js should pass jshint.\npods/questions/show/controller.js: line 38, col 54, Expected an assignment or function call and instead saw an expression.\npods/questions/show/controller.js: line 27, col 13, \'$\' is not defined.\npods/questions/show/controller.js: line 48, col 17, \'$\' is not defined.\n\n3 errors');
  });
});
define('frontend/tests/pods/questions/show/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/show/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/show/route.js should pass jshint.\npods/questions/show/route.js: line 12, col 23, \'transition\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/pods/questions/show/snapshots/all/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/show/snapshots/all/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/show/snapshots/all/controller.js should pass jshint.\npods/questions/show/snapshots/all/controller.js: line 8, col 31, Expected \'===\' and instead saw \'==\'.\n\n1 error');
  });
});
define('frontend/tests/pods/questions/show/snapshots/all/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/show/snapshots/all/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/show/snapshots/all/route.js should pass jshint.\npods/questions/show/snapshots/all/route.js: line 15, col 32, \'model\' is defined but never used.\npods/questions/show/snapshots/all/route.js: line 26, col 43, \'model\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/questions/show/snapshots/show/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/show/snapshots/show/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/show/snapshots/show/controller.js should pass jshint.\npods/questions/show/snapshots/show/controller.js: line 3, col 60, Missing semicolon.\npods/questions/show/snapshots/show/controller.js: line 4, col 64, Missing semicolon.\npods/questions/show/snapshots/show/controller.js: line 14, col 45, Missing semicolon.\npods/questions/show/snapshots/show/controller.js: line 16, col 10, Missing semicolon.\npods/questions/show/snapshots/show/controller.js: line 21, col 70, Missing semicolon.\npods/questions/show/snapshots/show/controller.js: line 26, col 26, \'status\' is defined but never used.\npods/questions/show/snapshots/show/controller.js: line 26, col 16, \'response\' is defined but never used.\npods/questions/show/snapshots/show/controller.js: line 33, col 23, \'status\' is defined but never used.\npods/questions/show/snapshots/show/controller.js: line 33, col 16, \'error\' is defined but never used.\npods/questions/show/snapshots/show/controller.js: line 39, col 15, Missing semicolon.\n\n10 errors');
  });
});
define('frontend/tests/pods/questions/show/snapshots/show/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/questions/show/snapshots/show/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/questions/show/snapshots/show/route.js should pass jshint.\npods/questions/show/snapshots/show/route.js: line 7, col 69, Missing semicolon.\npods/questions/show/snapshots/show/route.js: line 21, col 32, \'model\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/settings/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/settings/controller.js should pass jshint.');
  });
});
define('frontend/tests/pods/settings/databases/edit/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/databases/edit/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/databases/edit/controller.js should pass jshint.\npods/settings/databases/edit/controller.js: line 19, col 24, \'response\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/pods/settings/databases/edit/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/databases/edit/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/databases/edit/route.js should pass jshint.\npods/settings/databases/edit/route.js: line 11, col 44, \'model\' is defined but never used.\npods/settings/databases/edit/route.js: line 11, col 32, \'controller\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/settings/databases/index/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/databases/index/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/databases/index/controller.js should pass jshint.\npods/settings/databases/index/controller.js: line 18, col 44, \'database\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/pods/settings/databases/index/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/databases/index/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/databases/index/route.js should pass jshint.\npods/settings/databases/index/route.js: line 2, col 71, Missing semicolon.\npods/settings/databases/index/route.js: line 6, col 46, Missing semicolon.\npods/settings/databases/index/route.js: line 8, col 44, \'model\' is defined but never used.\npods/settings/databases/index/route.js: line 8, col 32, \'controller\' is defined but never used.\n\n4 errors');
  });
});
define('frontend/tests/pods/settings/databases/new/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/databases/new/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/databases/new/controller.js should pass jshint.\npods/settings/databases/new/controller.js: line 29, col 24, \'response\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/pods/settings/databases/new/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/databases/new/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/databases/new/route.js should pass jshint.\npods/settings/databases/new/route.js: line 2, col 71, Missing semicolon.\npods/settings/databases/new/route.js: line 5, col 43, \'model\' is defined but never used.\npods/settings/databases/new/route.js: line 5, col 31, \'controller\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/settings/email/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/email/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/email/route.js should pass jshint.\npods/settings/email/route.js: line 4, col 43, \'model\' is defined but never used.\npods/settings/email/route.js: line 4, col 31, \'controller\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/settings/permissions/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/permissions/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/settings/permissions/controller.js should pass jshint.');
  });
});
define('frontend/tests/pods/settings/permissions/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/permissions/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/permissions/route.js should pass jshint.\npods/settings/permissions/route.js: line 5, col 52, Missing semicolon.\npods/settings/permissions/route.js: line 7, col 43, \'model\' is defined but never used.\npods/settings/permissions/route.js: line 7, col 31, \'controller\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/settings/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/route.js should pass jshint.\npods/settings/route.js: line 2, col 71, Missing semicolon.\npods/settings/route.js: line 19, col 43, \'model\' is defined but never used.\npods/settings/route.js: line 19, col 31, \'controller\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/settings/sms/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/sms/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/sms/route.js should pass jshint.\npods/settings/sms/route.js: line 4, col 43, \'model\' is defined but never used.\npods/settings/sms/route.js: line 4, col 31, \'controller\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/settings/teams/edit/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/teams/edit/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/teams/edit/controller.js should pass jshint.\npods/settings/teams/edit/controller.js: line 77, col 24, \'response\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/pods/settings/teams/edit/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/teams/edit/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/teams/edit/route.js should pass jshint.\npods/settings/teams/edit/route.js: line 8, col 44, \'model\' is defined but never used.\npods/settings/teams/edit/route.js: line 8, col 32, \'controller\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/settings/teams/index/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/teams/index/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/teams/index/controller.js should pass jshint.\npods/settings/teams/index/controller.js: line 18, col 40, \'team\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/pods/settings/teams/index/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/teams/index/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/teams/index/route.js should pass jshint.\npods/settings/teams/index/route.js: line 2, col 71, Missing semicolon.\npods/settings/teams/index/route.js: line 6, col 42, Missing semicolon.\npods/settings/teams/index/route.js: line 9, col 44, \'model\' is defined but never used.\npods/settings/teams/index/route.js: line 9, col 32, \'controller\' is defined but never used.\n\n4 errors');
  });
});
define('frontend/tests/pods/settings/teams/new/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/teams/new/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/teams/new/controller.js should pass jshint.\npods/settings/teams/new/controller.js: line 5, col 51, Missing semicolon.\npods/settings/teams/new/controller.js: line 14, col 15, Missing semicolon.\n\n2 errors');
  });
});
define('frontend/tests/pods/settings/teams/new/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/teams/new/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/teams/new/route.js should pass jshint.\npods/settings/teams/new/route.js: line 2, col 71, Missing semicolon.\npods/settings/teams/new/route.js: line 5, col 44, \'model\' is defined but never used.\npods/settings/teams/new/route.js: line 5, col 32, \'controller\' is defined but never used.\npods/settings/teams/new/route.js: line 12, col 51, Missing semicolon.\npods/settings/teams/new/route.js: line 14, col 37, Missing semicolon.\npods/settings/teams/new/route.js: line 11, col 24, \'transition\' is defined but never used.\n\n6 errors');
  });
});
define('frontend/tests/pods/settings/users/edit/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/users/edit/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/users/edit/controller.js should pass jshint.\npods/settings/users/edit/controller.js: line 25, col 31, \'user\' is defined but never used.\n\n1 error');
  });
});
define('frontend/tests/pods/settings/users/edit/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/users/edit/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/users/edit/route.js should pass jshint.\npods/settings/users/edit/route.js: line 8, col 44, \'model\' is defined but never used.\npods/settings/users/edit/route.js: line 8, col 32, \'controller\' is defined but never used.\n\n2 errors');
  });
});
define('frontend/tests/pods/settings/users/index/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/users/index/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/settings/users/index/controller.js should pass jshint.');
  });
});
define('frontend/tests/pods/settings/users/index/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/settings/users/index/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/settings/users/index/route.js should pass jshint.\npods/settings/users/index/route.js: line 5, col 42, Missing semicolon.\npods/settings/users/index/route.js: line 7, col 43, \'model\' is defined but never used.\npods/settings/users/index/route.js: line 7, col 31, \'controller\' is defined but never used.\n\n3 errors');
  });
});
define('frontend/tests/pods/tags/show/controller.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/tags/show/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/tags/show/controller.js should pass jshint.\npods/tags/show/controller.js: line 2, col 67, Missing semicolon.\npods/tags/show/controller.js: line 8, col 58, Missing semicolon.\npods/tags/show/controller.js: line 11, col 65, Missing semicolon.\npods/tags/show/controller.js: line 14, col 38, Missing semicolon.\npods/tags/show/controller.js: line 15, col 45, Missing semicolon.\npods/tags/show/controller.js: line 16, col 31, Expected \'!==\' and instead saw \'!=\'.\npods/tags/show/controller.js: line 17, col 92, Missing semicolon.\npods/tags/show/controller.js: line 19, col 49, Missing semicolon.\n\n8 errors');
  });
});
define('frontend/tests/pods/tags/show/route.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | pods/tags/show/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'pods/tags/show/route.js should pass jshint.\npods/tags/show/route.js: line 2, col 71, Missing semicolon.\npods/tags/show/route.js: line 6, col 42, Missing semicolon.\npods/tags/show/route.js: line 7, col 53, Missing semicolon.\npods/tags/show/route.js: line 12, col 43, \'model\' is defined but never used.\n\n4 errors');
  });
});
define('frontend/tests/resolver.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass jshint.');
  });
});
define('frontend/tests/router.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('frontend/tests/services/ajax.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | services/ajax.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/ajax.js should pass jshint.\nservices/ajax.js: line 20, col 80, Expected an assignment or function call and instead saw an expression.\n\n1 error');
  });
});
define('frontend/tests/services/session-service.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | services/session-service.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/session-service.js should pass jshint.');
  });
});
define('frontend/tests/test-helper', ['exports', 'frontend/tests/helpers/resolver', 'frontend/tests/helpers/responsive', 'ember-qunit'], function (exports, _frontendTestsHelpersResolver, _frontendTestsHelpersResponsive, _emberQunit) {

  (0, _emberQunit.setResolver)(_frontendTestsHelpersResolver['default']);
});
define('frontend/tests/test-helper.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | test-helper.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('frontend/tests/transforms/array.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | transforms/array.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'transforms/array.js should pass jshint.\ntransforms/array.js: line 19, col 3, Missing semicolon.\ntransforms/array.js: line 6, col 13, \'Ember\' is not defined.\ntransforms/array.js: line 13, col 13, \'Ember\' is not defined.\ntransforms/array.js: line 7, col 20, \'Em\' is not defined.\ntransforms/array.js: line 9, col 20, \'Em\' is not defined.\ntransforms/array.js: line 14, col 20, \'Em\' is not defined.\ntransforms/array.js: line 16, col 20, \'Em\' is not defined.\n\n7 errors');
  });
});
define('frontend/tests/transforms/key-value-array.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | transforms/key-value-array.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'transforms/key-value-array.js should pass jshint.\ntransforms/key-value-array.js: line 5, col 14, \'$\' is not defined.\ntransforms/key-value-array.js: line 9, col 24, \'Ember\' is not defined.\n\n2 errors');
  });
});
define('frontend/tests/transforms/object.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | transforms/object.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'transforms/object.js should pass jshint.\ntransforms/object.js: line 5, col 14, \'$\' is not defined.\ntransforms/object.js: line 8, col 20, \'Ember\' is not defined.\n\n2 errors');
  });
});
define('frontend/tests/transforms/query-object.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | transforms/query-object.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/query-object.js should pass jshint.');
  });
});
define('frontend/tests/transforms/utc.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | transforms/utc.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'transforms/utc.js should pass jshint.\ntransforms/utc.js: line 9, col 16, \'moment\' is not defined.\n\n1 error');
  });
});
define('frontend/tests/unit/helpers/capitalize-test', ['exports', 'frontend/helpers/capitalize', 'qunit'], function (exports, _frontendHelpersCapitalize, _qunit) {

  (0, _qunit.module)('Unit | Helper | capitalize');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _frontendHelpersCapitalize.capitalize)([42]);
    assert.ok(result);
  });
});
define('frontend/tests/unit/helpers/capitalize-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/helpers/capitalize-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/capitalize-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/helpers/format-object-test', ['exports', 'frontend/helpers/format-object', 'qunit'], function (exports, _frontendHelpersFormatObject, _qunit) {

  (0, _qunit.module)('Unit | Helper | format object');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _frontendHelpersFormatObject.formatObject)([42]);
    assert.ok(result);
  });
});
define('frontend/tests/unit/helpers/format-object-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/helpers/format-object-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/format-object-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/helpers/get-chart-icon-test', ['exports', 'frontend/helpers/get-chart-icon', 'qunit'], function (exports, _frontendHelpersGetChartIcon, _qunit) {

  (0, _qunit.module)('Unit | Helper | get chart icon');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _frontendHelpersGetChartIcon.getChartIcon)([42]);
    assert.ok(result);
  });
});
define('frontend/tests/unit/helpers/get-chart-icon-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/helpers/get-chart-icon-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/get-chart-icon-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/helpers/group-by-test', ['exports', 'frontend/helpers/group-by', 'qunit'], function (exports, _frontendHelpersGroupBy, _qunit) {

  (0, _qunit.module)('Unit | Helper | group by');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _frontendHelpersGroupBy.groupBy)([42]);
    assert.ok(result);
  });
});
define('frontend/tests/unit/helpers/group-by-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/helpers/group-by-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/group-by-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/helpers/localize-test', ['exports', 'frontend/helpers/localize', 'qunit'], function (exports, _frontendHelpersLocalize, _qunit) {

  (0, _qunit.module)('Unit | Helper | localize');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _frontendHelpersLocalize.localize)([42]);
    assert.ok(result);
  });
});
define('frontend/tests/unit/helpers/localize-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/helpers/localize-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/localize-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/helpers/momentize-test', ['exports', 'frontend/helpers/momentize', 'qunit'], function (exports, _frontendHelpersMomentize, _qunit) {

  (0, _qunit.module)('Unit | Helper | momentize');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _frontendHelpersMomentize.momentize)([42]);
    assert.ok(result);
  });
});
define('frontend/tests/unit/helpers/momentize-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/helpers/momentize-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/momentize-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/helpers/question-dashboard-settings-test', ['exports', 'frontend/helpers/question-dashboard-settings', 'qunit'], function (exports, _frontendHelpersQuestionDashboardSettings, _qunit) {

  (0, _qunit.module)('Unit | Helper | question dashboard settings');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _frontendHelpersQuestionDashboardSettings.questionDashboardSettings)([42]);
    assert.ok(result);
  });
});
define('frontend/tests/unit/helpers/question-dashboard-settings-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/helpers/question-dashboard-settings-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/question-dashboard-settings-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/initializers/inject-store-test', ['exports', 'ember', 'frontend/initializers/inject-store', 'qunit', 'frontend/tests/helpers/destroy-app'], function (exports, _ember, _frontendInitializersInjectStore, _qunit, _frontendTestsHelpersDestroyApp) {

  (0, _qunit.module)('Unit | Initializer | inject store', {
    beforeEach: function beforeEach() {
      var _this = this;

      _ember['default'].run(function () {
        _this.application = _ember['default'].Application.create();
        _this.application.deferReadiness();
      });
    },
    afterEach: function afterEach() {
      (0, _frontendTestsHelpersDestroyApp['default'])(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _frontendInitializersInjectStore.initialize)(this.application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('frontend/tests/unit/initializers/inject-store-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/initializers/inject-store-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/inject-store-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/mixins/ace-tools-test', ['exports', '@ember/object', 'frontend/mixins/ace-tools', 'qunit'], function (exports, _emberObject, _frontendMixinsAceTools, _qunit) {

  (0, _qunit.module)('Unit | Mixin | ace tools');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var AceToolsObject = _emberObject['default'].extend(_frontendMixinsAceTools['default']);
    var subject = AceToolsObject.create();
    assert.ok(subject);
  });
});
define('frontend/tests/unit/mixins/ace-tools-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/mixins/ace-tools-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/ace-tools-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/mixins/group-by-test', ['exports', 'ember', 'frontend/mixins/group-by', 'qunit'], function (exports, _ember, _frontendMixinsGroupBy, _qunit) {

  (0, _qunit.module)('Unit | Mixin | group by');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var GroupByObject = _ember['default'].Object.extend(_frontendMixinsGroupBy['default']);
    var subject = GroupByObject.create();
    assert.ok(subject);
  });
});
define('frontend/tests/unit/mixins/group-by-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/mixins/group-by-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/group-by-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/mixins/helper-mixin-test', ['exports', '@ember/object', 'frontend/mixins/helper-mixin', 'qunit'], function (exports, _emberObject, _frontendMixinsHelperMixin, _qunit) {

  (0, _qunit.module)('Unit | Mixin | helper mixin');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var HelperMixinObject = _emberObject['default'].extend(_frontendMixinsHelperMixin['default']);
    var subject = HelperMixinObject.create();
    assert.ok(subject);
  });
});
define('frontend/tests/unit/mixins/helper-mixin-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/mixins/helper-mixin-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/helper-mixin-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/mixins/loading-messages-test', ['exports', 'ember', 'frontend/mixins/loading-messages', 'qunit'], function (exports, _ember, _frontendMixinsLoadingMessages, _qunit) {

  (0, _qunit.module)('Unit | Mixin | loading messages');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var LoadingMessagesObject = _ember['default'].Object.extend(_frontendMixinsLoadingMessages['default']);
    var subject = LoadingMessagesObject.create();
    assert.ok(subject);
  });
});
define('frontend/tests/unit/mixins/loading-messages-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/mixins/loading-messages-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/loading-messages-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/mixins/result-view-mixin-test', ['exports', 'ember', 'frontend/mixins/result-view-mixin', 'qunit'], function (exports, _ember, _frontendMixinsResultViewMixin, _qunit) {

  (0, _qunit.module)('Unit | Mixin | result view mixin');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var ResultViewMixinObject = _ember['default'].Object.extend(_frontendMixinsResultViewMixin['default']);
    var subject = ResultViewMixinObject.create();
    assert.ok(subject);
  });
});
define('frontend/tests/unit/mixins/result-view-mixin-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/mixins/result-view-mixin-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/result-view-mixin-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/mixins/widget-components-test', ['exports', '@ember/object', 'frontend/mixins/widget-components', 'qunit'], function (exports, _emberObject, _frontendMixinsWidgetComponents, _qunit) {

  (0, _qunit.module)('Unit | Mixin | widget components');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var WidgetComponentsObject = _emberObject['default'].extend(_frontendMixinsWidgetComponents['default']);
    var subject = WidgetComponentsObject.create();
    assert.ok(subject);
  });
});
define('frontend/tests/unit/mixins/widget-components-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/mixins/widget-components-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/widget-components-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/alert-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('alert', 'Unit | Model | alert', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/alert-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/alert-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/alert-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/column-value-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('column-value', 'Unit | Model | column value', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/column-value-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/column-value-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/column-value-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/generated-alert-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('generated-alert', 'Unit | Model | generated alert', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/generated-alert-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/generated-alert-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/generated-alert-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/permission-set-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('permission-set', 'Unit | Model | permission set', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/permission-set-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/permission-set-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/permission-set-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/permission-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('permission', 'Unit | Model | permission', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/permission-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/permission-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/permission-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/send-alert-config-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('send-alert-config', 'Unit | Model | send alert config', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/send-alert-config-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/send-alert-config-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/send-alert-config-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/snapshot-datum-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('snapshot-datum', 'Unit | Model | snapshot datum', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/snapshot-datum-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/snapshot-datum-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/snapshot-datum-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/snapshot-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('snapshot', 'Unit | Model | snapshot', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/snapshot-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/snapshot-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/snapshot-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/tag-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('tag', 'Unit | Model | tag', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/tag-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/tag-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/tag-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/models/user-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('user', 'Unit | Model | user', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/models/user-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/models/user-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/user-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/alerts/new/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:alerts/new', 'Unit | Controller | alerts/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/alerts/new/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/alerts/new/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/alerts/new/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/alerts/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:alerts/new', 'Unit | Route | alerts/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/alerts/new/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/alerts/new/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/alerts/new/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/alerts/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:alerts/show', 'Unit | Controller | alerts/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/alerts/show/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/alerts/show/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/alerts/show/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/alerts/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:alerts/show', 'Unit | Route | alerts/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/alerts/show/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/alerts/show/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/alerts/show/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/api/google/callback/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:api/google/callback', 'Unit | Controller | api/google/callback', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/api/google/callback/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/api/google/callback/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/api/google/callback/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/api/google/callback/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:api/google/callback', 'Unit | Route | api/google/callback', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/api/google/callback/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/api/google/callback/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/api/google/callback/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/application/adapter-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });
});
define('frontend/tests/unit/pods/application/adapter-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/application/adapter-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/application/adapter-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/application/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/application/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/application/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/application/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/application/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/application/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/application/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/application/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/application/serializer-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('application', 'Unit | Serializer | application', {
    // Specify the other units that are required for this test.
    needs: ['serializer:application']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
define('frontend/tests/unit/pods/application/serializer-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/application/serializer-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/application/serializer-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/dashboard/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:dashboard/show', 'Unit | Controller | dashboard/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/dashboard/show/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/dashboard/show/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dashboard/show/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/dashboard/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:dashboard/show', 'Unit | Route | dashboard/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/dashboard/show/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/dashboard/show/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dashboard/show/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/dashboards/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:dashboards/show', 'Unit | Controller | dashboards/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/dashboards/show/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/dashboards/show/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dashboards/show/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/dashboards/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:dashboards/show', 'Unit | Route | dashboards/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/dashboards/show/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/dashboards/show/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dashboards/show/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/all/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:data-references/databases/all', 'Unit | Controller | data references/databases/all', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/data-references/databases/all/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/all/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/all/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/all/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:data-references/databases/all', 'Unit | Route | data references/databases/all', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/data-references/databases/all/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/all/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/all/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:data-references/databases/show', 'Unit | Controller | data references/databases/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/show/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/show/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:data-references/databases/show', 'Unit | Route | data references/databases/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/show/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/show/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/all/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:data-references/databases/show/tables/all', 'Unit | Controller | data references/databases/show/tables/all', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/all/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/show/tables/all/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/show/tables/all/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/all/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:data-references/databases/show/tables/all', 'Unit | Route | data references/databases/show/tables/all', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/all/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/show/tables/all/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/show/tables/all/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:data-references/databases/show/tables/show', 'Unit | Controller | data references/databases/show/tables/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/show/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/show/tables/show/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/show/tables/show/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/show/explore/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:data-references/databases/show/tables/show/explore', 'Unit | Controller | data references/databases/show/tables/show/explore', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/show/explore/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/show/tables/show/explore/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/show/tables/show/explore/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/show/explore/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:data-references/databases/show/tables/show/explore', 'Unit | Route | data references/databases/show/tables/show/explore', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/show/explore/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/show/tables/show/explore/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/show/tables/show/explore/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:data-references/databases/show/tables/show', 'Unit | Route | data references/databases/show/tables/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/data-references/databases/show/tables/show/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/data-references/databases/show/tables/show/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/data-references/databases/show/tables/show/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/database/new/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:database/new', 'Unit | Controller | database/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/database/new/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/database/new/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/database/new/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/database/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:database/new', 'Unit | Route | database/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/database/new/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/database/new/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/database/new/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/database/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:database', 'Unit | Route | database', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/database/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/database/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/database/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/explore/new/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:explore/new', 'Unit | Controller | explore/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/explore/new/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/explore/new/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/explore/new/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/explore/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:explore/new', 'Unit | Route | explore/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/explore/new/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/explore/new/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/explore/new/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/index/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/index/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/index/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/loading/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:loading', 'Unit | Controller | loading', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/loading/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/loading/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/loading/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/loading/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:loading', 'Unit | Route | loading', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/loading/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/loading/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/loading/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/login/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:login', 'Unit | Controller | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/login/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/login/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/login/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/login/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:login', 'Unit | Route | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/login/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/login/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/login/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/question/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('question', 'Unit | Model | question', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/pods/question/model-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/question/model-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/question/model-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/all/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:questions/all', 'Unit | Controller | questions/all', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/questions/all/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/all/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/all/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/all/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:questions/all', 'Unit | Route | questions/all', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/questions/all/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/all/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/all/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/new/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:questions/new', 'Unit | Controller | questions/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/questions/new/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/new/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/new/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/new/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('questions/new', 'Unit | Model | questions/new', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/pods/questions/new/model-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/new/model-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/new/model-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:questions/new', 'Unit | Route | questions/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/questions/new/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/new/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/new/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:questions', 'Unit | Route | questions', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/questions/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/shared/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:questions/shared', 'Unit | Route | questions/shared', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/questions/shared/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/shared/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/shared/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:questions/show', 'Unit | Controller | questions/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/questions/show/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/show/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/show/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/show/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('questions/show', 'Unit | Model | questions/show', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('frontend/tests/unit/pods/questions/show/model-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/show/model-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/show/model-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:questions/show', 'Unit | Route | questions/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/questions/show/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/show/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/show/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/snapshots/all/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:questions/snapshots/all', 'Unit | Controller | questions/snapshots/all', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/questions/snapshots/all/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/snapshots/all/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/snapshots/all/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/snapshots/all/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:questions/snapshots/all', 'Unit | Route | questions/snapshots/all', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/questions/snapshots/all/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/snapshots/all/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/snapshots/all/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/snapshots/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:questions/snapshots/show', 'Unit | Controller | questions/snapshots/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/questions/snapshots/show/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/snapshots/show/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/snapshots/show/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/questions/snapshots/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:questions/snapshots/show', 'Unit | Route | questions/snapshots/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/questions/snapshots/show/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/questions/snapshots/show/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/questions/snapshots/show/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:settings', 'Unit | Controller | settings', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/settings/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/databases/index/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:settings/databases/index', 'Unit | Controller | settings/databases/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/settings/databases/index/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/databases/index/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/databases/index/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/email/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:settings/email', 'Unit | Route | settings/email', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/settings/email/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/email/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/email/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/pagerduty/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:settings/pagerduty', 'Unit | Route | settings/pagerduty', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/settings/pagerduty/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/pagerduty/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/pagerduty/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/permissions/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:settings/permissions', 'Unit | Controller | settings/permissions', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/settings/permissions/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/permissions/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/permissions/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/permissions/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:settings/permissions', 'Unit | Route | settings/permissions', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/settings/permissions/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/permissions/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/permissions/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:settings', 'Unit | Route | settings', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/settings/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/sms/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:settings/sms', 'Unit | Route | settings/sms', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/settings/sms/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/sms/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/sms/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/users/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:settings/users', 'Unit | Controller | settings/users', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/settings/users/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/users/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/users/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/settings/users/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:settings/users', 'Unit | Route | settings/users', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/settings/users/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/settings/users/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/users/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/tag/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:tag/show', 'Unit | Controller | tag/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('frontend/tests/unit/pods/tag/show/controller-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/tag/show/controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/tag/show/controller-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/pods/tag/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:tag/show', 'Unit | Route | tag/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/pods/tag/show/route-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/pods/tag/show/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/tag/show/route-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/routes/questions/snapshots/show-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:questions/snapshots/show', 'Unit | Route | questions/snapshots/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('frontend/tests/unit/routes/questions/snapshots/show-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/routes/questions/snapshots/show-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/questions/snapshots/show-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/services/ajax-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:ajax', 'Unit | Service | ajax', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('frontend/tests/unit/services/ajax-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/services/ajax-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/ajax-test.js should pass jshint.');
  });
});
define('frontend/tests/unit/services/session-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:session', 'Unit | Service | session', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('frontend/tests/unit/services/session-test.jshint.lint-test', [], function () {
  'use strict';

  QUnit.module('JSHint | unit/services/session-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/session-test.js should pass jshint.');
  });
});
require('frontend/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
