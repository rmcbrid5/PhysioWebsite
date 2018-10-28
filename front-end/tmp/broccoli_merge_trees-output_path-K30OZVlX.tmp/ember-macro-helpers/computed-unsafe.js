define('ember-macro-helpers/computed-unsafe', ['exports', 'ember-macro-helpers/-build-computed', 'ember-macro-helpers/get-value-unsafe', 'ember-macro-helpers/flatten-keys-unsafe'], function (exports, _emberMacroHelpersBuildComputed, _emberMacroHelpersGetValueUnsafe, _emberMacroHelpersFlattenKeysUnsafe) {

  var collapseKeys = function collapseKeys(keys) {
    return keys;
  };

  exports['default'] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _emberMacroHelpersBuildComputed['default'])(args, collapseKeys, _emberMacroHelpersGetValueUnsafe['default'], _emberMacroHelpersFlattenKeysUnsafe['default']);
  };
});