QUnit.test('components/complete-test.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/complete-test.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n13:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n13:16 - \'Ember\' is not defined. (no-undef)\n59:19 - \'table\' is assigned a value but never used. (no-unused-vars)');
});
