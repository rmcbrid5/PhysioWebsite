import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    postsData: null,
    title: oneWay('postsData.title'),
    body: oneWay('postsData.body'),
    modalName: Ember.computed(function(){
        return 'Assesment-Test' + this.get('ID');
    }),
    actions:  {
      openModal: function () {
        var self = this;
        var myStore = this.get('store');

          $('.ui.'+this.get('modalName')+'.modal').modal({
                closable: false,
                transition: 'fade',
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    return true;
                }

          }).modal('show');
        },
        didInsertElement: function() {
          /* Init the table and fire off a call to get the hidden nodes. */
          $(document).ready(function() {
              var table = $('#example').DataTable();
            } );
          }
      }

});
