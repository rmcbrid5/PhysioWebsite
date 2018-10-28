define('ember-macro-helpers/flatten-keys-unsafe', ['exports', 'ember-macro-helpers/flatten-keys'], function (exports, _emberMacroHelpersFlattenKeys) {
  exports['default'] = function (keys) {
    var flattenedKeys = (0, _emberMacroHelpersFlattenKeys['default'])(keys);

    return flattenedKeys.reduce(function (flattenedKeys, key) {
      // keys with spaces throw an exception
      // treat as a literal and ignore
      var hasSpaces = key.indexOf(' ') !== -1;
      if (!hasSpaces) {
        flattenedKeys.push(key);
      }
      return flattenedKeys;
    }, []);
  };
});