define('ember-macro-helpers/get-value-unsafe', ['exports', 'ember-macro-helpers/get-value'], function (exports, _emberMacroHelpersGetValue) {
  exports['default'] = function (context, key) {
    var value = (0, _emberMacroHelpersGetValue['default'])(context, key);
    if (value) {
      return value;
    }

    return key;
  };
});