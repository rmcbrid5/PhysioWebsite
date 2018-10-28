define('ember-moment/helpers/is-same', ['exports', 'moment', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _moment, _emberMomentUtilsHelperCompute, _emberMomentHelpersBase) {
  exports['default'] = _emberMomentHelpersBase['default'].extend({
    globalAllowEmpty: false,

    compute: (0, _emberMomentUtilsHelperCompute['default'])(function (params, _ref) {
      var _morphMoment;

      var precision = _ref.precision;
      var locale = _ref.locale;
      var timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var length = params.length;

      var args = [];
      var comparisonArgs = [];

      if (length === 1) {
        comparisonArgs.push(params[0]);
      } else if (length === 2) {
        args.push(params[0]);
        comparisonArgs.push(params[1]);
      }

      return (_morphMoment = this.morphMoment(_moment['default'].apply(undefined, args), { locale: locale, timeZone: timeZone })).isSame.apply(_morphMoment, comparisonArgs.concat([precision]));
    })
  });
});