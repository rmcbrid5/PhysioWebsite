define('front-end/components/appt-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    didInsertElement: function didInsertElement() {
      /* Init the table and fire off a call to get the hidden nodes. */
      $(document).ready(function () {
        var table = $('#example').DataTable();
      });
    }
  });
});