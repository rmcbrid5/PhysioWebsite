import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    modalName: computed(function(){
        return 'Delete-Injury-Forms' + this.get('ID');
    }),
    actions:{
        openModal: function() {
            var myStore = this.get('store');
            $('.ui.'+this.get('modalName')+'.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    myStore.findRecord('injuryForm', this.get('ID'), {reload: true}).then((injuryForm) => {
                        injuryForm.destroyRecord().then(() => {
                            alert('Injury Form deleted.');
                        });
                    })
                }
            }).modal('show');
        },
    },
    didInsertElement: function() {
        /* Init the table and fire off a call to get the hidden nodes. */
        $(document).ready(function() {
            var table = $('#example').DataTable();
          } );
        }
});