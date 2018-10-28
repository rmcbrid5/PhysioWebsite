QUnit.module('ESLint | app');

QUnit.test('adapters/application.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
});

QUnit.test('app.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'app.js should pass ESLint\n\n');
});

QUnit.test('components/add-exercise.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/add-exercise.js should pass ESLint\n\n14:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n15:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
});

QUnit.test('components/add-form.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/add-form.js should pass ESLint\n\n74:40 - \'objModel\' is not defined. (no-undef)');
});

QUnit.test('components/add-injury-form.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'components/add-injury-form.js should pass ESLint\n\n');
});

QUnit.test('components/add-new-plan.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/add-new-plan.js should pass ESLint\n\n83:29 - \'i\' is already defined. (no-redeclare)\n100:29 - \'i\' is already defined. (no-redeclare)');
});

QUnit.test('components/add-question.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'components/add-question.js should pass ESLint\n\n');
});

QUnit.test('components/appt-button.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/appt-button.js should pass ESLint\n\n6:5 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n6:5 - \'$\' is not defined. (no-undef)\n7:11 - \'table\' is assigned a value but never used. (no-unused-vars)\n7:19 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n7:19 - \'$\' is not defined. (no-undef)');
});

QUnit.test('components/assessment-test-dropdown.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/assessment-test-dropdown.js should pass ESLint\n\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:12 - \'Ember\' is not defined. (no-undef)\n5:26 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n5:26 - \'Ember\' is not defined. (no-undef)\n25:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
});

QUnit.test('components/assign-plan.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/assign-plan.js should pass ESLint\n\n89:25 - \'physiotherapistIds\' is assigned a value but never used. (no-unused-vars)\n176:9 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/authenticate-user.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/authenticate-user.js should pass ESLint\n\n4:12 - \'Ember\' is not defined. (no-undef)\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n5:9 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n5:9 - \'Ember\' is not defined. (no-undef)\n7:12 - Use import { oneWay } from \'@ember/object/computed\'; instead of using Ember.computed.oneWay (ember/new-module-imports)\n7:12 - \'Ember\' is not defined. (no-undef)\n8:11 - Use import { oneWay } from \'@ember/object/computed\'; instead of using Ember.computed.oneWay (ember/new-module-imports)\n8:11 - \'Ember\' is not defined. (no-undef)\n9:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n9:16 - \'Ember\' is not defined. (no-undef)\n16:13 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)\n16:13 - \'Ember\' is not defined. (no-undef)');
});

QUnit.test('components/client-report.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/client-report.js should pass ESLint\n\n4:12 - \'Ember\' is not defined. (no-undef)\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n5:9 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n5:9 - \'Ember\' is not defined. (no-undef)\n6:20 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n6:20 - \'Ember\' is not defined. (no-undef)\n9:26 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n9:26 - \'Ember\' is not defined. (no-undef)\n12:19 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n12:19 - \'Ember\' is not defined. (no-undef)\n17:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n19:12 - \'Ember\' is not defined. (no-undef)\n19:12 - Use import { oneWay } from \'@ember/object/computed\'; instead of using Ember.computed.oneWay (ember/new-module-imports)\n20:11 - Use import { oneWay } from \'@ember/object/computed\'; instead of using Ember.computed.oneWay (ember/new-module-imports)\n20:11 - \'Ember\' is not defined. (no-undef)\n21:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n21:16 - \'Ember\' is not defined. (no-undef)\n26:13 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)\n26:13 - \'Ember\' is not defined. (no-undef)\n51:9 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n51:9 - \'$\' is not defined. (no-undef)\n52:17 - \'table\' is assigned a value but never used. (no-unused-vars)\n52:25 - \'$\' is not defined. (no-undef)\n52:25 - Do not use global `$` or `jQuery` (ember/no-global-jquery)');
});

QUnit.test('components/complete-injury-form.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/complete-injury-form.js should pass ESLint\n\n58:21 - \'key\' is already defined. (no-redeclare)\n64:21 - \'i\' is already defined. (no-redeclare)\n70:11 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)\n70:11 - \'Ember\' is not defined. (no-undef)\n114:19 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/complete-test.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/complete-test.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n13:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n13:16 - \'Ember\' is not defined. (no-undef)\n59:19 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/contact-form.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/contact-form.js should pass ESLint\n\n14:25 - \'response\' is defined but never used. (no-unused-vars)');
});

