import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('limited-query-accordian', 'Integration | Component | limited query accordian', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{limited-query-accordian}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#limited-query-accordian}}
      template block text
    {{/limited-query-accordian}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
