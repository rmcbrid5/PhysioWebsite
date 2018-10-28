import Component from '@ember/component';

export default Component.extend({
  didInsertElement: function() {
    /* Init the table and fire off a call to get the hidden nodes. */
    $(document).ready(function() {
      var table = $('#example').DataTable();
    } );
  }
});