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