import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('snapshot-creator', 'Integration | Component | snapshot creator', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{snapshot-creator}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#snapshot-creator}}
      template block text
    {{/snapshot-creator}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
