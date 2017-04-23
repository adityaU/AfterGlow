import Ember from 'ember';
import ResultViewMixinMixin from 'frontend/mixins/result-view-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | result view mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let ResultViewMixinObject = Ember.Object.extend(ResultViewMixinMixin);
  let subject = ResultViewMixinObject.create();
  assert.ok(subject);
});
