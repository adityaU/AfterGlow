import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('keyboard-shortcuts-help', 'Integration | Component | keyboard shortcuts help', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{keyboard-shortcuts-help}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#keyboard-shortcuts-help}}
      template block text
    {{/keyboard-shortcuts-help}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
