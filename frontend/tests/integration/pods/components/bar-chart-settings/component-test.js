import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bar-chart-settings', 'Integration | Component | bar chart settings', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bar-chart-settings}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#bar-chart-settings}}
      template block text
    {{/bar-chart-settings}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