QUnit.test('components/country-dropdown.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/country-dropdown.js should pass ESLint\n\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:12 - \'Ember\' is not defined. (no-undef)\n5:19 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n5:19 - \'Ember\' is not defined. (no-undef)');
});

QUnit.test('components/create-payment.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'components/create-payment.js should pass ESLint\n\n');
});

QUnit.test('components/delete-exercise.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'components/delete-exercise.js should pass ESLint\n\n');
});

QUnit.test('components/delete-form.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/delete-form.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n8:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n8:16 - \'Ember\' is not defined. (no-undef)');
});

QUnit.test('components/delete-injury-form.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/delete-injury-form.js should pass ESLint\n\n33:17 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/delete-plan.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'components/delete-plan.js should pass ESLint\n\n');
});

QUnit.test('components/delete-question.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'components/delete-question.js should pass ESLint\n\n');
});

QUnit.test('components/exercise-dropdown.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/exercise-dropdown.js should pass ESLint\n\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:12 - \'Ember\' is not defined. (no-undef)\n22:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
});

QUnit.test('components/forgot-password.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/forgot-password.js should pass ESLint\n\n28:25 - Unexpected console statement. (no-console)\n39:29 - Unexpected console statement. (no-console)\n41:33 - Unexpected console statement. (no-console)\n43:37 - Unexpected console statement. (no-console)\n56:29 - Unexpected console statement. (no-console)');
});

QUnit.test('components/generate-data.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/generate-data.js should pass ESLint\n\n9:17 - \'store\' is assigned a value but never used. (no-unused-vars)\n27:29 - Unexpected console statement. (no-console)\n34:29 - Unexpected console statement. (no-console)\n45:25 - Unexpected console statement. (no-console)\n60:25 - Unexpected console statement. (no-console)\n66:25 - Unexpected console statement. (no-console)\n83:33 - \'i\' is already defined. (no-redeclare)\n95:33 - \'i\' is already defined. (no-redeclare)\n116:33 - \'i\' is already defined. (no-redeclare)\n130:33 - \'i\' is already defined. (no-redeclare)\n145:25 - Unexpected console statement. (no-console)\n150:33 - \'i\' is already defined. (no-redeclare)\n161:33 - \'i\' is already defined. (no-redeclare)\n174:33 - \'i\' is already defined. (no-redeclare)\n185:33 - \'i\' is already defined. (no-redeclare)\n198:33 - \'i\' is already defined. (no-redeclare)\n211:33 - \'i\' is already defined. (no-redeclare)\n224:33 - \'i\' is already defined. (no-redeclare)\n237:31 - Unexpected constant condition. (no-constant-condition)\n260:25 - Unexpected console statement. (no-console)\n265:33 - \'i\' is already defined. (no-redeclare)\n278:33 - \'i\' is already defined. (no-redeclare)\n291:33 - \'i\' is already defined. (no-redeclare)\n299:25 - Unexpected console statement. (no-console)\n304:33 - \'i\' is already defined. (no-redeclare)\n313:25 - Unexpected console statement. (no-console)\n318:29 - \'i\' is already defined. (no-redeclare)\n327:17 - \'modelNames\' is assigned a value but never used. (no-unused-vars)\n344:21 - \'i\' is already defined. (no-redeclare)\n354:21 - \'i\' is already defined. (no-redeclare)\n364:21 - \'i\' is already defined. (no-redeclare)\n374:21 - \'i\' is already defined. (no-redeclare)\n388:21 - \'i\' is already defined. (no-redeclare)\n404:21 - \'i\' is already defined. (no-redeclare)');
});

QUnit.test('components/log-out.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'components/log-out.js should pass ESLint\n\n');
});

QUnit.test('components/login-user.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/login-user.js should pass ESLint\n\n3:8 - \'$\' is defined but never used. (no-unused-vars)\n8:9 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n8:9 - \'Ember\' is not defined. (no-undef)');
});

