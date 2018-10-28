define('ember-moment/services/moment', ['exports', 'ember', 'moment'], function (exports, _ember, _moment2) {
  var computed = _ember['default'].computed;
  var _get = _ember['default'].get;
  var getProperties = _ember['default'].getProperties;
  var _set = _ember['default'].set;
  var logger = _ember['default'].Logger;
  exports['default'] = _ember['default'].Service.extend(_ember['default'].Evented, {
    _timeZone: null,

    locale: null,
    defaultFormat: null,

    timeZone: computed('_timeZone', {
      get: function get() {
        return _get(this, '_timeZone');
      },

      set: function set(propertyKey, timeZone) {
        if (!_moment2['default'].tz) {
          logger.warn('[ember-moment] attempted to set timezone, but moment-timezone is not setup.');
          return;
        }

        _set(this, '_timeZone', timeZone);

        return timeZone;
      }
    }),

    setLocale: function setLocale(locale) {
      this.changeLocale(locale);
    },

    changeLocale: function changeLocale(locale) {
      _set(this, 'locale', locale);
      _moment2['default'].locale(locale);
      this.trigger('localeChanged', locale);
    },

    setTimeZone: function setTimeZone(timeZone) {
      this.changeTimeZone(timeZone);
    },

    changeTimeZone: function changeTimeZone(timeZone) {
      _set(this, 'timeZone', timeZone);
      this.trigger('timeZoneChanged', timeZone);
    },

    isMoment: function isMoment(obj) {
      return _moment2['default'].isMoment(obj);
    },

    moment: function moment() {
      var momentObj = _moment2['default'].apply(undefined, arguments);

      var _getProperties = getProperties(this, 'locale', 'timeZone');

      var locale = _getProperties.locale;
      var timeZone = _getProperties.timeZone;

      if (locale && momentObj.locale) {
        momentObj = momentObj.locale(locale);
      }

      if (timeZone && momentObj.tz) {
        momentObj = momentObj.tz(timeZone);
      }

      return momentObj;
    }
  });
});