define('ember-moment/helpers/moment-to-date', ['exports', 'moment', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _moment, _emberMomentUtilsHelperCompute, _emberMomentHelpersBase) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  exports['default'] = _emberMomentHelpersBase['default'].extend({
    globalAllowEmpty: false,

    compute: (0, _emberMomentUtilsHelperCompute['default'])(function (params, _ref) {
      var _morphMoment;

      var hidePrefix = _ref.hidePrefix;
      var locale = _ref.locale;
      var timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      return (_morphMoment = this.morphMoment((0, _moment['default'])(), { locale: locale, timeZone: timeZone })).to.apply(_morphMoment, _toConsumableArray(params).concat([hidePrefix]));
    })
  });
});