define('ember-macro-helpers/get-value', ['exports', 'ember-metal/get', 'ember-macro-helpers/is-computed'], function (exports, _emberMetalGet, _emberMacroHelpersIsComputed) {
  exports['default'] = function (context, key) {
    if ((0, _emberMacroHelpersIsComputed['default'])(key)) {
      return key._getter.call(context);
    }

    if (typeof key !== 'string') {
      return key;
    }

    return (0, _emberMetalGet['default'])(context, key);
  };
});