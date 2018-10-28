import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    questionModel: computed(function(){
        return this.get('store').findAll('question');
    }),
    questionsListsQuestions: [],
    pairModel: [],
    postsData: null,
    title: oneWay('postsData.title'),
    body: oneWay('postsData.body'),
    modalName: Ember.computed(function(){
        return 'Modify-Form' + this.get('ID');
    }),
    actions:{
        openModal: function () {
            var self = this;
            var myStore = this.get('store');

            var questionsListsQuestions = [];
            var questionIds = [];

            this.set('newQuestions', []);
            this.set('questionsCount', 0);

            var form;

            myStore.findRecord('form', this.get('ID'), {reload: true})
            .then(function(theForm){
                form = theForm;
                for(var i = 0; i < form.get('questionsLists').length; i++){
                    questionsListsQuestions[form.get('questionsLists')[i]] = 1; // questionsListsQuestions: existing questionsListId's -> 1
                }
                self.set('existingQuestionsLists', form.get('questionsLists'));
                return myStore.findAll('questions-list', {reload: true});
            }).then(function(questionsLists){
                questionsLists.forEach(function(questionsList){
                    if(questionsListsQuestions[questionsList.id]){
                        var questionsListJSON = JSON.parse(JSON.stringify(questionsList));
                        questionsListJSON.id = questionsList.id;
                        questionsListsQuestions[questionsList.id] = questionsListJSON;  // questionsListsQuestions: existing questionsListId's -> questionsList
                        questionIds[questionsListJSON.question] = 1;    // questionIds: question id's -> 1
                    }
                });
                return myStore.findAll('question', {reload: true});
            }).then(function(questions){
                questions.forEach(function(question){
                    if(questionIds[question.id]){
                        var questionJSON = JSON.parse(JSON.stringify(question));
                        questionJSON.id = question.id;
                        questionIds[question.id] = questionJSON;    // questionIds: question id's -> question
                    }
                });
                for(var i = 0; i < self.get('existingQuestionsLists').length; i++){
                    var obj = questionsListsQuestions[self.get('existingQuestionsLists')[i]];
                    obj.question = questionIds[obj.question];
                    questionsListsQuestions[self.get('existingQuestionsLists')[i]] = obj;
                }
                var model = [];
                for(var i = 0; i < self.get('existingQuestionsLists').length; i++){
                    model.push(questionsListsQuestions[self.get('existingQuestionsLists')[i]]);
                }
                self.set('questionsListsQuestions', model);
                self.notifyPropertyChange('questionsListsQuestions');
            });



            $('.ui.' + this.get('modalName') + '.modal').modal({
                closable: false,
                transition: 'fade',
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    if(!this.get('name')){
                        alert('Please enter a Name.');
                        return false;
                    }
                    if(!this.get('description')){
                        alert('Please enter a Description.');
                        return false;
                    }

                    for(var i = 0; i < this.get('newQuestions').length; i++){
                        if(!this.get('newQuestions')[i].question){
                            alert('Must select a Question for every new question.');
                            return false;
                        }
                    }

                    form.set('name', self.get('name'));
                    form.set('description', self.get('description'));

                    form.save({reload: true})
                    .then(function(){
                        var questionsListsToRemove = [];

                        // start by assuming that we'll remove all of the questionsLists of the form
                        for(var i in questionsListsQuestions){
                            if(questionsListsQuestions.hasOwnProperty(i)){
                                questionsListsToRemove.push(i);
                            }
                        }

                        // go through the questionsLists that are still in the modal, and stop them from being removed
                        for(var i = 0; i < self.get('questionsListsQuestions').length; i++){
                            questionsListsToRemove.splice(questionsListsToRemove.indexOf(self.get('questionsListsQuestions')[i]), 1);
                        }

                        function removeQuestionsLists(index){
                            if(index < questionsListsToRemove.length){
                                myStore.findRecord('questions-list', questionsListsToRemove[index], {reload: true})
                                .then(function(questionsList){
                                    return questionsList.destroyRecord();
                                }).then(function(){
                                    return removeQuestionsLists(index + 1);
                                });
                            }
                            else{

                            }
                        }

                        return removeQuestionsLists(0);
                    }).then(function(){
                        function addQuestionsLists(index){
                            if(index < self.get('newQuestions').length){
                                var newQuestionsList = myStore.createRecord('questions-list', {
                                    form: self.get('ID'),
                                    question: self.get('newQuestions')[index].question
                                });
                                newQuestionsList.save({reload: true})
                                .then(function(){
                                    return addQuestionsLists(index + 1);
                                });
                            }
                        }

                        return addQuestionsLists(0);
                    }).then(function(){
                        alert('Form saved.');
                    });
                }
            }).modal('show');
          },
          removeExistingQuestionsList: function(questionsList){
              for(var i = 0; i < this.get('questionsListsQuestions').length; i++){
                  if(this.get('questionsListsQuestions')[i].id === questionsList.id){
                      var model = this.get('questionsListsQuestions');
                      model.splice(i, 1);
                      this.set('questionsListsQuestions', model);
                      this.notifyPropertyChange('questionsListsQuestions');
                      return;
                  }
              }
          },
          addQuestion: function(){
            var model = this.get('newQuestions');
            var obj = { question: null, id: this.get('questionsCount')};
            this.set('questionsCount', this.get('questionsCount') + 1);
            model.push(obj);
            this.set('newQuestions', model);
            this.notifyPropertyChange('newQuestions');
          },
          removeNewQuestion: function(question){
            var model = this.get('newQuestions');
            model.splice(model.indexOf(question), 1);
            this.set('newQuestions', model);
            this.notifyPropertyChange('newQuestions');
          },
          selectQuestion: function(question, questionId){
            var model = this.get('newQuestions');
            var index = model.indexOf(question);
            var obj = model[index];
            obj.question = questionId;
            model[index] = obj;
            this.set('newQuestions', model);
            this.notifyPropertyChange('newQuestions');
          }
      },
      didInsertElement: function() {
        /* Init the table and fire off a call to get the hidden nodes. */
        $(document).ready(function() {
            var table = $('#example').DataTable();
          } );
        }
  });
