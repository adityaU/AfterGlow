import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/icon-and-text', 'Integration | Component | widgets/icon and text', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/icon-and-text}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/icon-and-text}}
      template block text
    {{/widgets/icon-and-text}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
