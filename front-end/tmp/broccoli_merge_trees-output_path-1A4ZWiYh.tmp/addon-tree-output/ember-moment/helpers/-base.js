define('ember-moment/helpers/-base', ['exports', 'ember'], function (exports, _ember) {
  var observer = _ember['default'].observer;
  var inject = _ember['default'].inject;
  var get = _ember['default'].get;
  var Helper = _ember['default'].Helper;
  var run = _ember['default'].run;
  exports['default'] = Helper.extend({
    moment: inject.service(),
    disableInterval: false,

    localeOrTimeZoneChanged: observer('moment.locale', 'moment.timeZone', function () {
      this.recompute();
    }),

    compute: function compute(value, _ref) {
      var _this = this;

      var interval = _ref.interval;

      if (get(this, 'disableInterval')) {
        return;
      }

      this.clearTimer();

      if (interval) {
        /*
         * NOTE: intentionally a setTimeout so tests do not block on it
         * as the run loop queue is never clear so tests will stay locked waiting
         * for queue to clear.
         */
        this.intervalTimer = setTimeout(function () {
          run(function () {
            return _this.recompute();
          });
        }, parseInt(interval, 10));
      }
    },

    morphMoment: function morphMoment(time, _ref2) {
      var locale = _ref2.locale;
      var timeZone = _ref2.timeZone;

      var momentService = get(this, 'moment');

      locale = locale || get(momentService, 'locale');
      timeZone = timeZone || get(momentService, 'timeZone');

      if (locale && time.locale) {
        time = time.locale(locale);
      }

      if (timeZone && time.tz) {
        time = time.tz(timeZone);
      }

      return time;
    },

    clearTimer: function clearTimer() {
      clearTimeout(this.intervalTimer);
    },

    destroy: function destroy() {
      this.clearTimer();
      this._super.apply(this, arguments);
    }
  });
});