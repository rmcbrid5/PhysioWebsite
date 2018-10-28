import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('modify-physio-profile', 'Integration | Component | modify physio profile', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{modify-physio-profile}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#modify-physio-profile}}
      template block text
    {{/modify-physio-profile}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
