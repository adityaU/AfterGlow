import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/editable/row-color', 'Integration | Component | widgets/editable/row color', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/editable/row-color}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/editable/row-color}}
      template block text
    {{/widgets/editable/row-color}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
