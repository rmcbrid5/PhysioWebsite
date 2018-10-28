import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('register-physiotherapist', 'Integration | Component | register physiotherapist', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{register-physiotherapist}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#register-physiotherapist}}
      template block text
    {{/register-physiotherapist}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
