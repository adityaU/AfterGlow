import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/editable/row-border', 'Integration | Component | widgets/editable/row border', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/editable/row-border}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/editable/row-border}}
      template block text
    {{/widgets/editable/row-border}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
