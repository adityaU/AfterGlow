import EmberObject from '@ember/object';
import HelperMixinMixin from 'frontend/mixins/helper-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | helper mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let HelperMixinObject = EmberObject.extend(HelperMixinMixin);
  let subject = HelperMixinObject.create();
  assert.ok(subject);
});
