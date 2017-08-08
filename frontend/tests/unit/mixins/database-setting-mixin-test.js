import Ember from 'ember';
import DatabaseSettingMixinMixin from 'frontend/mixins/database-setting-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | database setting mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let DatabaseSettingMixinObject = Ember.Object.extend(DatabaseSettingMixinMixin);
  let subject = DatabaseSettingMixinObject.create();
  assert.ok(subject);
});
