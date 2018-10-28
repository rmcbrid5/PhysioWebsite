define('front-end/tests/unit/utils/file-object-test', ['front-end/utils/file-object', 'qunit'], function (_fileObject, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | file object');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _fileObject.default)();
    assert.ok(result);
  });
});