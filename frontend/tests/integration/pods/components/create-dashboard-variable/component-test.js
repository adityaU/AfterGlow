import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('create-dashboard-variable', 'Integration | Component | create dashboard variable', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{create-dashboard-variable}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#create-dashboard-variable}}
      template block text
    {{/create-dashboard-variable}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
