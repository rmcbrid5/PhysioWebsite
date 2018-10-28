define('ember-macro-helpers/collapse-keys', ['exports', 'ember-macro-helpers/expand-property'], function (exports, _emberMacroHelpersExpandProperty) {
  exports['default'] = function (keys) {
    return keys.reduce(function (newKeys, key) {
      if (typeof key === 'string') {
        newKeys = newKeys.concat((0, _emberMacroHelpersExpandProperty['default'])(key));
      } else {
        newKeys.push(key);
      }
      return newKeys;
    }, []);
  };
});