import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('change-user-permissions-dialogue', 'Integration | Component | change user permissions dialogue', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{change-user-permissions-dialogue}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#change-user-permissions-dialogue}}
      template block text
    {{/change-user-permissions-dialogue}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
