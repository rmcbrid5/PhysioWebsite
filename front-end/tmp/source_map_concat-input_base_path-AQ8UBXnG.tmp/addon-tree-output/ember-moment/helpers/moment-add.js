define('ember-moment/helpers/moment-add', ['exports', 'ember', 'ember-moment/utils/helper-compute', 'ember-moment/helpers/-base'], function (exports, _ember, _emberMomentUtilsHelperCompute, _emberMomentHelpersBase) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  exports['default'] = _emberMomentHelpersBase['default'].extend({
    moment: _ember['default'].inject.service(),

    globalAllowEmpty: false,

    compute: (0, _emberMomentUtilsHelperCompute['default'])(function (params, _ref) {
      var _morphMoment;

      var precision = _ref.precision;
      var locale = _ref.locale;
      var timeZone = _ref.timeZone;

      this._super.apply(this, arguments);

      var moment = this.get('moment');
      var length = params.length;

      var args = [];
      var additionArgs = [];

      if (length === 1) {
        additionArgs.push(params[0]);
      } else if (length === 2 && _ember['default'].typeOf(params[0]) === 'number' && _ember['default'].typeOf(params[1]) === 'string') {
        additionArgs.push.apply(additionArgs, _toConsumableArray(params));
      } else {
        args.push(params[0]);
        additionArgs.push.apply(additionArgs, _toConsumableArray(params.slice(1)));
      }

      return (_morphMoment = this.morphMoment(moment.moment.apply(moment, args), { locale: locale, timeZone: timeZone })).add.apply(_morphMoment, additionArgs.concat([precision]));
    })
  });
});