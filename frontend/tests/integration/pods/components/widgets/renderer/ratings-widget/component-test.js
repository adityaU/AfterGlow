import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/renderer/ratings-widget', 'Integration | Component | widgets/renderer/ratings widget', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/renderer/ratings-widget}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/renderer/ratings-widget}}
      template block text
    {{/widgets/renderer/ratings-widget}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