QUnit.test('components/modify-admin-profile.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/modify-admin-profile.js should pass ESLint\n\n79:15 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/modify-client-profile.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/modify-client-profile.js should pass ESLint\n\n95:15 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/modify-client.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/modify-client.js should pass ESLint\n\n89:17 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/modify-exercise.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/modify-exercise.js should pass ESLint\n\n35:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n38:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n44:17 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n44:17 - \'Ember\' is not defined. (no-undef)\n53:16 - Use import { htmlSafe } from \'@ember/string\'; instead of using Ember.String.htmlSafe (ember/new-module-imports)\n53:16 - \'Ember\' is not defined. (no-undef)\n56:17 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n56:17 - \'Ember\' is not defined. (no-undef)\n57:16 - Use import { htmlSafe } from \'@ember/string\'; instead of using Ember.String.htmlSafe (ember/new-module-imports)\n57:16 - \'Ember\' is not defined. (no-undef)\n89:18 - \'Ember\' is not defined. (no-undef)\n89:18 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n101:21 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n101:21 - \'Ember\' is not defined. (no-undef)\n173:29 - \'i\' is already defined. (no-redeclare)\n200:25 - Unexpected console statement. (no-console)\n227:15 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/modify-form.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/modify-form.js should pass ESLint\n\n13:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n14:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n18:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n18:16 - \'Ember\' is not defined. (no-undef)\n66:25 - \'i\' is already defined. (no-redeclare)\n113:33 - \'i\' is already defined. (no-redeclare)\n126:33 - Empty block statement. (no-empty)\n191:17 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/modify-physio-profile.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/modify-physio-profile.js should pass ESLint\n\n79:15 - \'table\' is assigned a value but never used. (no-unused-vars)\n83:7 - \'DS\' is not defined. (no-undef)\n84:22 - \'record\' is defined but never used. (no-unused-vars)');
});

QUnit.test('components/modify-plan.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/modify-plan.js should pass ESLint\n\n148:29 - \'i\' is already defined. (no-redeclare)\n166:29 - \'i\' is already defined. (no-redeclare)\n313:13 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/modify-question.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/modify-question.js should pass ESLint\n\n53:17 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/modify-user.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/modify-user.js should pass ESLint\n\n57:15 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/new-appointment.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/new-appointment.js should pass ESLint\n\n8:20 - \'date\' is defined but never used. (no-unused-vars)\n22:11 - \'takenTimes\' is assigned a value but never used. (no-unused-vars)\n54:10 - Unnecessary semicolon. (no-extra-semi)');
});

QUnit.test('components/question-dropdown.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/question-dropdown.js should pass ESLint\n\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:12 - \'Ember\' is not defined. (no-undef)\n5:21 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n5:21 - \'Ember\' is not defined. (no-undef)');
});

QUnit.test('components/register-admin.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/register-admin.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n119:25 - Unexpected console statement. (no-console)');
});

QUnit.test('components/register-physiotherapist.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/register-physiotherapist.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n119:25 - Unexpected console statement. (no-console)');
});

QUnit.test('components/register-user.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/register-user.js should pass ESLint\n\n168:25 - Unexpected console statement. (no-console)');
});

QUnit.test('components/show-injury-form.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/show-injury-form.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n13:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n13:16 - \'Ember\' is not defined. (no-undef)\n18:13 - \'self\' is assigned a value but never used. (no-unused-vars)\n19:13 - \'myStore\' is assigned a value but never used. (no-unused-vars)\n36:19 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('components/simple-example.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'components/simple-example.js should pass ESLint\n\n');
});

QUnit.test('components/to-do-list.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/to-do-list.js should pass ESLint\n\n4:10 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:10 - \'Ember\' is not defined. (no-undef)\n5:7 - \'Ember\' is not defined. (no-undef)\n5:7 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n7:10 - Don\'t use Ember\'s function prototype extensions (ember/no-function-prototype-extensions)\n8:12 - \'Ember\' is not defined. (no-undef)\n8:12 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n11:3 - Duplicate key \'state\'. (no-dupe-keys)\n11:10 - Don\'t use Ember\'s function prototype extensions (ember/no-function-prototype-extensions)\n12:12 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n12:12 - \'Ember\' is not defined. (no-undef)\n14:14 - Don\'t use Ember\'s function prototype extensions (ember/no-function-prototype-extensions)\n46:11 - \'DS\' is assigned a value but never used. (no-unused-vars)\n48:7 - Unexpected console statement. (no-console)\n50:7 - \'$\' is not defined. (no-undef)\n50:7 - Do not use global `$` or `jQuery` (ember/no-global-jquery)');
});

