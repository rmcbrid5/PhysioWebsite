import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    DS: inject('store'),
    modalName: computed(function(){
        return 'Delete-Questions' + this.get('ID');
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
                    this.get('DS').find('question', this.get('ID'), {reload: true})
                    .then(function(question){
                        return question.destroyRecord();
                    });
                    return true;
                }
            }).modal('show');
        },
    }
});