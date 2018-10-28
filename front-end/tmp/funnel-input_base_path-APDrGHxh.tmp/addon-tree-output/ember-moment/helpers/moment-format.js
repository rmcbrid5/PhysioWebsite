define('ember-moment/helpers/moment-format', ['exports', 'ember', 'moment', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _ember, _moment, _emberMomentUtilsHelperCompute, _emberMomentHelpersBase) {
  var observer = _ember['default'].observer;
  var isEmpty = _ember['default'].isEmpty;
  var get = _ember['default'].get;
  exports['default'] = _emberMomentHelpersBase['default'].extend({
    globalAllowEmpty: false,

    defaultFormatDidChange: observer('moment.defaultFormat', function () {
      this.recompute();
    }),

    compute: (0, _emberMomentUtilsHelperCompute['default'])(function (params, _ref) {
      var _morphMoment;

      var locale = _ref.locale;
      var timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var length = params.length;

      if (length > 3) {
        throw new TypeError('ember-moment: Invalid Number of arguments, expected at most 4');
      }

      var args = [];
      var formatArgs = [];
      var defaultFormat = get(this, 'moment.defaultFormat');

      args.push(params[0]);

      if (length === 1 && !isEmpty(defaultFormat)) {
        formatArgs.push(defaultFormat);
      } else if (length === 2) {
        formatArgs.push(params[1]);
      } else if (length > 2) {
        args.push(params[2]);
        formatArgs.push(params[1]);
      }

      return (_morphMoment = this.morphMoment(_moment['default'].apply(undefined, args), { locale: locale, timeZone: timeZone })).format.apply(_morphMoment, formatArgs);
    })
  });
});