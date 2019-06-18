import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('is-order-applied', 'helper:is-order-applied', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{is-order-applied inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});
