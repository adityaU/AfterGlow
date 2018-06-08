import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/editable/suffix-widget', 'Integration | Component | widgets/editable/suffix widget', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/editable/suffix-widget}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/editable/suffix-widget}}
      template block text
    {{/widgets/editable/suffix-widget}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
