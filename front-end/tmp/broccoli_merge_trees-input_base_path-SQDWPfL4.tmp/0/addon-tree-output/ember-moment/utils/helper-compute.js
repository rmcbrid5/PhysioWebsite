define('ember-moment/utils/helper-compute', ['exports', 'ember'], function (exports, _ember) {
  var isBlank = _ember['default'].isBlank;
  var get = _ember['default'].get;
  var warn = _ember['default'].Logger.warn;

  exports['default'] = function (cb) {
    return function (params, hash) {
      if (!params || params && params.length === 0) {
        throw new TypeError('ember-moment: Invalid Number of arguments, expected at least 1');
      }

      var datetime = params[0];

      var allowEmpty = hash.allowEmpty || hash['allow-empty'];

      if (allowEmpty === undefined || allowEmpty === null) {
        allowEmpty = !!get(this, 'globalAllowEmpty');
      }

      if (isBlank(datetime)) {
        if (allowEmpty) {
          return;
        }

        warn('ember-moment: an empty value (null, undefined, or "") was passed to moment-format');
      }

      return cb.apply(this, arguments);
    };
  };
});