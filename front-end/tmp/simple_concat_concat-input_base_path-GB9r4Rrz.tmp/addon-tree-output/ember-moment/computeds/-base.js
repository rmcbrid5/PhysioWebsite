define('ember-moment/computeds/-base', ['exports', 'ember-macro-helpers/computed-unsafe'], function (exports, _emberMacroHelpersComputedUnsafe) {
  exports['default'] = computedFactory;

  function computedFactory(fn) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.push(function () {
        for (var _len2 = arguments.length, vals = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          vals[_key2] = arguments[_key2];
        }

        return fn.call(this, vals);
      });

      return _emberMacroHelpersComputedUnsafe['default'].apply(undefined, args);
    };
  }
});