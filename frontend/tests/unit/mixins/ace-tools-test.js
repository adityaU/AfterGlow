import EmberObject from '@ember/object';
import AceToolsMixin from 'frontend/mixins/ace-tools';
import { module, test } from 'qunit';

module('Unit | Mixin | ace tools');

// Replace this with your real tests.
test('it works', function(assert) {
  let AceToolsObject = EmberObject.extend(AceToolsMixin);
  let subject = AceToolsObject.create();
  assert.ok(subject);
});
