import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widgets/demo/circular-progress-bar', 'Integration | Component | widgets/demo/circular progress bar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widgets/demo/circular-progress-bar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widgets/demo/circular-progress-bar}}
      template block text
    {{/widgets/demo/circular-progress-bar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
