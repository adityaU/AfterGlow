import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/demo/ratings-widget', 'Integration | Component | widgets/demo/ratings widget', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/demo/ratings-widget}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/demo/ratings-widget}}
      template block text
    {{/widgets/demo/ratings-widget}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
