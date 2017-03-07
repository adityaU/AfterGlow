import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('base-chart-settings', 'Integration | Component | base chart settings', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{base-chart-settings}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#base-chart-settings}}
      template block text
    {{/base-chart-settings}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
