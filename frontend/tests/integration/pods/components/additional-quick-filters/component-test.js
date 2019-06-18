import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('additional-quick-filters', 'Integration | Component | additional quick filters', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{additional-quick-filters}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#additional-quick-filters}}
      template block text
    {{/additional-quick-filters}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
