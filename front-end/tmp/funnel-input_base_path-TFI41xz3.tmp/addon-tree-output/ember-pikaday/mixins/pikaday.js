define('ember-pikaday/mixins/pikaday', ['exports', 'ember', 'moment'], function (exports, _ember, _moment) {
  var isPresent = _ember['default'].isPresent;
  var run = _ember['default'].run;
  var getProperties = _ember['default'].getProperties;

  var assign = _ember['default'].assign || _ember['default'].merge;

  exports['default'] = _ember['default'].Mixin.create({

    _options: _ember['default'].computed('options', 'i18n', {
      get: function get() {
        var options = this._defaultOptions();

        if (isPresent(this.get('i18n'))) {
          if (isPresent(this.get('i18n').t)) {
            options.i18n = {
              previousMonth: this.get('i18n').t('previousMonth').toString(),
              nextMonth: this.get('i18n').t('nextMonth').toString(),
              months: this.get('i18n').t('months').toString().split(','),
              weekdays: this.get('i18n').t('weekdays').toString().split(','),
              weekdaysShort: this.get('i18n').t('weekdaysShort').toString().split(',')
            };
          } else {
            options.i18n = this.get('i18n');
          }
        }
        if (isPresent(this.get('position'))) {
          options.position = this.get('position');
        }
        if (isPresent(this.get('reposition'))) {
          options.reposition = this.get('reposition');
        }

        assign(options, this.get('options') || {});
        return options;
      }
    }),

    _defaultOptions: function _defaultOptions() {
      var firstDay = this.get('firstDay');

      return {
        field: this.get('field'),
        container: this.get('pikadayContainer'),
        bound: this.get('pikadayContainer') ? false : true,
        onOpen: run.bind(this, this.onPikadayOpen),
        onClose: run.bind(this, this.onPikadayClose),
        onSelect: run.bind(this, this.onPikadaySelect),
        onDraw: run.bind(this, this.onPikadayRedraw),
        firstDay: typeof firstDay !== 'undefined' ? parseInt(firstDay, 10) : 1,
        format: this.get('format') || 'DD.MM.YYYY',
        yearRange: this.determineYearRange(),
        minDate: this.get('minDate') || null,
        maxDate: this.get('maxDate') || null,
        defaultDate: this.get('defaultDate') || null,
        setDefaultDate: !!this.get('defaultDate'),
        theme: this.get('theme') || null
      };
    },

    /**
     * When updating attrs, we need to reset some things in case they've changed.
     * @public
     * @memberOf {Mixins.Pikaday}
     * @return {undefined}
     */
    didUpdateAttrs: function didUpdateAttrs() {
      var _this = this;

      run.later(function () {
        _this.setMinDate();
        _this.setMaxDate();
        _this.setPikadayDate();

        if (_this.get('options')) {
          _this._updateOptions();
        }
      });
    },

    didRender: function didRender() {
      this._super();
      this.autoHideOnDisabled();
    },

    setupPikaday: function setupPikaday() {
      var pikaday = new Pikaday(this.get('_options'));

      if (this.get('defaultDate')) {
        this.set('value', this.get('defaultDate'));
      }

      this.set('pikaday', pikaday);
      this.setPikadayDate();
    },

    willDestroyElement: function willDestroyElement() {
      this._super();
      this.get('pikaday').destroy();
    },

    setPikadayDate: function setPikadayDate() {
      var format = 'YYYY-MM-DD';
      var value = this.get('value');

      if (!value) {
        this.get('pikaday').setDate(value, true);
      } else {
        var date = this.get('useUTC') ? (0, _moment['default'])(_moment['default'].utc(value).format(format), format).toDate() : value;

        this.get('pikaday').setDate(date, true);
      }
    },

    setMinDate: function setMinDate() {
      var _this2 = this;

      var _getProperties = getProperties(this, ['pikaday', 'minDate', 'value']);

      var pikaday = _getProperties.pikaday;
      var minDate = _getProperties.minDate;
      var value = _getProperties.value;

      if (minDate) {
        var _minDate = new Date(minDate.getTime());
        pikaday.setMinDate(_minDate);

        // If the current date is lower than minDate we set date to minDate
        run.schedule('sync', function () {
          if (value && (0, _moment['default'])(value, _this2.get('format')).isBefore(minDate, 'day')) {
            pikaday.setDate(minDate);
          }
        });
      }
    },

    setMaxDate: function setMaxDate() {
      var _getProperties2 = getProperties(this, ['pikaday', 'maxDate', 'value']);

      var pikaday = _getProperties2.pikaday;
      var maxDate = _getProperties2.maxDate;
      var value = _getProperties2.value;

      if (maxDate) {
        var _maxDate = new Date(maxDate.getTime());
        pikaday.setMaxDate(_maxDate);

        // If the current date is greater than maxDate we set date to maxDate
        run.schedule('sync', function () {
          if (value > maxDate) {
            pikaday.setDate(maxDate);
          }
        });
      }
    },

    onOpen: function onOpen() {},
    onClose: function onClose() {},
    onSelection: function onSelection() {},
    onDraw: function onDraw() {},

    onPikadaySelect: function onPikadaySelect() {
      this.userSelectedDate();
    },

    onPikadayRedraw: function onPikadayRedraw() {
      this.get('onDraw')();
    },

    userSelectedDate: function userSelectedDate() {
      var selectedDate = this.get('pikaday').getDate();

      if (this.get('useUTC')) {
        selectedDate = _moment['default'].utc([selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()]).toDate();
      }

      this.get('onSelection')(selectedDate);
    },

    determineYearRange: function determineYearRange() {
      var yearRange = this.get('yearRange');

      if (yearRange) {
        if (yearRange.indexOf(',') > -1) {
          var yearArray = yearRange.split(',');

          if (yearArray[1] === 'currentYear') {
            yearArray[1] = new Date().getFullYear();
          }

          return yearArray;
        } else {
          return yearRange;
        }
      } else {
        return 10;
      }
    },

    autoHideOnDisabled: function autoHideOnDisabled() {
      if (this.get('disabled') && this.get('pikaday')) {
        this.get('pikaday').hide();
      }
    },

    _updateOptions: function _updateOptions() {
      this.get('pikaday').config(this.get('_options'));
    }
  });
});
/* globals Pikaday */