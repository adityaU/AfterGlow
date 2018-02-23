import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('variables-replaced-query-accordian', 'Integration | Component | variables replaced query accordian', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{variables-replaced-query-accordian}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#variables-replaced-query-accordian}}
      template block text
    {{/variables-replaced-query-accordian}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
