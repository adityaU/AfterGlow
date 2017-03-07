import Ember from 'ember';
import GroupByMixin from 'frontend/mixins/group-by';
import { module, test } from 'qunit';

module('Unit | Mixin | group by');

// Replace this with your real tests.
test('it works', function(assert) {
  let GroupByObject = Ember.Object.extend(GroupByMixin);
  let subject = GroupByObject.create();
  assert.ok(subject);
});
