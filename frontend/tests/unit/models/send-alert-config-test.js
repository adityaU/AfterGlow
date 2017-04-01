import { moduleForModel, test } from 'ember-qunit';

moduleForModel('send-alert-config', 'Unit | Model | send alert config', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
