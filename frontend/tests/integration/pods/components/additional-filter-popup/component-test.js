import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('additional-filter-popup', 'Integration | Component | additional filter popup', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{additional-filter-popup}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#additional-filter-popup}}
      template block text
    {{/additional-filter-popup}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