QUnit.test('components/upload-files.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/upload-files.js should pass ESLint\n\n15:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n18:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n107:13 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n107:13 - \'Ember\' is not defined. (no-undef)');
});

QUnit.test('components/view-images.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/view-images.js should pass ESLint\n\n2:20 - \'service\' is defined but never used. (no-unused-vars)\n11:9 - \'self\' is assigned a value but never used. (no-unused-vars)\n13:9 - \'authentication\' is assigned a value but never used. (no-unused-vars)\n40:11 - \'authentication\' is assigned a value but never used. (no-unused-vars)\n76:11 - \'table\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('controllers/generate-reports.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'controllers/generate-reports.js should pass ESLint\n\n12:6 - Unexpected console statement. (no-console)\n13:21 - \'jsPDF\' is not defined. (no-undef)\n24:21 - \'jsPDF\' is not defined. (no-undef)\n69:15 - \'i\' is already defined. (no-redeclare)\n70:17 - \'j\' is already defined. (no-redeclare)\n90:15 - \'i\' is already defined. (no-redeclare)\n91:17 - \'j\' is already defined. (no-redeclare)\n104:6 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n104:6 - \'$\' is not defined. (no-undef)\n105:14 - \'table\' is assigned a value but never used. (no-unused-vars)\n105:22 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n105:22 - \'$\' is not defined. (no-undef)');
});

QUnit.test('controllers/rehab-plans.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'controllers/rehab-plans.js should pass ESLint\n\n6:5 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n6:5 - \'$\' is not defined. (no-undef)\n7:13 - \'table\' is assigned a value but never used. (no-unused-vars)\n7:21 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n7:21 - \'$\' is not defined. (no-undef)');
});

QUnit.test('initializers/ouda-auth.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'initializers/ouda-auth.js should pass ESLint\n\n');
});

QUnit.test('models/administrator.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/administrator.js should pass ESLint\n\n');
});

QUnit.test('models/appointment.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/appointment.js should pass ESLint\n\n');
});

QUnit.test('models/assessment-test.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/assessment-test.js should pass ESLint\n\n');
});

QUnit.test('models/city.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/city.js should pass ESLint\n\n');
});

QUnit.test('models/completed-injury-form.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/completed-injury-form.js should pass ESLint\n\n');
});

QUnit.test('models/country.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/country.js should pass ESLint\n\n');
});

QUnit.test('models/exercise.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/exercise.js should pass ESLint\n\n');
});

QUnit.test('models/exercises-list.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/exercises-list.js should pass ESLint\n\n');
});

QUnit.test('models/form.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/form.js should pass ESLint\n\n');
});

QUnit.test('models/gender.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/gender.js should pass ESLint\n\n');
});

QUnit.test('models/image.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/image.js should pass ESLint\n\n');
});

QUnit.test('models/injury-form.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/injury-form.js should pass ESLint\n\n');
});

QUnit.test('models/injury-result.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/injury-result.js should pass ESLint\n\n');
});

QUnit.test('models/login.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/login.js should pass ESLint\n\n');
});

QUnit.test('models/patient-profile.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/patient-profile.js should pass ESLint\n\n');
});

QUnit.test('models/payment.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/payment.js should pass ESLint\n\n');
});

QUnit.test('models/physiotherapist.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/physiotherapist.js should pass ESLint\n\n');
});

QUnit.test('models/province.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/province.js should pass ESLint\n\n');
});

QUnit.test('models/question-type.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/question-type.js should pass ESLint\n\n');
});

QUnit.test('models/question.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/question.js should pass ESLint\n\n');
});

