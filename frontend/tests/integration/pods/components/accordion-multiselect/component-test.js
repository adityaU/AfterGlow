import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('accordion-multiselect', 'Integration | Component | accordion multiselect', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{accordion-multiselect}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#accordion-multiselect}}
      template block text
    {{/accordion-multiselect}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
