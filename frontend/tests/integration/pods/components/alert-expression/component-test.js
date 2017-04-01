import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('alert-expression', 'Integration | Component | alert expression', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{alert-expression}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#alert-expression}}
      template block text
    {{/alert-expression}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