QUnit.test('models/questions-list.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/questions-list.js should pass ESLint\n\n');
});

QUnit.test('models/recommendation.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/recommendation.js should pass ESLint\n\n');
});

QUnit.test('models/rehabilitation-plan.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/rehabilitation-plan.js should pass ESLint\n\n');
});

QUnit.test('models/self-start-user.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/self-start-user.js should pass ESLint\n\n');
});

QUnit.test('models/test-result.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/test-result.js should pass ESLint\n\n');
});

QUnit.test('models/to-do-list.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/to-do-list.js should pass ESLint\n\n');
});

QUnit.test('models/treatment.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/treatment.js should pass ESLint\n\n');
});

QUnit.test('models/user-account.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'models/user-account.js should pass ESLint\n\n');
});

QUnit.test('resolver.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'resolver.js should pass ESLint\n\n');
});

QUnit.test('router.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'router.js should pass ESLint\n\n');
});

QUnit.test('routes/about.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/about.js should pass ESLint\n\n');
});

QUnit.test('routes/admin-profile.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/admin-profile.js should pass ESLint\n\n');
});

QUnit.test('routes/admin.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/admin.js should pass ESLint\n\n12:41 - \'patients\' is defined but never used. (no-unused-vars)\n18:38 - \'physio\' is defined but never used. (no-unused-vars)\n52:15 - Unexpected console statement. (no-console)');
});

QUnit.test('routes/application.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/application.js should pass ESLint\n\n16:24 - \'res\' is defined but never used. (no-unused-vars)\n18:27 - \'err\' is defined but never used. (no-unused-vars)');
});

QUnit.test('routes/appointments.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/appointments.js should pass ESLint\n\n2:8 - \'fileObject\' is defined but never used. (no-unused-vars)\n14:9 - \'authentication\' is assigned a value but never used. (no-unused-vars)\n43:7 - Unexpected console statement. (no-console)');
});

QUnit.test('routes/assessment-tests.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/assessment-tests.js should pass ESLint\n\n');
});

QUnit.test('routes/blog.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/blog.js should pass ESLint\n\n');
});

QUnit.test('routes/book-appointment.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/book-appointment.js should pass ESLint\n\n');
});

QUnit.test('routes/clients.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/clients.js should pass ESLint\n\n12:7 - \'self\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('routes/exercise.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/exercise.js should pass ESLint\n\n2:8 - \'fileObject\' is defined but never used. (no-unused-vars)\n14:13 - \'authentication\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('routes/faq.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/faq.js should pass ESLint\n\n');
});

QUnit.test('routes/fill-injury-form.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/fill-injury-form.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n4:8 - \'$\' is defined but never used. (no-unused-vars)\n10:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('routes/forms.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/forms.js should pass ESLint\n\n13:9 - \'self\' is assigned a value but never used. (no-unused-vars)\n17:9 - \'self\' is already defined. (no-redeclare)');
});

QUnit.test('routes/generate-reports.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/generate-reports.js should pass ESLint\n\n7:11 - \'self\' is assigned a value but never used. (no-unused-vars)\n64:21 - \'i\' is already defined. (no-redeclare)\n98:21 - \'i\' is already defined. (no-redeclare)\n126:21 - \'i\' is already defined. (no-redeclare)\n132:17 - \'key\' is already defined. (no-redeclare)\n137:17 - \'key\' is already defined. (no-redeclare)\n139:21 - \'i\' is already defined. (no-redeclare)\n142:21 - \'i\' is already defined. (no-redeclare)\n147:17 - \'key\' is already defined. (no-redeclare)\n150:21 - \'i\' is already defined. (no-redeclare)\n155:17 - \'i\' is already defined. (no-redeclare)\n161:9 - Unexpected console statement. (no-console)\n162:9 - Unexpected console statement. (no-console)');
});

QUnit.test('routes/home.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/home.js should pass ESLint\n\n');
});

QUnit.test('routes/how-it-works.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/how-it-works.js should pass ESLint\n\n');
});

QUnit.test('routes/injury-forms.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/injury-forms.js should pass ESLint\n\n13:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('routes/log-out.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/log-out.js should pass ESLint\n\n');
});

