import Controller from '@ember/controller';

export default Controller.extend({
  didInsertElement: function() {
    /* Init the table and fire off a call to get the hidden nodes. */
    $(document).ready(function() {
        var table = $('#example').DataTable();
      } );
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
