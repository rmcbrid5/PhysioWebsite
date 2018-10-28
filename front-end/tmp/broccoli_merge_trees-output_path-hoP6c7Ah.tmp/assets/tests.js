'use strict';

define('front-end/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/add-exercise.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/add-exercise.js should pass ESLint\n\n14:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n15:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('components/add-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/add-form.js should pass ESLint\n\n74:40 - \'objModel\' is not defined. (no-undef)');
  });

  QUnit.test('components/add-injury-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/add-injury-form.js should pass ESLint\n\n');
  });

  QUnit.test('components/add-new-plan.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/add-new-plan.js should pass ESLint\n\n83:29 - \'i\' is already defined. (no-redeclare)\n100:29 - \'i\' is already defined. (no-redeclare)');
  });

  QUnit.test('components/add-question.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/add-question.js should pass ESLint\n\n');
  });

  QUnit.test('components/appt-button.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/appt-button.js should pass ESLint\n\n6:5 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n6:5 - \'$\' is not defined. (no-undef)\n7:11 - \'table\' is assigned a value but never used. (no-unused-vars)\n7:19 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n7:19 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('components/assessment-test-dropdown.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/assessment-test-dropdown.js should pass ESLint\n\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:12 - \'Ember\' is not defined. (no-undef)\n5:26 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n5:26 - \'Ember\' is not defined. (no-undef)\n25:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('components/assign-plan.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/assign-plan.js should pass ESLint\n\n89:25 - \'physiotherapistIds\' is assigned a value but never used. (no-unused-vars)\n176:9 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/authenticate-user.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/authenticate-user.js should pass ESLint\n\n4:12 - \'Ember\' is not defined. (no-undef)\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n5:9 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n5:9 - \'Ember\' is not defined. (no-undef)\n7:12 - Use import { oneWay } from \'@ember/object/computed\'; instead of using Ember.computed.oneWay (ember/new-module-imports)\n7:12 - \'Ember\' is not defined. (no-undef)\n8:11 - Use import { oneWay } from \'@ember/object/computed\'; instead of using Ember.computed.oneWay (ember/new-module-imports)\n8:11 - \'Ember\' is not defined. (no-undef)\n9:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n9:16 - \'Ember\' is not defined. (no-undef)\n16:13 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)\n16:13 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('components/client-report.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/client-report.js should pass ESLint\n\n4:12 - \'Ember\' is not defined. (no-undef)\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n5:9 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n5:9 - \'Ember\' is not defined. (no-undef)\n6:20 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n6:20 - \'Ember\' is not defined. (no-undef)\n9:26 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n9:26 - \'Ember\' is not defined. (no-undef)\n12:19 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n12:19 - \'Ember\' is not defined. (no-undef)\n17:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n19:12 - \'Ember\' is not defined. (no-undef)\n19:12 - Use import { oneWay } from \'@ember/object/computed\'; instead of using Ember.computed.oneWay (ember/new-module-imports)\n20:11 - Use import { oneWay } from \'@ember/object/computed\'; instead of using Ember.computed.oneWay (ember/new-module-imports)\n20:11 - \'Ember\' is not defined. (no-undef)\n21:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n21:16 - \'Ember\' is not defined. (no-undef)\n26:13 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)\n26:13 - \'Ember\' is not defined. (no-undef)\n51:9 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n51:9 - \'$\' is not defined. (no-undef)\n52:17 - \'table\' is assigned a value but never used. (no-unused-vars)\n52:25 - \'$\' is not defined. (no-undef)\n52:25 - Do not use global `$` or `jQuery` (ember/no-global-jquery)');
  });

  QUnit.test('components/complete-injury-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/complete-injury-form.js should pass ESLint\n\n58:21 - \'key\' is already defined. (no-redeclare)\n64:21 - \'i\' is already defined. (no-redeclare)\n70:11 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)\n70:11 - \'Ember\' is not defined. (no-undef)\n114:19 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/complete-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/complete-test.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n13:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n13:16 - \'Ember\' is not defined. (no-undef)\n59:19 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/contact-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/contact-form.js should pass ESLint\n\n14:25 - \'response\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('components/country-dropdown.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/country-dropdown.js should pass ESLint\n\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:12 - \'Ember\' is not defined. (no-undef)\n5:19 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n5:19 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('components/create-payment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/create-payment.js should pass ESLint\n\n');
  });

  QUnit.test('components/delete-exercise.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/delete-exercise.js should pass ESLint\n\n');
  });

  QUnit.test('components/delete-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/delete-form.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n8:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n8:16 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('components/delete-injury-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/delete-injury-form.js should pass ESLint\n\n33:17 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/delete-plan.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/delete-plan.js should pass ESLint\n\n');
  });

  QUnit.test('components/delete-question.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/delete-question.js should pass ESLint\n\n');
  });

  QUnit.test('components/exercise-dropdown.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/exercise-dropdown.js should pass ESLint\n\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:12 - \'Ember\' is not defined. (no-undef)\n22:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('components/forgot-password.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/forgot-password.js should pass ESLint\n\n28:25 - Unexpected console statement. (no-console)\n39:29 - Unexpected console statement. (no-console)\n41:33 - Unexpected console statement. (no-console)\n43:37 - Unexpected console statement. (no-console)\n56:29 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/generate-data.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/generate-data.js should pass ESLint\n\n9:17 - \'store\' is assigned a value but never used. (no-unused-vars)\n27:29 - Unexpected console statement. (no-console)\n34:29 - Unexpected console statement. (no-console)\n45:25 - Unexpected console statement. (no-console)\n60:25 - Unexpected console statement. (no-console)\n66:25 - Unexpected console statement. (no-console)\n83:33 - \'i\' is already defined. (no-redeclare)\n95:33 - \'i\' is already defined. (no-redeclare)\n116:33 - \'i\' is already defined. (no-redeclare)\n130:33 - \'i\' is already defined. (no-redeclare)\n145:25 - Unexpected console statement. (no-console)\n150:33 - \'i\' is already defined. (no-redeclare)\n161:33 - \'i\' is already defined. (no-redeclare)\n174:33 - \'i\' is already defined. (no-redeclare)\n185:33 - \'i\' is already defined. (no-redeclare)\n198:33 - \'i\' is already defined. (no-redeclare)\n211:33 - \'i\' is already defined. (no-redeclare)\n224:33 - \'i\' is already defined. (no-redeclare)\n237:31 - Unexpected constant condition. (no-constant-condition)\n260:25 - Unexpected console statement. (no-console)\n265:33 - \'i\' is already defined. (no-redeclare)\n278:33 - \'i\' is already defined. (no-redeclare)\n291:33 - \'i\' is already defined. (no-redeclare)\n299:25 - Unexpected console statement. (no-console)\n304:33 - \'i\' is already defined. (no-redeclare)\n313:25 - Unexpected console statement. (no-console)\n318:29 - \'i\' is already defined. (no-redeclare)\n327:17 - \'modelNames\' is assigned a value but never used. (no-unused-vars)\n344:21 - \'i\' is already defined. (no-redeclare)\n354:21 - \'i\' is already defined. (no-redeclare)\n364:21 - \'i\' is already defined. (no-redeclare)\n374:21 - \'i\' is already defined. (no-redeclare)\n388:21 - \'i\' is already defined. (no-redeclare)\n404:21 - \'i\' is already defined. (no-redeclare)');
  });

  QUnit.test('components/log-out.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/log-out.js should pass ESLint\n\n');
  });

  QUnit.test('components/login-user.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/login-user.js should pass ESLint\n\n3:8 - \'$\' is defined but never used. (no-unused-vars)\n8:9 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n8:9 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('components/modify-admin-profile.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/modify-admin-profile.js should pass ESLint\n\n79:15 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/modify-client-profile.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/modify-client-profile.js should pass ESLint\n\n95:15 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/modify-client.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/modify-client.js should pass ESLint\n\n89:17 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/modify-exercise.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/modify-exercise.js should pass ESLint\n\n35:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n38:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n44:17 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n44:17 - \'Ember\' is not defined. (no-undef)\n53:16 - Use import { htmlSafe } from \'@ember/string\'; instead of using Ember.String.htmlSafe (ember/new-module-imports)\n53:16 - \'Ember\' is not defined. (no-undef)\n56:17 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n56:17 - \'Ember\' is not defined. (no-undef)\n57:16 - Use import { htmlSafe } from \'@ember/string\'; instead of using Ember.String.htmlSafe (ember/new-module-imports)\n57:16 - \'Ember\' is not defined. (no-undef)\n89:18 - \'Ember\' is not defined. (no-undef)\n89:18 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n101:21 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n101:21 - \'Ember\' is not defined. (no-undef)\n173:29 - \'i\' is already defined. (no-redeclare)\n200:25 - Unexpected console statement. (no-console)\n227:15 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/modify-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/modify-form.js should pass ESLint\n\n13:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n14:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n18:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n18:16 - \'Ember\' is not defined. (no-undef)\n66:25 - \'i\' is already defined. (no-redeclare)\n113:33 - \'i\' is already defined. (no-redeclare)\n126:33 - Empty block statement. (no-empty)\n191:17 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/modify-physio-profile.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/modify-physio-profile.js should pass ESLint\n\n79:15 - \'table\' is assigned a value but never used. (no-unused-vars)\n83:7 - \'DS\' is not defined. (no-undef)\n84:22 - \'record\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('components/modify-plan.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/modify-plan.js should pass ESLint\n\n148:29 - \'i\' is already defined. (no-redeclare)\n166:29 - \'i\' is already defined. (no-redeclare)\n313:13 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/modify-question.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/modify-question.js should pass ESLint\n\n53:17 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/modify-user.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/modify-user.js should pass ESLint\n\n57:15 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/new-appointment.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/new-appointment.js should pass ESLint\n\n8:20 - \'date\' is defined but never used. (no-unused-vars)\n22:11 - \'takenTimes\' is assigned a value but never used. (no-unused-vars)\n54:10 - Unnecessary semicolon. (no-extra-semi)');
  });

  QUnit.test('components/question-dropdown.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/question-dropdown.js should pass ESLint\n\n4:12 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:12 - \'Ember\' is not defined. (no-undef)\n5:21 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n5:21 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('components/register-admin.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/register-admin.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n119:25 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/register-physiotherapist.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/register-physiotherapist.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n119:25 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/register-user.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/register-user.js should pass ESLint\n\n168:25 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/show-injury-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/show-injury-form.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n13:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n13:16 - \'Ember\' is not defined. (no-undef)\n18:13 - \'self\' is assigned a value but never used. (no-unused-vars)\n19:13 - \'myStore\' is assigned a value but never used. (no-unused-vars)\n36:19 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/simple-example.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/simple-example.js should pass ESLint\n\n');
  });

  QUnit.test('components/to-do-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/to-do-list.js should pass ESLint\n\n4:10 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n4:10 - \'Ember\' is not defined. (no-undef)\n5:7 - \'Ember\' is not defined. (no-undef)\n5:7 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n7:10 - Don\'t use Ember\'s function prototype extensions (ember/no-function-prototype-extensions)\n8:12 - \'Ember\' is not defined. (no-undef)\n8:12 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n11:3 - Duplicate key \'state\'. (no-dupe-keys)\n11:10 - Don\'t use Ember\'s function prototype extensions (ember/no-function-prototype-extensions)\n12:12 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n12:12 - \'Ember\' is not defined. (no-undef)\n14:14 - Don\'t use Ember\'s function prototype extensions (ember/no-function-prototype-extensions)\n46:11 - \'DS\' is assigned a value but never used. (no-unused-vars)\n48:7 - Unexpected console statement. (no-console)\n50:7 - \'$\' is not defined. (no-undef)\n50:7 - Do not use global `$` or `jQuery` (ember/no-global-jquery)');
  });

  QUnit.test('components/upload-files.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/upload-files.js should pass ESLint\n\n15:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n18:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n107:13 - Use import { isEmpty } from \'@ember/utils\'; instead of using Ember.isEmpty (ember/new-module-imports)\n107:13 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('components/view-images.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/view-images.js should pass ESLint\n\n2:20 - \'service\' is defined but never used. (no-unused-vars)\n11:9 - \'self\' is assigned a value but never used. (no-unused-vars)\n13:9 - \'authentication\' is assigned a value but never used. (no-unused-vars)\n40:11 - \'authentication\' is assigned a value but never used. (no-unused-vars)\n76:11 - \'table\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/generate-reports.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/generate-reports.js should pass ESLint\n\n12:6 - Unexpected console statement. (no-console)\n13:21 - \'jsPDF\' is not defined. (no-undef)\n24:21 - \'jsPDF\' is not defined. (no-undef)\n69:15 - \'i\' is already defined. (no-redeclare)\n70:17 - \'j\' is already defined. (no-redeclare)\n90:15 - \'i\' is already defined. (no-redeclare)\n91:17 - \'j\' is already defined. (no-redeclare)\n104:6 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n104:6 - \'$\' is not defined. (no-undef)\n105:14 - \'table\' is assigned a value but never used. (no-unused-vars)\n105:22 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n105:22 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('controllers/rehab-plans.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/rehab-plans.js should pass ESLint\n\n6:5 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n6:5 - \'$\' is not defined. (no-undef)\n7:13 - \'table\' is assigned a value but never used. (no-unused-vars)\n7:21 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n7:21 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('initializers/ouda-auth.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/ouda-auth.js should pass ESLint\n\n');
  });

  QUnit.test('models/administrator.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/administrator.js should pass ESLint\n\n');
  });

  QUnit.test('models/appointment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/appointment.js should pass ESLint\n\n');
  });

  QUnit.test('models/assessment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/assessment-test.js should pass ESLint\n\n');
  });

  QUnit.test('models/city.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/city.js should pass ESLint\n\n');
  });

  QUnit.test('models/completed-injury-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/completed-injury-form.js should pass ESLint\n\n');
  });

  QUnit.test('models/country.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/country.js should pass ESLint\n\n');
  });

  QUnit.test('models/exercise.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/exercise.js should pass ESLint\n\n');
  });

  QUnit.test('models/exercises-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/exercises-list.js should pass ESLint\n\n');
  });

  QUnit.test('models/form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/form.js should pass ESLint\n\n');
  });

  QUnit.test('models/gender.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/gender.js should pass ESLint\n\n');
  });

  QUnit.test('models/image.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/image.js should pass ESLint\n\n');
  });

  QUnit.test('models/injury-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/injury-form.js should pass ESLint\n\n');
  });

  QUnit.test('models/injury-result.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/injury-result.js should pass ESLint\n\n');
  });

  QUnit.test('models/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/login.js should pass ESLint\n\n');
  });

  QUnit.test('models/patient-profile.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/patient-profile.js should pass ESLint\n\n');
  });

  QUnit.test('models/payment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/payment.js should pass ESLint\n\n');
  });

  QUnit.test('models/physiotherapist.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/physiotherapist.js should pass ESLint\n\n');
  });

  QUnit.test('models/province.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/province.js should pass ESLint\n\n');
  });

  QUnit.test('models/question-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/question-type.js should pass ESLint\n\n');
  });

  QUnit.test('models/question.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/question.js should pass ESLint\n\n');
  });

  QUnit.test('models/questions-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/questions-list.js should pass ESLint\n\n');
  });

  QUnit.test('models/recommendation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/recommendation.js should pass ESLint\n\n');
  });

  QUnit.test('models/rehabilitation-plan.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/rehabilitation-plan.js should pass ESLint\n\n');
  });

  QUnit.test('models/self-start-user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/self-start-user.js should pass ESLint\n\n');
  });

  QUnit.test('models/test-result.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/test-result.js should pass ESLint\n\n');
  });

  QUnit.test('models/to-do-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/to-do-list.js should pass ESLint\n\n');
  });

  QUnit.test('models/treatment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/treatment.js should pass ESLint\n\n');
  });

  QUnit.test('models/user-account.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/user-account.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/about.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/about.js should pass ESLint\n\n');
  });

  QUnit.test('routes/admin-profile.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/admin-profile.js should pass ESLint\n\n');
  });

  QUnit.test('routes/admin.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/admin.js should pass ESLint\n\n12:41 - \'patients\' is defined but never used. (no-unused-vars)\n18:38 - \'physio\' is defined but never used. (no-unused-vars)\n52:15 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/application.js should pass ESLint\n\n16:24 - \'res\' is defined but never used. (no-unused-vars)\n18:27 - \'err\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/appointments.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/appointments.js should pass ESLint\n\n2:8 - \'fileObject\' is defined but never used. (no-unused-vars)\n14:9 - \'authentication\' is assigned a value but never used. (no-unused-vars)\n43:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/assessment-tests.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/assessment-tests.js should pass ESLint\n\n');
  });

  QUnit.test('routes/blog.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/blog.js should pass ESLint\n\n');
  });

  QUnit.test('routes/book-appointment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/book-appointment.js should pass ESLint\n\n');
  });

  QUnit.test('routes/clients.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/clients.js should pass ESLint\n\n12:7 - \'self\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/exercise.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/exercise.js should pass ESLint\n\n2:8 - \'fileObject\' is defined but never used. (no-unused-vars)\n14:13 - \'authentication\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/faq.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/faq.js should pass ESLint\n\n');
  });

  QUnit.test('routes/fill-injury-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/fill-injury-form.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)\n4:8 - \'$\' is defined but never used. (no-unused-vars)\n10:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/forms.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/forms.js should pass ESLint\n\n13:9 - \'self\' is assigned a value but never used. (no-unused-vars)\n17:9 - \'self\' is already defined. (no-redeclare)');
  });

  QUnit.test('routes/generate-reports.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/generate-reports.js should pass ESLint\n\n7:11 - \'self\' is assigned a value but never used. (no-unused-vars)\n64:21 - \'i\' is already defined. (no-redeclare)\n98:21 - \'i\' is already defined. (no-redeclare)\n126:21 - \'i\' is already defined. (no-redeclare)\n132:17 - \'key\' is already defined. (no-redeclare)\n137:17 - \'key\' is already defined. (no-redeclare)\n139:21 - \'i\' is already defined. (no-redeclare)\n142:21 - \'i\' is already defined. (no-redeclare)\n147:17 - \'key\' is already defined. (no-redeclare)\n150:21 - \'i\' is already defined. (no-redeclare)\n155:17 - \'i\' is already defined. (no-redeclare)\n161:9 - Unexpected console statement. (no-console)\n162:9 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/home.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/home.js should pass ESLint\n\n');
  });

  QUnit.test('routes/how-it-works.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/how-it-works.js should pass ESLint\n\n');
  });

  QUnit.test('routes/injury-forms.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/injury-forms.js should pass ESLint\n\n13:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/log-out.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/log-out.js should pass ESLint\n\n');
  });

  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/login.js should pass ESLint\n\n');
  });

  QUnit.test('routes/make-payment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/make-payment.js should pass ESLint\n\n');
  });

  QUnit.test('routes/manage-users.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/manage-users.js should pass ESLint\n\n4:10 - \'computed\' is defined but never used. (no-unused-vars)\n5:8 - \'$\' is defined but never used. (no-unused-vars)\n18:13 - \'myStore\' is assigned a value but never used. (no-unused-vars)\n19:13 - \'patientProfilesJSON\' is assigned a value but never used. (no-unused-vars)\n20:13 - \'physiotherapistsJSON\' is assigned a value but never used. (no-unused-vars)\n45:17 - Unexpected console statement. (no-console)\n46:17 - Unexpected console statement. (no-console)\n63:13 - Unexpected console statement. (no-console)\n76:11 - \'self\' is assigned a value but never used. (no-unused-vars)\n84:11 - Unexpected console statement. (no-console)\n88:11 - Unexpected console statement. (no-console)\n102:11 - \'self\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/my-images.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/my-images.js should pass ESLint\n\n4:10 - \'computed\' is defined but never used. (no-unused-vars)\n5:8 - \'$\' is defined but never used. (no-unused-vars)\n17:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/patient-images.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/patient-images.js should pass ESLint\n\n14:9 - \'authentication\' is assigned a value but never used. (no-unused-vars)\n16:9 - \'patientProfilesJSON\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/patient-profiles.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/patient-profiles.js should pass ESLint\n\n');
  });

  QUnit.test('routes/physio-completed-injury-forms.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/physio-completed-injury-forms.js should pass ESLint\n\n7:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/physio-profile.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/physio-profile.js should pass ESLint\n\n');
  });

  QUnit.test('routes/questions.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/questions.js should pass ESLint\n\n13:13 - \'questionPairs\' is assigned a value but never used. (no-unused-vars)\n16:13 - \'self\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/rehab-plans.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/rehab-plans.js should pass ESLint\n\n');
  });

  QUnit.test('routes/services.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/services.js should pass ESLint\n\n');
  });

  QUnit.test('routes/treatments.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/treatments.js should pass ESLint\n\n13:13 - \'self\' is assigned a value but never used. (no-unused-vars)\n50:29 - \'i\' is already defined. (no-redeclare)\n135:17 - \'replacement\' is assigned a value but never used. (no-unused-vars)\n143:21 - \'key\' is already defined. (no-redeclare)\n146:29 - \'i\' is already defined. (no-redeclare)\n151:21 - \'key\' is already defined. (no-redeclare)\n157:21 - \'key\' is already defined. (no-redeclare)\n159:29 - \'i\' is already defined. (no-redeclare)\n162:29 - \'i\' is already defined. (no-redeclare)\n167:21 - \'key\' is already defined. (no-redeclare)\n173:21 - \'key\' is already defined. (no-redeclare)\n175:29 - \'i\' is already defined. (no-redeclare)\n178:29 - \'i\' is already defined. (no-redeclare)\n181:29 - \'i\' is already defined. (no-redeclare)\n186:21 - \'key\' is already defined. (no-redeclare)\n192:21 - \'key\' is already defined. (no-redeclare)\n195:29 - \'i\' is already defined. (no-redeclare)\n200:21 - \'key\' is already defined. (no-redeclare)\n205:21 - \'key\' is already defined. (no-redeclare)');
  });

  QUnit.test('serializers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/application.js should pass ESLint\n\n');
  });

  QUnit.test('services/ouda-auth.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/ouda-auth.js should pass ESLint\n\n5:16 - Use import Service from \'@ember/service\'; instead of using Ember.Service (ember/new-module-imports)\n41:12 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n99:7 - Unexpected console statement. (no-console)\n100:7 - Unexpected console statement. (no-console)\n109:9 - Unexpected console statement. (no-console)');
  });

  QUnit.test('utils/file-object.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'utils/file-object.js should pass ESLint\n\n84:9 - Unexpected console statement. (no-console)\n89:7 - Unexpected console statement. (no-console)');
  });
});
define('front-end/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('front-end/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'front-end/tests/helpers/start-app', 'front-end/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Ember.RSVP.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };
});
define('front-end/tests/helpers/start-app', ['exports', 'front-end/app', 'front-end/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes.autoboot = true;
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('front-end/tests/integration/components/add-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('add-form', 'Integration | Component | add form', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "Ihn44m4a",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"add-form\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "Olta0t7i",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"add-form\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/add-question-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('add-question', 'Integration | Component | add question', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "8Uqx/0cN",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"add-question\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "7U/Xnr2f",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"add-question\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/appt-button-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('appt-button', 'Integration | Component | appt button', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "Lr2Wi8u4",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"appt-button\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "NAvf7bwX",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"appt-button\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/assign-plan-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('assign-plan', 'Integration | Component | assign plan', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "YtXkTZDY",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"assign-plan\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "AXws6yho",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"assign-plan\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/client-report-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('client-report', 'Integration | Component | client report', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "agD1sVWB",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"client-report\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "Q2gr+ydc",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"client-report\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/complete-test-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('complete-test', 'Integration | Component | complete test', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "eumDx/dx",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"complete-test\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "09UL+6S+",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"complete-test\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/contact-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('contact-form', 'Integration | Component | contact form', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "1v+JzE0L",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"contact-form\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "9eca1H/0",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"contact-form\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/create-payment-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('create-payment', 'Integration | Component | create payment', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "qQxoz6hj",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"create-payment\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "60TkEfXR",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"create-payment\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/delete-client-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('delete-client', 'Integration | Component | delete client', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "1YO4TFJc",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"delete-client\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "1ga7IqL6",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"delete-client\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/delete-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('delete-form', 'Integration | Component | delete form', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "6v4kecE7",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"delete-form\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "qpHS4c0j",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"delete-form\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/delete-question-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('delete-question', 'Integration | Component | delete question', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "KKV1s7w+",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"delete-question\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "ojQ4YWdb",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"delete-question\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/forgot-password-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('forgot-password', 'Integration | Component | forgot password', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "IpMFPAVx",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"forgot-password\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "VpPRedK2",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"forgot-password\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/generate-data-1-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('generate-data-1', 'Integration | Component | generate data 1', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "wFxOG9Rl",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"generate-data-1\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "6qdqk5Nz",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"generate-data-1\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/generate-data-2-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('generate-data-2', 'Integration | Component | generate data 2', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "S10P2j0M",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"generate-data-2\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "sknqPzfP",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"generate-data-2\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/generate-data-3-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('generate-data-3', 'Integration | Component | generate data 3', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "SjFENSCE",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"generate-data-3\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "kEByBmQ1",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"generate-data-3\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/generate-data-4-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('generate-data-4', 'Integration | Component | generate data 4', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "J9Ovi0Ge",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"generate-data-4\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "yneBASBA",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"generate-data-4\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/generate-data-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('generate-data', 'Integration | Component | generate data', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "er3Cp9H9",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"generate-data\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "zLvgUU/p",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"generate-data\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/log-out-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('log-out', 'Integration | Component | log out', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "53IznQIi",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"log-out\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "fW5mQmLE",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"log-out\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/modify-admin-profile-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('modify-admin-profile', 'Integration | Component | modify admin profile', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "hVoYDAbL",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"modify-admin-profile\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "0uK8J5ac",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modify-admin-profile\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/modify-client-profile-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('modify-client-profile', 'Integration | Component | modify client profile', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "tL20GM+o",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"modify-client-profile\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "RT5+BouF",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modify-client-profile\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/modify-client-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('modify-client', 'Integration | Component | modify client', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "Pr7b4PRd",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"modify-client\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "01oJT7Ik",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modify-client\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/modify-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('modify-form', 'Integration | Component | modify form', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "9zyS7cdf",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"modify-form\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "kgtP7IOe",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modify-form\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/modify-physio-profile-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('modify-physio-profile', 'Integration | Component | modify physio profile', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "3CEE8Aol",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"modify-physio-profile\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "v7UG0cs2",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modify-physio-profile\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/modify-question-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('modify-question', 'Integration | Component | modify question', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "lnFT5Un5",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"modify-question\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "dEWRlZ9q",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modify-question\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/modify-user-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('modify-user', 'Integration | Component | modify user', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "lvFnXSwD",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"modify-user\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "7ZtfC7nK",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"modify-user\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/new-appointment-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('new-appointment', 'Integration | Component | new appointment', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "S4pMNebY",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"new-appointment\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "tDgHntYv",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"new-appointment\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/register-admin-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('register-admin', 'Integration | Component | register admin', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "k9lgg30j",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"register-admin\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "bc5h4/AO",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"register-admin\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/register-physiotherapist-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('register-physiotherapist', 'Integration | Component | register physiotherapist', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "Ppyw4ZSK",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"register-physiotherapist\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "GBKfuV0K",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"register-physiotherapist\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/show-injury-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('show-injury-form', 'Integration | Component | show injury form', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "IsAtlCIS",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"show-injury-form\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "pXqxbp3r",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"show-injury-form\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/simple-example-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('simple-example', 'Integration | Component | simple example', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "TbZjxy9y",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"simple-example\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "Hb4ZgQDk",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"simple-example\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/to-do-list-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('to-do-list', 'Integration | Component | to do list', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "OR4ycqPW",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"to-do-list\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "lva4OMZ+",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"to-do-list\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/upload-files-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('upload-files', 'Integration | Component | upload files', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "qr/UhtQb",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"upload-files\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "ALauu9DR",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"upload-files\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/integration/components/view-images-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('view-images', 'Integration | Component | view images', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "g9QuQaaO",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"view-images\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "FKqXnHrF",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"view-images\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('front-end/tests/test-helper', ['front-end/app', 'front-end/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('front-end/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/add-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/add-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/add-question-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/add-question-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/appt-button-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/appt-button-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/assign-plan-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/assign-plan-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/client-report-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/client-report-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/complete-test-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/complete-test-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/contact-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/contact-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/create-payment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/create-payment-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/delete-client-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/delete-client-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/delete-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/delete-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/delete-question-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/delete-question-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/forgot-password-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/forgot-password-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/generate-data-1-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/generate-data-1-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/generate-data-2-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/generate-data-2-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/generate-data-3-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/generate-data-3-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/generate-data-4-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/generate-data-4-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/generate-data-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/generate-data-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/log-out-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/log-out-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/modify-admin-profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/modify-admin-profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/modify-client-profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/modify-client-profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/modify-client-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/modify-client-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/modify-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/modify-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/modify-physio-profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/modify-physio-profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/modify-question-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/modify-question-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/modify-user-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/modify-user-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/new-appointment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/new-appointment-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/register-admin-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/register-admin-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/register-physiotherapist-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/register-physiotherapist-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/show-injury-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/show-injury-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/simple-example-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/simple-example-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/to-do-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/to-do-list-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/upload-files-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/upload-files-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/view-images-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/view-images-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/generate-reports-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/generate-reports-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/rehab-plans-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/rehab-plans-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/initializers/ouda-auth-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/ouda-auth-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/administrator-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/administrator-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/appointment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/appointment-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/city-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/city-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/exercises-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/exercises-list-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/form-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/gender-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/gender-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/image-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/image-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/images-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/images-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/patient-profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/patient-profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/payment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/payment-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/physiotherapist-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/physiotherapist-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/province-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/province-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/question-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/question-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/question-type-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/question-type-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/questions-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/questions-list-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/recommendation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/recommendation-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/self-start-user-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/self-start-user-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/test-result-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/test-result-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/to-do-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/to-do-list-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/to-do-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/to-do-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/treatment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/treatment-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/about-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/about-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/admin-profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/admin-profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/admin-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/admin-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/appointments-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/appointments-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/assessment-tests-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/assessment-tests-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/blog-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/blog-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/book-appointment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/book-appointment-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/clients-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/clients-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/create-accounts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/create-accounts-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/faq-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/faq-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/forms-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/forms-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/generate-reports-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/generate-reports-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/how-it-works-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/how-it-works-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/howitworks-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/howitworks-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/log-out-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/log-out-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/make-payment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/make-payment-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/manage-users-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/manage-users-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/my-images-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/my-images-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/patient-images-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/patient-images-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/patient-profiles-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/patient-profiles-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/physio-completed-injury-forms-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/physio-completed-injury-forms-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/physio-profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/physio-profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/questions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/questions-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/services-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/services-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/treatments-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/treatments-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/ouda-auth-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/ouda-auth-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/file-object-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/file-object-test.js should pass ESLint\n\n');
  });
});
define('front-end/tests/unit/controllers/generate-reports-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | generate-reports', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      var controller = this.owner.lookup('controller:generate-reports');
      assert.ok(controller);
    });
  });
});
define('front-end/tests/unit/controllers/rehab-plans-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:rehab-plans', 'Unit | Controller | rehab plans', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('front-end/tests/unit/initializers/ouda-auth-test', ['front-end/initializers/ouda-auth', 'qunit', 'front-end/tests/helpers/destroy-app'], function (_oudaAuth, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Initializer | ouda auth', {
    beforeEach: function beforeEach() {
      var _this = this;

      Ember.run(function () {
        _this.application = Ember.Application.create();
        _this.application.deferReadiness();
      });
    },
    afterEach: function afterEach() {
      (0, _destroyApp.default)(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _oudaAuth.initialize)(this.application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('front-end/tests/unit/models/administrator-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('administrator', 'Unit | Model | administrator', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/appointment-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('appointment', 'Unit | Model | appointment', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/city-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('city', 'Unit | Model | city', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/exercises-list-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('exercises-list', 'Unit | Model | exercises list', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('form', 'Unit | Model | form', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/gender-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('gender', 'Unit | Model | gender', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/image-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('image', 'Unit | Model | image', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/images-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('images', 'Unit | Model | images', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('login', 'Unit | Model | login', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/patient-profile-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('patient-profile', 'Unit | Model | patient profile', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/payment-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('payment', 'Unit | Model | payment', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/physiotherapist-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('physiotherapist', 'Unit | Model | physiotherapist', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/province-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('province', 'Unit | Model | province', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/question-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('question', 'Unit | Model | question', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/question-type-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('question-type', 'Unit | Model | question type', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/questions-list-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('questions-list', 'Unit | Model | questions list', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/recommendation-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('recommendation', 'Unit | Model | recommendation', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/self-start-user-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('self-start-user', 'Unit | Model | self start user', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/test-result-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('test-result', 'Unit | Model | test result', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/to-do-list-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('to-do-list', 'Unit | Model | to do list', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/to-do-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('to-do', 'Unit | Model | to do', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/models/treatment-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('treatment', 'Unit | Model | treatment', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('front-end/tests/unit/routes/about-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:about', 'Unit | Route | about', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/admin-profile-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:admin-profile', 'Unit | Route | admin profile', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/admin-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:admin', 'Unit | Route | admin', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/appointments-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:appointments', 'Unit | Route | appointments', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/assessment-tests-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:assessment-tests', 'Unit | Route | assessment tests', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/blog-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:blog', 'Unit | Route | blog', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/book-appointment-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:book-appointment', 'Unit | Route | book appointment', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/clients-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:clients', 'Unit | Route | clients', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/create-accounts-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:create-accounts', 'Unit | Route | create accounts', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/faq-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:faq', 'Unit | Route | faq', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/forms-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:forms', 'Unit | Route | forms', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/generate-reports-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:generate-reports', 'Unit | Route | generate reports', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/how-it-works-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:how-it-works', 'Unit | Route | how it works', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/howitworks-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:howitworks', 'Unit | Route | howitworks', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/log-out-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:log-out', 'Unit | Route | log out', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/make-payment-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:make-payment', 'Unit | Route | make payment', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/manage-users-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:manage-users', 'Unit | Route | manage users', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/my-images-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:my-images', 'Unit | Route | my images', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/patient-images-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:patient-images', 'Unit | Route | patient images', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/patient-profiles-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:patient-profiles', 'Unit | Route | patient profiles', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/physio-completed-injury-forms-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:physio-completed-injury-forms', 'Unit | Route | physio completed injury forms', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/physio-profile-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:physio-profile', 'Unit | Route | physio profile', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/questions-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:questions', 'Unit | Route | questions', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/services-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:services', 'Unit | Route | services', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/routes/treatments-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:treatments', 'Unit | Route | treatments', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('front-end/tests/unit/services/ouda-auth-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:ouda-auth', 'Unit | Service | ouda auth', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('front-end/tests/unit/utils/file-object-test', ['front-end/utils/file-object', 'qunit'], function (_fileObject, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | file object');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _fileObject.default)();
    assert.ok(result);
  });
});
require('front-end/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
