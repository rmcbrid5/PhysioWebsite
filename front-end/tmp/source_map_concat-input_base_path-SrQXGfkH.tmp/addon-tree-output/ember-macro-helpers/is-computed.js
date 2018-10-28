define('ember-macro-helpers/is-computed', ['exports', 'ember'], function (exports, _ember) {
  var ComputedProperty = _ember['default'].ComputedProperty;

  exports['default'] = function (key) {
    return key instanceof ComputedProperty;
  };
});