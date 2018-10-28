import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    questionTypeModel: computed(function(){
        return this.get('store').findAll('question-type');
    }),
    actions:{
        openModal: function () {
            this.set('questionText', null);
            this.set('helpDescription', null);
            this.set('questionType', null);
            $('.ui.newQuestion.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    var self = this;
                    var myStore = this.get('store');

                    if(!self.get('questionText')){
                        alert('Please enter Question Text.');
                        return false;
                    }
                    if(!self.get('helpDescription')){
                        alert('Please enter a Help Description.');
                        return false;
                    }
                    if(!self.get('questionType')){
                        alert('Please select a Question Type.');
                        return false;
                    }
                    var newQuestion = myStore.createRecord('question', {
                        questionText: self.get('questionText'),
                        helpDescription: self.get('helpDescription'),
                        questionType: self.get('questionType')
                   });
                   newQuestion.save()
                   .then(function(){
                       alert('Question created.');
                   });
                   return true;
                }
            }).modal('show');
        }
    }
});
