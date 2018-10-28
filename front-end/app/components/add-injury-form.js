import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    formModel: computed(function(){
        return this.get('store').findAll('form');
    }),

    actions:{
        openModal: function () {
            this.set('name', null);
            this.set('form', null);
            $('.ui.newInjuryForm.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    var newPost = this.get('store').createRecord('injury-form', {
                        name: this.get('name'),
                        form: this.get('form').id,
                    });
                    newPost.save().then(()=> {
                        alert('saved.');
                    });
                    return true;
                }
            }).modal('show');
        }
    }
});