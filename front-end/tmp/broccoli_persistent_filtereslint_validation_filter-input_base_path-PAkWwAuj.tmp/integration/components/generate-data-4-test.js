import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('generate-data-4', 'Integration | Component | generate data 4', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{generate-data-4}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#generate-data-4}}
      template block text
    {{/generate-data-4}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
