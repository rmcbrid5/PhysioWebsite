define('ember-pikaday/helpers/pikaday', ['exports', 'ember'], function (exports, _ember) {

  var $ = _ember['default'].$;

  var openDatepicker = function openDatepicker(element) {
    $(element).click();

    return PikadayInteractor;
  };

  var PikadayInteractor = {
    selectorForMonthSelect: '.pika-lendar:visible .pika-select-month',
    selectorForYearSelect: '.pika-lendar:visible .pika-select-year',
    selectDate: function selectDate(date) {
      var day = date.getDate();
      var month = date.getMonth();
      var year = date.getFullYear();
      var selectEvent = 'ontouchend' in document ? 'touchend' : 'mousedown';

      $(this.selectorForYearSelect).val(year);
      triggerNativeEvent($(this.selectorForYearSelect)[0], 'change');
      $(this.selectorForMonthSelect).val(month);
      triggerNativeEvent($(this.selectorForMonthSelect)[0], 'change');

      triggerNativeEvent($('td[data-day="' + day + '"] button:visible')[0], selectEvent);
    },
    selectedDay: function selectedDay() {
      return $('.pika-single td.is-selected button').html();
    },
    selectedMonth: function selectedMonth() {
      return $(this.selectorForMonthSelect + ' option:selected').val();
    },
    selectedYear: function selectedYear() {
      return $(this.selectorForYearSelect + ' option:selected').val();
    },
    minimumYear: function minimumYear() {
      return $(this.selectorForYearSelect).children().first().val();
    },
    maximumYear: function maximumYear() {
      return $(this.selectorForYearSelect).children().last().val();
    }
  };

  function triggerNativeEvent(element, eventName) {
    if (document.createEvent) {
      var event = document.createEvent('Events');
      event.initEvent(eventName, true, false);
      element.dispatchEvent(event);
    } else {
      element.fireEvent('on' + eventName);
    }
  }

  exports.openDatepicker = openDatepicker;
});