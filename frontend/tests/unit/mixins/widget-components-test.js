import EmberObject from '@ember/object';
import WidgetComponentsMixin from 'frontend/mixins/widget-components';
import { module, test } from 'qunit';

module('Unit | Mixin | widget components');

// Replace this with your real tests.
test('it works', function(assert) {
  let WidgetComponentsObject = EmberObject.extend(WidgetComponentsMixin);
  let subject = WidgetComponentsObject.create();
  assert.ok(subject);
});
