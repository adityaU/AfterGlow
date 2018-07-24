import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('snapshot-stop-confirmation', 'Integration | Component | snapshot stop confirmation', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{snapshot-stop-confirmation}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#snapshot-stop-confirmation}}
      template block text
    {{/snapshot-stop-confirmation}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
