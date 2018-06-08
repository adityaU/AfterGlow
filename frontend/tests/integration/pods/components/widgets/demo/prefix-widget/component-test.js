import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/demo/prefix-widget', 'Integration | Component | widgets/demo/prefix widget', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/demo/prefix-widget}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/demo/prefix-widget}}
      template block text
    {{/widgets/demo/prefix-widget}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
