import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/demo/row-color', 'Integration | Component | widgets/demo/row color', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/demo/row-color}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/demo/row-color}}
      template block text
    {{/widgets/demo/row-color}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
