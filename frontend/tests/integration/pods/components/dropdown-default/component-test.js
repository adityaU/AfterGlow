import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dropdown-default', 'Integration | Component | dropdown default', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{dropdown-default}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#dropdown-default}}
      template block text
    {{/dropdown-default}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
