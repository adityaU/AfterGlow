import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('variable-value-selector', 'Integration | Component | variable value selector', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{variable-value-selector}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#variable-value-selector}}
      template block text
    {{/variable-value-selector}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