QUnit.test('routes/login.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/login.js should pass ESLint\n\n');
});

QUnit.test('routes/make-payment.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/make-payment.js should pass ESLint\n\n');
});

QUnit.test('routes/manage-users.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/manage-users.js should pass ESLint\n\n4:10 - \'computed\' is defined but never used. (no-unused-vars)\n5:8 - \'$\' is defined but never used. (no-unused-vars)\n18:13 - \'myStore\' is assigned a value but never used. (no-unused-vars)\n19:13 - \'patientProfilesJSON\' is assigned a value but never used. (no-unused-vars)\n20:13 - \'physiotherapistsJSON\' is assigned a value but never used. (no-unused-vars)\n45:17 - Unexpected console statement. (no-console)\n46:17 - Unexpected console statement. (no-console)\n63:13 - Unexpected console statement. (no-console)\n76:11 - \'self\' is assigned a value but never used. (no-unused-vars)\n84:11 - Unexpected console statement. (no-console)\n88:11 - Unexpected console statement. (no-console)\n102:11 - \'self\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('routes/my-images.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/my-images.js should pass ESLint\n\n4:10 - \'computed\' is defined but never used. (no-unused-vars)\n5:8 - \'$\' is defined but never used. (no-unused-vars)\n17:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('routes/patient-images.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/patient-images.js should pass ESLint\n\n14:9 - \'authentication\' is assigned a value but never used. (no-unused-vars)\n16:9 - \'patientProfilesJSON\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('routes/patient-profiles.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/patient-profiles.js should pass ESLint\n\n');
});

QUnit.test('routes/physio-completed-injury-forms.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/physio-completed-injury-forms.js should pass ESLint\n\n7:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('routes/physio-profile.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/physio-profile.js should pass ESLint\n\n');
});

QUnit.test('routes/questions.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/questions.js should pass ESLint\n\n13:13 - \'questionPairs\' is assigned a value but never used. (no-unused-vars)\n16:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
});

QUnit.test('routes/rehab-plans.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/rehab-plans.js should pass ESLint\n\n');
});

QUnit.test('routes/services.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'routes/services.js should pass ESLint\n\n');
});

QUnit.test('routes/treatments.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'routes/treatments.js should pass ESLint\n\n13:13 - \'self\' is assigned a value but never used. (no-unused-vars)\n50:29 - \'i\' is already defined. (no-redeclare)\n135:17 - \'replacement\' is assigned a value but never used. (no-unused-vars)\n143:21 - \'key\' is already defined. (no-redeclare)\n146:29 - \'i\' is already defined. (no-redeclare)\n151:21 - \'key\' is already defined. (no-redeclare)\n157:21 - \'key\' is already defined. (no-redeclare)\n159:29 - \'i\' is already defined. (no-redeclare)\n162:29 - \'i\' is already defined. (no-redeclare)\n167:21 - \'key\' is already defined. (no-redeclare)\n173:21 - \'key\' is already defined. (no-redeclare)\n175:29 - \'i\' is already defined. (no-redeclare)\n178:29 - \'i\' is already defined. (no-redeclare)\n181:29 - \'i\' is already defined. (no-redeclare)\n186:21 - \'key\' is already defined. (no-redeclare)\n192:21 - \'key\' is already defined. (no-redeclare)\n195:29 - \'i\' is already defined. (no-redeclare)\n200:21 - \'key\' is already defined. (no-redeclare)\n205:21 - \'key\' is already defined. (no-redeclare)');
});

QUnit.test('serializers/application.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'serializers/application.js should pass ESLint\n\n');
});

QUnit.test('services/ouda-auth.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'services/ouda-auth.js should pass ESLint\n\n5:16 - Use import Service from \'@ember/service\'; instead of using Ember.Service (ember/new-module-imports)\n41:12 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n99:7 - Unexpected console statement. (no-console)\n100:7 - Unexpected console statement. (no-console)\n109:9 - Unexpected console statement. (no-console)');
});

QUnit.test('utils/file-object.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'utils/file-object.js should pass ESLint\n\n84:9 - Unexpected console statement. (no-console)\n89:7 - Unexpected console statement. (no-console)');
});

