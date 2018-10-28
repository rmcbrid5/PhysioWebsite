import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    questionModel: computed(function(){
        return this.get('store').findAll('question');
    }),
    actions:{
      addQuestion: function(){
            var model = this.get('questionsModel');
            var obj = { id: this.get('questionCount') };
            this.set('questionCount', this.get('questionCount') + 1);
            model.push(obj);
            this.set('questionsModel', model);
            this.notifyPropertyChange('questionsModel');
      },
        openModal: function () {
            this.set('name', null);
            this.set('description', null);
            this.set('questions', []);
            this.set('questionsModel', []);
            this.set('map', []);
            this.set('questionCount', 0);
            $('.ui.newForm.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    var self = this;
                    var myStore = this.get('store');
                    if(!this.get('name')){
                        alert('Please enter a Name.');
                        return false;
                    }
                    if(!this.get('description')){
                        alert('Please enter a Description.');
                    }
                    for(var i = 0; i < this.get('questionsModel').length; i++){
                        if(!this.get('questionsModel')[i].question){
                            alert('Must select a Question for every added question.');
                            return false;
                        }
                    }
                    var newForm = myStore.createRecord('form', {
                        name: self.get('name'),
                        description: self.get('description'),
                        administrator: self.get('oudaAuth').getPerson()
                    });
                    newForm.save({reload: true})
                    .then(function(){
                        for(var i = 0; i < self.get('questionsModel').length; i++){
                            var newQuestionsList = myStore.createRecord('questions-list', {
                                form: newForm.id,
                                question: self.get('questionsModel')[i].question
                            });
                            newQuestionsList.save();
                        }
                    }).then(function(){
                        alert('Form created.');
                    });
                }
            }).modal('show');
        },
        removeQuestion: function(question){
            var model = this.get('questionsModel');
            var index = model.indexOf(question);
            model.splice(index, 1);
            this.set('questionsModel', objModel);
            this.notifyPropertyChange('questionsModel');
        },
        selectQuestion: function(question, questionId){
            for(var i = 0; i < this.get('questionsModel').length; i++){
                if(this.get('questionsModel')[i].id === question.id){
                    var model = this.get('questionsModel');
                    model[i].question = questionId;
                    this.set('questionsModel', model);
                    return;
                }
            }
        }
    }
});
