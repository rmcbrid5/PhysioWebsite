import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    DS: inject('store'),
    modalName: computed(function(){
        return 'Delete-Plans' + this.get('ID');
    }),
    actions:{
        openModal: function() {
            $('.ui.'+this.get('modalName')+'.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    this.get('DS').findRecord('rehabilitationPlan', this.get('ID'), {reload: true}).then((post) => {
                        post.destroyRecord().then(() => {
                            return true;
                        });
                    })
                }
            })
            .modal('show');
        },
    }
});