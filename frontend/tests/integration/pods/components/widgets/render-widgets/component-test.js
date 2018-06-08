import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/render-widgets', 'Integration | Component | widgets/render widgets', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/render-widgets}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/render-widgets}}
      template block text
    {{/widgets/render-widgets}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
