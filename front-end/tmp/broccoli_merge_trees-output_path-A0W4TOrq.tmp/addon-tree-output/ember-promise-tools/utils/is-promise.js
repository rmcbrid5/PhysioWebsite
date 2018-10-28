define('ember-promise-tools/utils/is-promise', ['exports'], function (exports) {
  exports['default'] = function (maybePromise) {
    if (maybePromise != null && typeof maybePromise.then === 'function') {
      return true;
    }
    return false;
  };
});