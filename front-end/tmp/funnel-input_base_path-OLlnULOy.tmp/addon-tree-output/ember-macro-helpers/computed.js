define('ember-macro-helpers/computed', ['exports', 'ember-macro-helpers/-build-computed', 'ember-macro-helpers/collapse-keys', 'ember-macro-helpers/get-value', 'ember-macro-helpers/flatten-keys'], function (exports, _emberMacroHelpersBuildComputed, _emberMacroHelpersCollapseKeys, _emberMacroHelpersGetValue, _emberMacroHelpersFlattenKeys) {
  exports['default'] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _emberMacroHelpersBuildComputed['default'])(args, _emberMacroHelpersCollapseKeys['default'], _emberMacroHelpersGetValue['default'], _emberMacroHelpersFlattenKeys['default']);
  };
});