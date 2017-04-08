import Ember from 'ember';
import LoadingMessagesMixin from 'frontend/mixins/loading-messages';
import { module, test } from 'qunit';

module('Unit | Mixin | loading messages');

// Replace this with your real tests.
test('it works', function(assert) {
  let LoadingMessagesObject = Ember.Object.extend(LoadingMessagesMixin);
  let subject = LoadingMessagesObject.create();
  assert.ok(subject);
});
