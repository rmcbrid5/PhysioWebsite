define('front-end/controllers/rehab-plans', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    didInsertElement: function didInsertElement() {
      /* Init the table and fire off a call to get the hidden nodes. */
      $(document).ready(function () {
        var table = $('#example').DataTable();
      });
    }
    // actions:{
    //   didInsertElement: function() {
    //     /* Init the table and fire off a call to get the hidden nodes. */
    //     $(document).ready(function() {
    //         var table = $('#example').DataTable();
    //       } );
    //     }
    //
    // }
  });
});