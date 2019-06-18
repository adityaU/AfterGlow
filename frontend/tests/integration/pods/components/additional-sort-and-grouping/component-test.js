import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('additional-sort-and-grouping', 'Integration | Component | additional sort and grouping', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{additional-sort-and-grouping}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#additional-sort-and-grouping}}
      template block text
    {{/additional-sort-and-grouping}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
